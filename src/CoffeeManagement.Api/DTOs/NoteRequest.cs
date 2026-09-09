using System.ComponentModel.DataAnnotations;

namespace CoffeeManagement.Api.DTOs;

/// <summary>
/// DTO for creating a new note
/// </summary>
public record CreateNoteRequest(
    [Required(ErrorMessage = "Title is required.")]
    [StringLength(200, ErrorMessage = "Title cannot exceed 200 characters.")]
    string Title,
    
    [StringLength(5000, ErrorMessage = "Content cannot exceed 5000 characters.")]
    string? Content = null,
    
    [StringLength(50, ErrorMessage = "Category cannot exceed 50 characters.")]
    string? Category = null,
    
    [StringLength(500, ErrorMessage = "Tags cannot exceed 500 characters.")]
    string? Tags = null
);

/// <summary>
/// DTO for updating an existing note
/// </summary>
public record UpdateNoteRequest(
    [Required(ErrorMessage = "Title is required.")]
    [StringLength(200, ErrorMessage = "Title cannot exceed 200 characters.")]
    string Title,
    
    [StringLength(5000, ErrorMessage = "Content cannot exceed 5000 characters.")]
    string? Content = null,
    
    [StringLength(50, ErrorMessage = "Category cannot exceed 50 characters.")]
    string? Category = null,
    
    [StringLength(500, ErrorMessage = "Tags cannot exceed 500 characters.")]
    string? Tags = null
);

/// <summary>
/// DTO for returning note data
/// </summary>
public record NoteResponse(
    int Id,
    string Title,
    string? Content,
    string? Category,
    string? Tags,
    bool IsArchived,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    DateTime? ArchivedAt
);
