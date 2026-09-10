#!/bin/bash
# Quick setup script for Docker Agent with your CoffeeManagement project

set -e

echo "==================================="
echo "Docker Agent Setup for CoffeeManagement"
echo "==================================="
echo ""

# Check if docker-agent is installed
if ! command -v docker-agent &> /dev/null; then
    echo "❌ docker-agent not found. Installing..."
    if command -v brew &> /dev/null; then
        brew install docker-agent
    else
        echo "Please install docker-agent from: https://github.com/docker/docker-agent/releases"
        exit 1
    fi
else
    echo "✅ docker-agent found"
fi

# Check for Ollama or cloud models
echo ""
echo "Select your AI model provider:"
echo "1) Local (Ollama) - Free, runs on your machine"
echo "2) OpenAI - Best quality, costs per API call"
echo "3) Anthropic Claude - Excellent reasoning, costs per API call"
echo "4) Skip for now"
read -p "Enter choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "Setting up Ollama..."
        if ! command -v ollama &> /dev/null; then
            echo "Ollama not found. Download from: https://ollama.ai"
            echo "Then run: ollama serve"
            exit 1
        fi
        
        # Check if ollama is running
        if ! curl -s http://localhost:11434 > /dev/null 2>&1; then
            echo "⚠️  Ollama not running. Start it with: ollama serve"
            read -p "Continue anyway? (y/n): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                exit 1
            fi
        else
            echo "✅ Ollama is running"
            
            # Pull mistral if not exists
            echo "Checking for mistral model..."
            if ! ollama list | grep -q mistral; then
                echo "Pulling mistral model (~7GB, one-time download)..."
                ollama pull mistral
            fi
        fi
        ;;
    2)
        echo ""
        read -p "Enter your OpenAI API key (sk-...): " api_key
        export OPENAI_API_KEY=$api_key
        echo "✅ OpenAI configured"
        ;;
    3)
        echo ""
        read -p "Enter your Anthropic API key: " api_key
        export ANTHROPIC_API_KEY=$api_key
        echo "✅ Anthropic Claude configured"
        ;;
    4)
        echo "Skipping model setup. You can configure later."
        ;;
esac

echo ""
echo "==================================="
echo "✅ Setup Complete!"
echo "==================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Start the main agent coordinator:"
echo "   docker agent run ./.agents/main.yaml"
echo ""
echo "2. Or run non-interactively:"
echo "   docker agent run --exec ./.agents/main.yaml \"Your request here\""
echo ""
echo "3. For database tasks:"
echo "   docker agent run ./.agents/database.yaml"
echo ""
echo "Documentation: ./.agents/USAGE.md"
echo ""
