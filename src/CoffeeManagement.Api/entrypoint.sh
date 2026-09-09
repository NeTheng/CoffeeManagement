#!/bin/bash
set -e

echo "Starting Coffee Management API..."

cd /src

# Run migrations
echo "Running database migrations..."
dotnet ef database update --project CoffeeManagement.Api.csproj || true

# Move to app directory and run
cd /app
exec dotnet /src/bin/Release/net10.0/CoffeeManagement.Api.dll
