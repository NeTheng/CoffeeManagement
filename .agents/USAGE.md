# Quick reference: Common agent commands and configurations

## Setup & Installation

### 1. Install Docker Agent
```bash
# macOS
brew install docker-agent

# Or download from: https://github.com/docker/docker-agent/releases
```

### 2. Install & Run Ollama (for local models)
```bash
# Download from https://ollama.ai
ollama serve

# In another terminal, pull a model
ollama pull mistral    # Lightweight, fast (~7B params)
ollama pull llama2     # Larger, more capable (~7B-70B)
ollama pull neural-chat # Optimized for code
```

## Running Agents

### Interactive Mode (TUI)
```bash
# Main development coordinator
docker agent run ./.agents/main.yaml

# Database specialist
docker agent run ./.agents/database.yaml
```

### Non-Interactive Mode (scripting/automation)
```bash
# One-shot task
docker agent run --exec ./.agents/main.yaml "Create a new API endpoint for inventory"

# Pipe input
cat error.log | docker agent run --exec ./.agents/main.yaml "What's wrong here?"

# Output to file
docker agent run --exec ./.agents/main.yaml "Generate database migration" > output.cs
```

### API Server Mode
```bash
# Start as HTTP API server
docker agent serve api ./.agents/main.yaml --listen :8080

# Call from another terminal
curl -X POST http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Create a Dockerfile"}]}'
```

## Configuration Options

### Change AI Model

Edit `./.agents/main.yaml` and change the `model:` line:

**Local Models (via Ollama):**
```yaml
model: ollama/mistral       # Fast, lightweight
model: ollama/llama2        # Larger, more capable
model: ollama/neural-chat   # Optimized for code
model: ollama/codellama     # Code-specific
```

**Cloud Models:**
```yaml
# OpenAI (set OPENAI_API_KEY env var)
model: openai/gpt-4
model: openai/gpt-4-turbo

# Anthropic (set ANTHROPIC_API_KEY env var)
model: anthropic/claude-opus
model: anthropic/claude-sonnet-4-5

# Google Gemini (set GOOGLE_API_KEY env var)
model: google/gemini-2.0-flash
```

### Example: Switch to OpenAI GPT-4
```bash
export OPENAI_API_KEY=sk-...
docker agent run ./.agents/main.yaml
```

## Project Context

The agents have access to your entire project:

**Key directories:**
- `./.agents/` - Agent configurations
- `./src/CoffeeManagement.Api/` - Backend code
- `./src/Frontend/` - React frontend
- `./docker-compose.yml` - Docker services
- `./Migrations/` - Database migrations

**Docker services:**
- `coffee-sqlserver` - SQL Server database (localhost:1433)
- `coffee-api` - .NET API (localhost:8080)
- `coffee-frontend` - React app (localhost:5173)

## Permission Model

When agents want to:
- **Read files** → automatic (safe)
- **Write/modify files** → asks for confirmation in TUI
- **Run commands** → asks for confirmation + shows command preview
- **Delete files** → asks for confirmation

In `--exec` mode, critical operations show a confirmation prompt.

## Example Workflows

### 1. Create a new feature
```bash
docker agent run --exec ./.agents/main.yaml \
  "Add a Reports module with new API endpoints and database table"
```

### 2. Review and fix code
```bash
docker agent run --exec ./.agents/main.yaml \
  "Review the OrderService.cs file for bugs and performance issues"
```

### 3. Debug an error
```bash
docker compose logs coffee-api | \
  docker agent run --exec ./.agents/main.yaml "What's causing this error?"
```

### 4. Generate database migration
```bash
docker agent run --exec ./.agents/database.yaml \
  "Create a migration to add an Inventory table with columns: ProductId, Quantity, WarehouseLocation"
```

## Tips & Tricks

- **Save agent output:** `docker agent run --exec ... > output.txt`
- **Use in scripts:** Combine with your CI/CD pipeline
- **Multi-file edits:** Ask agents to modify multiple files in one request
- **Persistent memory:** Agents remember context within a session
- **Cost tracking:** With cloud models, monitor API usage

## Troubleshooting

**"Connection refused" for Ollama?**
- Ensure `ollama serve` is running: `ps aux | grep ollama`
- Check if listening on localhost:11434: `lsof -i :11434`

**Agent not generating good code?**
- Try a larger model: `mistral` → `llama2-13b`
- Add more context to your request (paste relevant code)
- Use OpenAI/Claude for better quality

**File permissions errors?**
- Ensure Docker Agent has file access: `chmod 755 ./src`
- Or run with explicit path confirmation

**Too slow on Ollama?**
- Run GPU-enabled: `ollama serve` with GPU drivers
- Or use a smaller model: `mistral` or `neural-chat`

## Next Steps

1. Choose your model (Ollama for free/local, or cloud API)
2. Run an agent interactively: `docker agent run ./.agents/main.yaml`
3. Ask it to help with your project
4. Integrate into your workflow
