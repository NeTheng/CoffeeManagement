#!/bin/bash
set -e

# Run any pending database migrations from the actual project location
cd /src
dotnet ef --project CoffeeManagement.Api.csproj database update --no-build || true

# Start the application
exec "$@"
