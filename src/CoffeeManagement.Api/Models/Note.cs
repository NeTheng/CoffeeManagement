namespace CoffeeManagement.Api.Models;

public class Note
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public User User { get; set; } = null!;

    public string Title { get; set; } = string.Empty;

    public string? Content { get; set; }

    public string? Category { get; set; }

    public string? Tags { get; set; }

    public bool IsArchived { get; set; } = false;

    public bool IsDeleted { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? ArchivedAt { get; set; }

    public DateTime? DeletedAt { get; set; }
}