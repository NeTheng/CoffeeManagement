#!/bin/bash
set -e

# Run any pending database migrations
cd /src/CoffeeManagement.Api
dotnet ef database update --no-build || true

# Start the application
exec "$@"
