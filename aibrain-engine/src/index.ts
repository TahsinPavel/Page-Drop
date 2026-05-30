import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import * as fs from 'fs';
import * as path from 'path';

// 1. Initialize the explicit core Protocol Server
const server = new Server(
  {
    name: "aibrain-static-graph",
    version: "1.0.0"
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

interface CodeNode {
  id: string;
  type: 'Frontend_Component' | 'Backend_Router';
  dependencies: string[];
}

function gatherFiles(dirPath: string, extensions: string[]): string[] {
  let matchedFiles: string[] = [];
  if (!fs.existsSync(dirPath)) return matchedFiles;

  const entries = fs.readdirSync(dirPath);
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry);
    const stat = fs.statSync(fullPath);

    if (stat && stat.isDirectory()) {
      if (!['node_modules', '.next', 'venv', '.venv', '__pycache__', 'dist', 'build'].includes(entry)) {
        matchedFiles = matchedFiles.concat(gatherFiles(fullPath, extensions));
      }
    } else {
      if (extensions.some(ext => entry.endsWith(ext))) {
        matchedFiles.push(fullPath);
      }
    }
  }
  return matchedFiles;
}

function processProjectGraph(projectRoot: string): CodeNode[] {
  const nodes: CodeNode[] = [];
  const frontendPath = path.join(projectRoot, 'frontend');
  const backendPath = path.join(projectRoot, 'backend');

  // 1. Parse Frontend Layers (Supports @/* aliases, relative imports, and packages)
  const webFiles = gatherFiles(frontendPath, ['.tsx', '.ts', '.js']);
  for (const file of webFiles) {
    const codeText = fs.readFileSync(file, 'utf-8');
    const relativeId = path.relative(projectRoot, file).replace(/\\/g, '/');

    // Enhanced Regex to capture both standard relative imports and '@/' alias structures
    const importRegex = /from\s+['"]((?:\.|\.\.|@)\/[^'"]+)['"]/g;
    const dependencies: string[] = [];
    let match;
    while ((match = importRegex.exec(codeText)) !== null) {
      const targetDependency = match[1] || '';
      if (targetDependency) {
        dependencies.push(targetDependency);
      }
    }

    nodes.push({ id: relativeId, type: 'Frontend_Component', dependencies });
  }

  // 2. Parse Backend Layers
  const serverFiles = gatherFiles(backendPath, ['.py']);
  for (const file of serverFiles) {
    const codeText = fs.readFileSync(file, 'utf-8');
    const relativeId = path.relative(projectRoot, file).replace(/\\/g, '/');

    const pyImportRegex = /(?:import\s+([a-zA-Z0-9_\\\.]+)|from\s+([a-zA-Z0-9_\\\.]+)\s+import)/g;
    const pyDependencies: string[] = [];
    let pyMatch;
    while ((pyMatch = pyImportRegex.exec(codeText)) !== null) {
      const extractedStr = pyMatch[1] || pyMatch[2] || '';
      if (extractedStr.trim() && !pyDependencies.includes(extractedStr.trim())) {
        pyDependencies.push(extractedStr.trim());
      }
    }

    nodes.push({ id: relativeId, type: 'Backend_Router', dependencies: pyDependencies });
  }

  return nodes;
}

