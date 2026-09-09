namespace CoffeeManagement.Api.DTOs;

public record OrderItemRequest(int ProductId, int Quantity);
public record CreateOrderRequest(int? CustomerId, List<OrderItemRequest> Items);
