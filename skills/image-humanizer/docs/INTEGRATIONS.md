# Image Humanizer Integrations

Use image-humanizer with Claude, ChatGPT, and other LLMs via multiple integration methods.

## Quick Comparison

| Method | Platforms | Setup | Best For |
|--------|-----------|-------|----------|
| **MCP Server** | Claude, VS Code | Medium | Cross-platform tool access |
| **OpenAI Custom GPT** | ChatGPT Plus | Easy | ChatGPT users |
| **HTTP API** | Any | Medium | Custom integrations |
| **SKILL.md** | OpenClaw | Easy | OpenClaw agents |

---

## MCP Server

Model Context Protocol works with Claude Desktop, VS Code, and other MCP clients.

### Install

```bash
cd image-humanizer/mcp-server
npm install
```

### Configure Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "image-humanizer": {
      "command": "node",
      "args": ["/path/to/image-humanizer/mcp-server/index.js"]
    }
  }
}
```

### Available Tools

| Tool | Description |
|------|-------------|
| `transform` | Transform a prompt with film/camera modifiers |
| `analyze` | Score a prompt for AI-prone patterns |
| `suggest` | Get improvement suggestions |
| `modifiers` | List all available modifiers |

---

## OpenAI Custom GPT

Create a GPT that transforms image prompts automatically.

### Setup

1. Go to [chat.openai.com/gpts/editor](https://chat.openai.com/gpts/editor)
2. Click "Create a GPT"
3. Copy instructions from `openai-gpt/instructions.md`
4. Name it "Image Humanizer"
5. (Optional) Add Actions using the API server

### With Actions API

If you want the GPT to call the tool programmatically:

1. Deploy the API server (see below)
2. In GPT editor, click "Configure" → "Create new action"
3. Import schema from your deployed `/api/openapi` endpoint

---

## HTTP API Server

Simple HTTP API for OpenAI Actions and custom integrations.

### Run Locally

```bash
cd image-humanizer
node api-server/server.js
```

Server runs on port 3001 by default (set `PORT` env to change).

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/transform` | POST | Transform a prompt |
| `/api/analyze` | POST | Analyze for AI patterns |
| `/api/suggest` | POST | Get suggestions |
| `/api/modifiers` | GET | List all modifiers |
| `/api/openapi` | GET | OpenAPI spec |

### Example

```bash
curl -X POST http://localhost:3001/api/transform \
  -H "Content-Type: application/json" \
  -d '{"prompt": "a woman in a coffee shop"}'
```

Response:
```json
{
  "original": "a woman in a coffee shop",
  "transformed": "a woman in her 30s with visible laugh lines...",
  "originalScore": 70,
  "newScore": 12,
  "improvement": 58
}
```

---

## OpenClaw Skill

Copy `SKILL.md` to your OpenClaw skills directory:

```bash
cp SKILL.md ~/.config/openclaw/skills/image-humanizer.md
```

Or install via ClawHub once published:

```bash
clawhub install image-humanizer
```

---

## Troubleshooting

### MCP Server not connecting

1. Check the path in config is absolute
2. Run `node mcp-server/index.js` manually to test
3. Check Claude/VS Code logs for errors

### API returns 500

1. Ensure `"type": "module"` in package.json
2. Check Node version >= 18
3. Run `npm install` in project root
