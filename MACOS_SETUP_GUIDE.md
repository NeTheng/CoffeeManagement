# CoffeeManagement Application - Complete macOS Setup Guide

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Prerequisites Installation](#prerequisites-installation)
3. [Project Setup](#project-setup)
4. [Database Setup](#database-setup)
5. [Backend Configuration](#backend-configuration)
6. [Frontend Configuration](#frontend-configuration)
7. [Running the Application](#running-the-application)
8. [Verification & Testing](#verification--testing)
9. [Troubleshooting](#troubleshooting)

---

## System Requirements

### Hardware
- **Mac with Apple Silicon (M1/M2/M3) or Intel processor**
- **RAM**: Minimum 8GB (16GB recommended)
- **Storage**: At least 20GB free space
- **macOS Version**: 11.0 (Big Sur) or later

### Software
- Homebrew (package manager)
- Docker & Docker Desktop
- Git
- Node.js 18+
- .NET 10 SDK
- SQL Server 2022 (via Docker)

---

## Prerequisites Installation

### 1. Install Homebrew

Homebrew is macOS's package manager. Open Terminal and run:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Verify installation:
```bash
brew --version
```

Expected output: `Homebrew X.X.X`

---

### 2. Install Git

```bash
brew install git
```

Verify:
```bash
git --version
```

Expected output: `git version 2.x.x`

---

### 3. Install Docker Desktop

#### Option A: Using Homebrew (Recommended)
```bash
brew install docker
brew install docker-compose
```

#### Option B: Manual Download
1. Go to https://www.docker.com/products/docker-desktop
2. Download Docker Desktop for Mac (Apple Silicon or Intel)
3. Open the `.dmg` file and drag Docker to Applications folder
4. Open Applications → Docker
5. Enter your password when prompted

Verify:
```bash
docker --version
docker compose --version
```

Expected output:
```
Docker version 20.x.x
Docker Compose version 2.x.x
```

---

### 4. Install Node.js

```bash
brew install node@18
```

Verify:
```bash
node --version
npm --version
```

Expected output:
```
v18.x.x
9.x.x
```

---

### 5. Install .NET 10 SDK

```bash
brew tap microsoft/mssql-release https://github.com/Microsoft/mssql-release
brew install dotnet@10
```

Alternatively, from Microsoft:
1. Visit https://dotnet.microsoft.com/download/dotnet/10.0
2. Download macOS installer
3. Run installer and follow prompts

Verify:
```bash
dotnet --version
```

Expected output: `10.0.x`

---

## Project Setup

### 1. Clone the Repository

```bash
# Navigate to your desired location
cd ~/Documents

# Clone the project (replace with your actual repo URL)
git clone https://github.com/yourusername/CoffeeManagement.git

# Navigate into project
cd CoffeeManagement
```

### 2. Project Structure

```
CoffeeManagement/
├── src/
│   ├── CoffeeManagement.Api/          (Backend - .NET)
│   │   ├── Controllers/
│   │   ├── Models/
│   │   ├── DTOs/
│   │   ├── Data/
│   │   ├── Services/
│   │   ├── CoffeeManagement.Api.csproj
│   │   └── Dockerfile
│   ├── Frontend/                      (Frontend - React)
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   ├── vite.config.js
│   │   └── Dockerfile
│   ├── compose.yaml                   (Docker Compose)
│   └── entrypoint.sh
└── README.md
```

---

## Database Setup

### 1. Update compose.yaml

Navigate to the project root and edit `compose.yaml`:

```bash
nano src/compose.yaml
```

Find the `sqlserver` service section and ensure it has:

```yaml
services:
  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=YourStrongPassword123!
      - MSSQL_PID=Developer
    ports:
      - "1433:1433"
    container_name: coffee-sqlserver
    volumes:
      - sqlserver-data:/var/opt/mssql
```

**Important**: Change `SA_PASSWORD` to a secure password of your choice.

### 2. Start SQL Server Container

```bash
cd src
docker compose up sqlserver -d
```

Wait for the container to be healthy:
```bash
docker ps
```

Look for `coffee-sqlserver` with status `Up X seconds (healthy)`

Verify connection:
```bash
docker exec coffee-sqlserver /opt/mssql-tools18/bin/sqlcmd -U sa -P 'YourStrongPassword123!' -C -Q "SELECT 1"
```

Expected output: `1`

---

## Backend Configuration

### 1. Navigate to Backend Directory

```bash
cd src/CoffeeManagement.Api
```

### 2. Update appsettings.json

Create/Edit `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=CoffeeManagement;User Id=sa;Password=YourStrongPassword123!;Encrypt=false;TrustServerCertificate=true;"
  },
  "Jwt": {
    "Key": "your-super-secret-key-min-32-characters-long-required",
    "Issuer": "CoffeeManagementApi",
    "Audience": "CoffeeManagementApp",
    "ExpirationMinutes": 60
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  }
}
```

**Replace values:**
- `YourStrongPassword123!` → Your SQL Server password
- `your-super-secret-key-...` → Use a random 32+ character string

Generate a secure key:
```bash
openssl rand -base64 32
```

### 3. Restore Dependencies

```bash
dotnet restore
```

This downloads all NuGet packages.

### 4. Create Database & Run Migrations

```bash
# Install EF Core tools if not already installed
dotnet tool install --global dotnet-ef

# Create database and run migrations
dotnet ef database update
```

Verify database creation:
```bash
docker exec coffee-sqlserver /opt/mssql-tools18/bin/sqlcmd -U sa -P 'YourStrongPassword123!' -d CoffeeManagement -C -Q "SELECT name FROM sys.tables"
```

Expected output: List of tables including Users, Notes, Products, etc.

### 5. Run Backend (Development)

```bash
dotnet run
```

Expected output:
```
Now listening on: http://localhost:8080
Application started. Press Ctrl+C to exit.
```

**Keep this terminal open.** Open a new terminal for the next steps.

---

## Frontend Configuration

### 1. Navigate to Frontend Directory

```bash
cd src/Frontend
```

### 2. Install Dependencies

```bash
npm install
```

Wait for all packages to install (~2-3 minutes).

### 3. Create Environment File

Create `.env` file in `Frontend/` directory:

```bash
echo "VITE_API_URL=http://localhost:8080/api" > .env
```

Or manually create `Frontend/.env`:
```
VITE_API_URL=http://localhost:8080/api
```

### 4. Update vite.config.js

Ensure proxy is configured:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})
```

### 5. Run Frontend (Development)

```bash
npm run dev
```

Expected output:
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

**Keep this terminal open.** The frontend is now running!

---

## Running the Application

### All 3 Terminals Must Be Active

You now need THREE terminal windows:

#### Terminal 1: SQL Server (Started Earlier)
```bash
cd src
docker compose up sqlserver
# Should show: container is healthy
```

#### Terminal 2: Backend API
```bash
cd src/CoffeeManagement.Api
dotnet run
# Should show: Now listening on http://localhost:8080
```

#### Terminal 3: Frontend
```bash
cd src/Frontend
npm run dev
# Should show: Local: http://localhost:5173/
```

### Access the Application

Open your browser and go to:
```
http://localhost:5173
```

You should see the CoffeeManagement login page.

---

## Verification & Testing

### 1. Test Login

Use these default credentials:

**Admin User:**
- Username: `admin`
- Password: `Admin@123`

**Test User:**
- Username: `testuser`
- Password: `Test@123`

### 2. Test Main Features

#### Dashboard
- Login successfully
- Should see Dashboard with welcome message
- Sidebar shows all menu items

#### Notes (Full CRUD)
1. Click "Notes" in sidebar
2. Click "+ New Note"
3. Enter title and content
4. Click "Create Note"
5. Should see success message
6. Click the note to view
7. Click "✏️ Edit" to modify
8. Click "🗑 Delete" to remove

#### Products
- Click "Products" in sidebar
- Should display product list

#### Orders
- Click "Orders" in sidebar
- Should display orders

### 3. Verify Database

In a new terminal:
```bash
docker exec coffee-sqlserver /opt/mssql-tools18/bin/sqlcmd -U sa -P 'YourStrongPassword123!' -d CoffeeManagement -C -Q "SELECT COUNT(*) as TotalNotes FROM Notes WHERE IsDeleted = 0"
```

Should return the number of active notes you created.

---

## Troubleshooting

### Issue 1: Docker Not Running

**Error:** `Cannot connect to Docker daemon`

**Solution:**
```bash
# Start Docker Desktop
open /Applications/Docker.app

# Or via Homebrew
brew services start docker
```

---

### Issue 2: SQL Server Container Won't Start

**Error:** `docker: Error response from daemon`

**Solution:**
```bash
# Remove old container
docker rm coffee-sqlserver

# Check available disk space
df -h

# Try starting again
docker compose up sqlserver -d
```

---

### Issue 3: Backend Connection Refused

**Error:** `Unable to connect to database`

**Solution:**
1. Verify SQL Server is running:
   ```bash
   docker ps | grep coffee-sqlserver
   ```

2. Check connection string in `appsettings.json`:
   ```bash
   # Should match container name: localhost,1433
   ```

3. Verify password matches in both files:
   - `compose.yaml` → `SA_PASSWORD`
   - `appsettings.json` → connection string password

---

### Issue 4: Frontend Shows "Failed to Fetch"

**Error:** `Failed to fetch /api/...`

**Solution:**
1. Verify backend is running on port 8080
2. Check Vite proxy config in `vite.config.js`
3. Verify CORS is enabled in backend `Program.cs`

---

### Issue 5: Port Already in Use

**Error:** `Port XXXX is already in use`

**Solution:**
```bash
# Find process using port
lsof -i :5173        # Frontend
lsof -i :8080        # Backend
lsof -i :1433        # Database

# Kill the process
kill -9 <PID>

# Or change port in vite.config.js:
# server: { port: 5174 }
```

---

### Issue 6: Node Modules Issues

**Error:** `Module not found` or `npm ERR!`

**Solution:**
```bash
cd src/Frontend

# Clear cache
rm -rf node_modules
rm package-lock.json

# Reinstall
npm install

# Clear npm cache if needed
npm cache clean --force
```

---

### Issue 7: .NET Build Errors

**Error:** `error NU1101: Unable to find package`

**Solution:**
```bash
cd src/CoffeeManagement.Api

# Clear NuGet cache
dotnet nuget locals all --clear

# Restore packages
dotnet restore --no-cache

# Build
dotnet build
```

---

## Quick Start Script (Optional)

Create a `start.sh` file in the `src/` directory:

```bash
#!/bin/bash

echo "🚀 Starting CoffeeManagement Application..."

# Terminal 1: SQL Server
echo "📦 Starting SQL Server..."
open -a Terminal
echo "cd $(pwd) && docker compose up sqlserver" | pbcopy

# Terminal 2: Backend
echo "🔧 Starting Backend API..."
open -a Terminal
echo "cd $(pwd)/CoffeeManagement.Api && dotnet run" | pbcopy

# Terminal 3: Frontend
echo "🎨 Starting Frontend..."
open -a Terminal
echo "cd $(pwd)/Frontend && npm run dev" | pbcopy

echo "✅ Opening browser..."
sleep 5
open http://localhost:5173

echo "✅ All applications started!"
echo ""
echo "📋 Services:"
echo "   - Database:  localhost:1433"
echo "   - API:       http://localhost:8080"
echo "   - Frontend:  http://localhost:5173"
```

Make it executable:
```bash
chmod +x start.sh
```

Run it:
```bash
./start.sh
```

---

## Docker Compose (Alternative One-Command Setup)

Instead of running 3 terminals, you can use Docker Compose for all services:

### 1. Build Images

```bash
cd src
docker compose build
```

### 2. Start All Services

```bash
docker compose up
```

This starts:
- SQL Server on port 1433
- Backend API on port 8080
- Frontend on port 5173

All in one terminal!

### 3. Stop All Services

```bash
docker compose down
```

---

## Environment Variables Summary

### Backend (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=CoffeeManagement;User Id=sa;Password=YOUR_PASSWORD;"
  },
  "Jwt": {
    "Key": "YOUR_SECRET_KEY_MIN_32_CHARS",
    "Issuer": "CoffeeManagementApi",
    "Audience": "CoffeeManagementApp"
  }
}
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8080/api
```

### SQL Server (compose.yaml)
```yaml
environment:
  - ACCEPT_EULA=Y
  - SA_PASSWORD=YOUR_PASSWORD
  - MSSQL_PID=Developer
```

---

## Ports Used

| Service | Port | URL |
|---------|------|-----|
| Frontend | 5173 | http://localhost:5173 |
| Backend API | 8080 | http://localhost:8080 |
| SQL Server | 1433 | localhost:1433 |

---

## Database Credentials

| Item | Default Value |
|------|----------------|
| Server | localhost,1433 |
| Database | CoffeeManagement |
| Username | sa |
| Password | YourStrongPassword123! |

**⚠️ IMPORTANT:** Change `SA_PASSWORD` to a strong password for production!

---

## Next Steps

1. ✅ Follow this guide step-by-step
2. ✅ Verify all services are running
3. ✅ Test login with provided credentials
4. ✅ Create, read, update, delete notes
5. ✅ Explore all features in the application
6. ✅ Customize for your needs

---

## Support & Troubleshooting

If you encounter issues:

1. Check terminal output for errors
2. Verify all services are running: `docker ps`
3. Check logs: `docker logs coffee-sqlserver`
4. Review troubleshooting section above
5. Ensure ports aren't already in use

---

## Useful Commands

```bash
# Check running services
docker ps

# View container logs
docker logs coffee-sqlserver

# Query database
docker exec coffee-sqlserver /opt/mssql-tools18/bin/sqlcmd -U sa -P 'Password' -d CoffeeManagement

# Stop all containers
docker compose down

# Remove all data (WARNING: destructive)
docker compose down -v

# Rebuild everything
docker compose build --no-cache
docker compose up
```

---

**Document Version:** 1.0  
**Last Updated:** September 2026  
**Compatibility:** macOS 11+ with Docker Desktop


#  Docker stack is running
cd /Users/macos/Documents/CoffeeManagement/src && docker compose down --remove-orphans && docker compose up --build -d && docker compose ps;