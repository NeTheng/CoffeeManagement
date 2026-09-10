## Structure

  ./.agents/
   main.yaml          → Main coordinator + 3 specialist agents (coder, reviewer, debugger)
   database.yaml      → SQL Server database expert
   USAGE.md           → Complete reference (setup, commands, examples, troubleshooting)
   README.md          → Quick start guide
   setup.sh           → Interactive setup script (run once)
   .env.example       → Template for API keys


## Multi-Agent Architecture

Root Coordinator routes tasks to:

- Coder — writes code, modifies files
- Reviewer — analyzes quality, security, performance
- Debugger — fixes bugs, analyzes logs
- Database Expert (separate file) — schema design, migrations

## Getting Started

  # 1. Interactive setup (choose Ollama or cloud model)
  bash ./.agents/setup.sh

  # 2. Start interactive agent
  docker agent run ./.agents/main.yaml

  # 3. Or use non-interactively
  docker agent run --exec ./.agents/main.yaml "Create a reports API endpoint"


Each agent has file editing, shell execution, memory, and reasoning tools with permission confirmations. See ./.agents/USAGE.md for all commands and model options (Ollama free, or OpenAI/Anthropic for best
quality).


Yes, installation is completed! ✓
Installed Components:

- ✅ Docker Agent v1.137.0 (at ~/.docker/cli-plugins/docker-agent)
- ✅ Ollama (at /Applications/Ollama.app)
- ✅ Mistral model (4.4GB, fully downloaded)
- ✅ Docker Agent config files (./.agents/main.yaml, database.yaml, etc.)

Ready to use:

  export PATH="$PATH:$HOME/.docker/cli-plugins"
  cd /Users/macos/Documents/CoffeeManagement
  docker agent run --exec ./.agents/main.yaml "Create a reports API endpoint"


Everything is configured and operational. Your agent team is ready to help with code generation, debugging, reviews, and database work.