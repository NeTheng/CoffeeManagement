using CoffeeManagement.Api.Data;
using CoffeeManagement.Api.DTOs;
using CoffeeManagement.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CoffeeManagement.Api.Controllers;

[ApiController]
[Route("api/orders")]
[Authorize]
public class OrdersController(ApplicationDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<Order>>> GetAll()
        => Ok(await db.Orders
            .AsNoTracking()
            .Include(x => x.Customer)
            .Include(x => x.Items).ThenInclude(x => x.Product)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync());

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Order>> Get(int id)
    {
        var order = await db.Orders
            .AsNoTracking()
            .Include(x => x.Customer)
            .Include(x => x.Items).ThenInclude(x => x.Product)
            .SingleOrDefaultAsync(x => x.Id == id);

        return order is null ? NotFound() : Ok(order);
    }

    [HttpPost]
    public async Task<ActionResult<Order>> Create(CreateOrderRequest request)
    {
        if (request.Items.Count == 0)
            return BadRequest("Order must contain at least one item.");

        if (request.CustomerId.HasValue &&
            !await db.Customers.AnyAsync(x => x.Id == request.CustomerId.Value))
            return BadRequest("Customer does not exist.");

        await using var transaction = await db.Database.BeginTransactionAsync();

        var order = new Order
        {
            OrderNumber = $"ORD-{DateTime.UtcNow:yyyyMMddHHmmssfff}",
            CustomerId = request.CustomerId
        };

        foreach (var item in request.Items)
        {
            var product = await db.Products.SingleOrDefaultAsync(x => x.Id == item.ProductId && x.IsActive);

            if (product is null)
                return BadRequest($"Product {item.ProductId} does not exist.");

            if (item.Quantity <= 0)
                return BadRequest("Quantity must be greater than zero.");

            if (product.StockQuantity < item.Quantity)
                return BadRequest($"Insufficient stock for {product.Name}.");

            var lineTotal = product.Price * item.Quantity;

            product.StockQuantity -= item.Quantity;

            order.Items.Add(new OrderItem
            {
                ProductId = product.Id,
                Quantity = item.Quantity,
                UnitPrice = product.Price,
                LineTotal = lineTotal
            });

            order.TotalAmount += lineTotal;
        }

        db.Orders.Add(order);
        await db.SaveChangesAsync();
        await transaction.CommitAsync();

        return CreatedAtAction(nameof(Get), new { id = order.Id }, order);
    }
}
