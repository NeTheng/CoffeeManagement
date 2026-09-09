# Coffee Management API

A complete starter backend built with **C# / ASP.NET Core 10 / EF Core 10 / SQL Server 2022 / JWT**.

## Architecture

Client -> ASP.NET Core Web API -> Services/EF Core -> SQL Server

## Requirements

- .NET 10 SDK
- Docker Desktop (recommended)
- Git
- Optional: Visual Studio 2022, VS Code, or JetBrains Rider

.NET 10 is the current LTS line in this project.

## Run with Docker

```bash
docker compose up --build
```

API:
- http://localhost:8080
- Swagger: http://localhost:8080/swagger

SQL Server:
- Host: localhost
- Port: 1433
- User: sa
- Password: YourStrongPassword123!

# Using sqlcmd inside the container:
docker exec -it coffee-sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'YourStrongPassword123!' -C
docker exec -it coffee-sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'YourStrongPassword123!' -C -Q "SELECT * FROM CoffeeManagement.dbo.Users"


# Connection Details:

- Host: localhost (or sqlserver if connecting from inside a container)
- Port: 1433
- User: sa
- Password: YourStrongPassword123!
- Database: CoffeeManagement

Using SQL Server Management Studio (SSMS):

- Open SSMS
- Server name: localhost,1433
- Authentication: SQL Server Authentication
- Login: sa
- Password: YourStrongPassword123!
- Connect to database: CoffeeManagement

Using Azure Data Studio:

- New Connection
- Server: localhost
- Authentication type: SQL Login
- User name: sa
- Password: YourStrongPassword123!
- Database: CoffeeManagement


## Run locally with SQL Server in Docker

Start only SQL Server:

```bash
docker compose up -d sqlserver
```

Then:

```bash
dotnet restore
dotnet run --project src/CoffeeManagement.Api
```

Swagger:
- http://localhost:5080/swagger

## EF Core migrations

The application runs `Database.MigrateAsync()` at startup. For controlled production deployments, generate and review migrations explicitly:

```bash
dotnet tool install --global dotnet-ef --version 10.0.11
dotnet ef migrations add InitialCreate --project src/CoffeeManagement.Api --startup-project src/CoffeeManagement.Api
dotnet ef database update --project src/CoffeeManagement.Api --startup-project src/CoffeeManagement.Api
```

After generating the migration, commit the `Migrations/` directory.

## Default account

The development initializer creates:

```text
Username: admin
Password: Admin@123
Role: Admin
```

Change this immediately outside local development.

## API endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### Products

```http
GET    /api/products
GET    /api/products/{id}
POST   /api/products
PUT    /api/products/{id}
DELETE /api/products/{id}
```

### Customers

```http
GET    /api/customers
GET    /api/customers/{id}
POST   /api/customers
DELETE /api/customers/{id}
```

### Orders

```http
GET  /api/orders
GET  /api/orders/{id}
POST /api/orders
```

## Login example

```json
{
  "username": "admin",
  "password": "Admin@123"
}
```

Copy the JWT returned by login and click **Authorize** in Swagger.

## Create order example

```json
{
  "customerId": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 2,
      "quantity": 1
    }
  ]
}
```

The API calculates line totals, total amount, and decrements inventory inside a SQL transaction.

## Production hardening

Before production:

1. Move connection strings and JWT secrets to environment variables or a secret manager.
2. Remove the seeded admin credentials.
3. Do not rely on automatic migrations at application startup for controlled production releases.
4. Add rate limiting, structured logging, health checks, audit logging, refresh tokens, password reset, and centralized exception handling.
5. Add unit/integration tests.
6. Add CI/CD.
7. Use HTTPS and a production reverse proxy/ingress.
8. Back up SQL Server and test restore procedures.

## Suggested next modules

- Suppliers
- Inventory transactions
- Purchases
- Payments
- Employees
- Roles/permissions
- Branches
- Expense management
- Dashboard/reporting
- Notifications
- AI business assistant

---------------------------------------------------------------------------------


# Install Node Server or image
# Done. I've verified your project and fixed all issues:

✅ Fixed:

- Created entrypoint.sh for Backend container startup
- Added CORS support so Frontend can call Backend API
- Updated database connection from localhost to sqlserver (Docker service name)
- Added SQL Server service to docker-compose with health checks
- Added volume persistence for database data

Project Structure Now:

- Backend: .NET 10 + EF Core + SQL Server, fully containerized
- Frontend: React + Vite dev server, auto-watching enabled
- Database: SQL Server 2022 with proper health checks
- Networking: All services on coffee-network bridge

Test it:

  docker compose up --pull always


Then access:

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080/swagger (Swagger docs)
- Database: localhost:1433 (sa / YourStrongPassword123!)

Everything is now properly structured and ready to run!




----------------------------------------------------------------------------------

✅ Everything is running correctly!

Access your app:

- Frontend: http://localhost:5173
- Backend API Swagger: http://localhost:8080/swagger
- Database: localhost:1433 (SQL Server)

All services running:

- ✅ coffee-frontend (React + Vite)
- ✅ coffee-api (.NET Backend)
- ✅ coffee-sqlserver (Database)

If you want to restart cleanly, run:

  docker compose down -v
  docker compose up --pull always


This will stop everything and start fresh. Let me know if you see any issues!


Project architecture
src/
│
├── api/
│   ├── authApi.js
│   ├── productApi.js
│   ├── customerApi.js
│   ├── orderApi.js
│   └── noteApi.js
│
├── components/
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── ProductPage.jsx
│   ├── CustomerPage.jsx
│   ├── OrderPage.jsx
│   └── NotePage.jsx
│
├── routes/
│   └── AppRoutes.jsx
│
├── services/
│   └── authService.js
│
├── App.jsx
├── App.css
└── main.jsx



Vite
 │
 └── React
      │
      ├── React Router
      │    ├── /login
      │    ├── /dashboard
      │    ├── /products
      │    ├── /customers
      │    ├── /orders
      │    ├── /inventory
      │    ├── /notes
      │    └── /reports
      │
      └── API
           │
           ▼
      ASP.NET Core
           │
           ▼
       SQL Server