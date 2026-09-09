using CoffeeManagement.Api.Data;
using CoffeeManagement.Api.DTOs;
using CoffeeManagement.Api.Models;
using CoffeeManagement.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CoffeeManagement.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(
    ApplicationDbContext db,
    PasswordService passwordService,
    TokenService tokenService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        if (await db.Users.AnyAsync(x => x.Username == request.Username || x.Email == request.Email))
            return Conflict("Username or email already exists.");

        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            PasswordHash = passwordService.HashPassword(request.Password),
            Role = "User"
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return Ok(new AuthResponse(tokenService.Create(user), user.Username, user.Role));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var user = await db.Users.SingleOrDefaultAsync(x => x.Username == request.Username);

        if (user is null || !passwordService.Verify(request.Password, user.PasswordHash))
            return Unauthorized("Invalid username or password.");

        return Ok(new AuthResponse(tokenService.Create(user), user.Username, user.Role));
    }
}
