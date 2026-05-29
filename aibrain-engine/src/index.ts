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
        description: "Returns a high-density static interdependency map of workspace file imports. Run this immediately upon model switching to regain instant architecture context.",
        inputSchema: {
          type: "object",
          properties: {
            focusPath: {
              type: "string",
              description: "Optional relative path to a single component file to slice down context payload."
            }
          }
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