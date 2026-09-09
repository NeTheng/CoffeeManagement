using CoffeeManagement.Api.Models;
using CoffeeManagement.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace CoffeeManagement.Api.Data;

public static class DbInitializer
{
    public static async Task InitializeAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var passwordService = scope.ServiceProvider.GetRequiredService<PasswordService>();

        try
        {
            Console.WriteLine("Ensuring database is created...");
            await db.Database.EnsureCreatedAsync();
            Console.WriteLine("Database schema created/verified.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Warning: Could not ensure database: {ex.Message}");
        }

        try
        {
            if (!await db.Users.AnyAsync())
            {
                db.Users.Add(new User
                {
                    Username = "admin",
                    Email = "admin@example.com",
                    PasswordHash = passwordService.HashPassword("Admin@123"),
                    Role = "Admin"
                });
                await db.SaveChangesAsync();
            }

            if (!await db.Products.AnyAsync())
            {
                db.Products.AddRange(
                    new Product { Name = "Espresso", Sku = "ESP-001", Price = 1.50m, StockQuantity = 100 },
                    new Product { Name = "Cappuccino", Sku = "CAP-001", Price = 2.50m, StockQuantity = 100 },
                    new Product { Name = "Latte", Sku = "LAT-001", Price = 2.75m, StockQuantity = 100 }
                );
                await db.SaveChangesAsync();
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error seeding database: {ex.Message}");
        }
    }
}