// 2. Register capabilities using standard Request Handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_workspace_graph",
        description: "Returns a high-density static interdependency map of workspace file imports.",
        inputSchema: {
          type: "object",
          properties: {
            focusPath: {
              type: "string",
              description: "Optional relative path to a single component file to slice down context payload."
            }
          }
        }
      },
      {
        name: "get_handoff_prompt",
        description: "Generates an ultra-dense, token-optimized context restoration string for an incoming model based on the current file focus path.",
        inputSchema: {
          type: "object",
          properties: {
            currentFocusFile: {
              type: "string",
              description: "The relative path to the file you are currently editing (e.g., 'frontend/app/dashboard/page.tsx')."
            }
          },
          required: ["currentFocusFile"]
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_workspace_graph") {
    try {
      const projectWorkspaceRoot = path.resolve(process.cwd(), '..');
      const networkGraph = processProjectGraph(projectWorkspaceRoot);
      const args = (request.params.arguments || {}) as { focusPath?: string };

      if (args.focusPath) {
        const structuralFocus = args.focusPath.replace(/\\/g, '/');
        const prunedSubGraph = networkGraph.filter(node => 
          node.id === structuralFocus || node.dependencies.some(dep => dep.includes(structuralFocus))
        );
        return {
          content: [{ type: "text", text: JSON.stringify(prunedSubGraph, null, 2) }]
        };
      }

      return {
        content: [{ type: "text", text: JSON.stringify(networkGraph, null, 2) }]
      };
    } catch (err: any) {
      return {
        content: [{ type: "text", text: `Failure mapping: ${err.message}` }],
        isError: true
      };
    }
  }

  // Add this inside your CallToolRequestSchema handler block right next to your first tool check
  if (request.params.name === "get_handoff_prompt") {
    try {
      const projectWorkspaceRoot = path.resolve(process.cwd(), '..');
      const networkGraph = processProjectGraph(projectWorkspaceRoot);
      const args = (request.params.arguments || {}) as { currentFocusFile: string };

      if (!args.currentFocusFile) {
        return {
          content: [{ type: "text", text: "Error: Missing required argument 'currentFocusFile'." }],
          isError: true
        };
      }

      const target = args.currentFocusFile.replace(/\\/g, '/');
      const targetNode = networkGraph.find(node => node.id === target);
      
      // Locate files that depend on this file, or files this file depends on
      const connectedNodes = networkGraph.filter(node => 
        node.id === target || node.dependencies.some(dep => dep.includes(target.split('/').pop() || ''))
      );

      const dependenciesList = targetNode && targetNode.dependencies.length > 0 
        ? targetNode.dependencies.map(d => `- ${d}`).join('\n') 
        : '- Direct node execution (No dependencies tracked).';
        
      const downstreamList = connectedNodes.filter(n => n.id !== target).length > 0
        ? connectedNodes.filter(n => n.id !== target).map(n => `- ${n.id}`).join('\n')
        : '- Isolated component layout node.';

      const promptPayload = `
    ======================================================================
    🤖 STATE RESTORATION HANDOFF (TOKEN OPTIMIZED KNOWLEDGE SUB-GRAPH)
    ======================================================================
    You are taking over an active code modification task in this workspace.
    To protect token limits, DO NOT perform a generic tree search across the repository.
    Your situational awareness is anchored to this specific sub-graph slice:

    ### 1. ACTIVE NODE FOCUS:
    - ${target}

    ### 2. DECLARED DIRECT MODULE DEPENDENCIES:
    ${dependenciesList}

    ### 3. AFFECTED DOWNSTREAM FILES (BLAST RADIUS):
    ${downstreamList}

    ### 4. CRITICAL FRAMEWORK GUARDRAILS:
    - Frontend layout elements inside /frontend use TypeScript path aliases (@/*).
    - All heavy 3D canvases must load dynamically ({ ssr: false }) to prevent hydration mismatch.
    - Backend schemas inside /backend must map exactly to pydantic constraints.

    ### YOUR INSTRUCTION:
    Acknowledge the target node and its blast radius in exactly one concise sentence. Await the next specific implementation instruction.
    ======================================================================`.trim();

      return {
        content: [{ type: "text", text: promptPayload }]
      };
    } catch (err: any) {
      return {
        content: [{ type: "text", text: `Failure compiling handoff payload: ${err.message}` }],
        isError: true
      };
    }
  }
  throw new Error("Tool selection out of bounds.");
});

// 3. Connect safely without breaking process stdout streams
async function initializeMcpEngine() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // CRITICAL: Always use console.error for structural engine alerts so stdout remains pure JSON-RPC!
  console.error("🧠 [AIBrain MCP Server] Stream safely bound to stdio channels.");
}

initializeMcpEngine().catch((err) => console.error("Server initialization fatal:", err));