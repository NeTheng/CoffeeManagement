# Docker Agent Directory Structure

This directory contains AI agent configurations for the CoffeeManagement project.

## Files

- **main.yaml** - Main multi-agent team coordinator
  - Routes tasks to specialized agents (coder, reviewer, debugger)
  - Best for general development tasks
  - Use: `docker agent run ./main.yaml`

- **database.yaml** - Specialized database expert agent
  - Database design, migrations, SQL queries
  - Use: `docker agent run ./database.yaml`

- **USAGE.md** - Complete documentation
  - Setup instructions
  - All commands and examples
  - Configuration options

- **setup.sh** - Interactive setup script
  - Checks Docker Agent installation
  - Configures Ollama or cloud models
  - Run once: `bash setup.sh`

- **.env.example** - Environment variables template
  - API keys for cloud models
  - Local configuration options
  - Copy to `.env` and fill in your secrets

## Quick Start

```bash
# 1. Run setup (one time)
bash setup.sh

# 2. Start interactive agent
docker agent run ./main.yaml

# 3. Or run non-interactively
docker agent run --exec ./main.yaml "Create a new API endpoint"
```

## What the agents can do

✅ Read & edit files (with confirmation)
✅ Run shell commands (with confirmation)
✅ Create/modify code
✅ Review code quality
✅ Debug errors & logs
✅ Design databases
✅ Explain issues
✅ Remember context (persistent memory)

## Choosing a Model

**Free & Local (Ollama)**
- Fast, privacy-focused
- Works offline
- Good for general tasks

**OpenAI GPT-4**
- Best quality
- Paid per API call
- Best for complex tasks

**Anthropic Claude**
- Excellent reasoning
- Paid per API call
- Great for detailed analysis

## Next Steps

1. Read `USAGE.md` for all options
2. Choose your AI model provider
3. Run `bash setup.sh`
4. Start with: `docker agent run ./main.yaml`
