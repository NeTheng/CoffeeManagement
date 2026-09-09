using CoffeeManagement.Api.Data;
using CoffeeManagement.Api.DTOs;
using CoffeeManagement.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CoffeeManagement.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/notes")]
public class NotesController(ApplicationDbContext db) : ControllerBase
{
    /// <summary>
    /// Create a new note for the authenticated user
    /// </summary>
    [HttpPost]
    [Produces("application/json")]
    public async Task<ActionResult<NoteResponse>> CreateNote(CreateNoteRequest request)
    {
        // Validate request
        if (string.IsNullOrWhiteSpace(request.Title))
            return BadRequest(new { message = "Title is required and cannot be empty." });

        if (request.Title.Length > 200)
            return BadRequest(new { message = "Title cannot exceed 200 characters." });

        if (request.Content?.Length > 5000)
            return BadRequest(new { message = "Content cannot exceed 5000 characters." });

        // Get authenticated user ID from claims
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            return Unauthorized(new { message = "User ID not found in token." });

        // Verify user exists
        var user = await db.Users.FindAsync(userId);
        if (user == null)
            return Unauthorized(new { message = "User not found." });

        var note = new Note
        {
            UserId = userId,
            Title = request.Title.Trim(),
            Content = request.Content?.Trim(),
            Category = request.Category?.Trim(),
            Tags = request.Tags?.Trim(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        db.Notes.Add(note);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetNoteById), new { id = note.Id }, MapToResponse(note));
    }

    /// <summary>
    /// Get all notes for the authenticated user
    /// </summary>
    [HttpGet]
    [Produces("application/json")]
    public async Task<ActionResult<List<NoteResponse>>> GetUserNotes()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            return Unauthorized(new { message = "User ID not found in token." });

        var notes = await db.Notes
            .Where(n => n.UserId == userId && !n.IsDeleted)
            .OrderByDescending(n => n.UpdatedAt)
            .ToListAsync();

        return Ok(notes.Select(MapToResponse).ToList());
    }

    /// <summary>
    /// Get a specific note by ID (if it belongs to the authenticated user)
    /// </summary>
    [HttpGet("{id}")]
    [Produces("application/json")]
    public async Task<ActionResult<NoteResponse>> GetNoteById(int id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            return Unauthorized(new { message = "User ID not found in token." });

        var note = await db.Notes.FindAsync(id);

        if (note == null || note.IsDeleted)
            return NotFound(new { message = "Note not found." });

        if (note.UserId != userId)
            return Forbid();

        return Ok(MapToResponse(note));
    }

    /// <summary>
    /// Update a note (if it belongs to the authenticated user)
    /// </summary>
    [HttpPut("{id}")]
    [Produces("application/json")]
    public async Task<ActionResult<NoteResponse>> UpdateNote(int id, UpdateNoteRequest request)
    {
        // Validate request
        if (string.IsNullOrWhiteSpace(request.Title))
            return BadRequest(new { message = "Title is required and cannot be empty." });

        if (request.Title.Length > 200)
            return BadRequest(new { message = "Title cannot exceed 200 characters." });

        if (request.Content?.Length > 5000)
            return BadRequest(new { message = "Content cannot exceed 5000 characters." });

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            return Unauthorized(new { message = "User ID not found in token." });

        var note = await db.Notes.FindAsync(id);

        if (note == null || note.IsDeleted)
            return NotFound(new { message = "Note not found." });

        if (note.UserId != userId)
            return Forbid();

        // Update fields
        note.Title = request.Title.Trim();
        note.Content = request.Content?.Trim();
        note.Category = request.Category?.Trim();
        note.Tags = request.Tags?.Trim();
        note.UpdatedAt = DateTime.UtcNow;

        db.Notes.Update(note);
        await db.SaveChangesAsync();

        var response = MapToResponse(note);
        return Ok(response);
    }

    /// <summary>
    /// Delete a note (soft delete, if it belongs to the authenticated user)
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteNote(int id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            return Unauthorized(new { message = "User ID not found in token." });

        var note = await db.Notes.FindAsync(id);

        if (note == null || note.IsDeleted)
            return NotFound(new { message = "Note not found." });

        if (note.UserId != userId)
            return Forbid();

        // Soft delete
        note.IsDeleted = true;
        note.DeletedAt = DateTime.UtcNow;

        db.Notes.Update(note);
        await db.SaveChangesAsync();

        return NoContent();
    }

    /// <summary>
    /// Helper method to map Note model to NoteResponse DTO
    /// </summary>
    private static NoteResponse MapToResponse(Note note) => new(
        note.Id,
        note.Title,
        note.Content,
        note.Category,
        note.Tags,
        note.IsArchived,
        note.CreatedAt,
        note.UpdatedAt,
        note.ArchivedAt
    );
}
