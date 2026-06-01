# 🧠 AIBrain Static Graph MCP Server

An ultra-lightweight, zero-cost, token-optimized Model Context Protocol (MCP) server that builds a static interdependency knowledge graph of your full-stack workspaces. 

Designed specifically to eliminate **model-switching amnesia** in agentic IDEs (like Google Antigravity, Cursor, and VS Code) without burning your API token budget on repetitive raw file reads.

## 🚀 Features
- **Zero-Config Graph Generation:** Scans Next.js (`frontend/`) and FastAPI (`backend/`) structures out-of-the-box.
- **AST Path Alias Resolution:** Automatically tracks modern TypeScript `@/*` path routing setups.
- **Automated Resource Injection:** Exposes a native `aibrain://workspace/graph` resource URI for fast, silent context loading during model switches.

## 🛠️ Installation & Local Setup

### 1. Clone & Install Dependencies
Drop the engine folder into your project root directory and run:
```bash
npm install
```

### 2. Compile the Project
```bash
npm run build
```

### 3. Register with Your AI/IDE Client
Add the local server process signature to your IDE's global MCP configuration settings (`mcp_config.json`):

```json
{
  "mcpServers": {
    "aibrain-engine": {
      "command": "node",
      "args": [
        "/YOUR_PROJECT_PATH/aibrain-engine/dist/index.js"
      ],
      "cwd": "/YOUR_PROJECT_PATH/aibrain-engine"
    }
  }
}
```