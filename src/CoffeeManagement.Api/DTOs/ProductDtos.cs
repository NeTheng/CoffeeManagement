namespace CoffeeManagement.Api.DTOs;

public record ProductRequest(string Name, string Sku, decimal Price, int StockQuantity);
