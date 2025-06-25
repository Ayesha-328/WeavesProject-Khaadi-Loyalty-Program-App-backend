using Microsoft.AspNetCore.Mvc;
using WeavesProject.Data;
using WeavesProject.Models;
using System.Linq;
using System;
using System.IO;
using CsvHelper;
using System.Globalization;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens; // 🔑 for SymmetricSecurityKey, SigningCredentials
using System.Security.Claims; // for Claims
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;


[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly CustomerContext _context;

    private readonly IConfiguration _config;

    public UserController(CustomerContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    private string GenerateJwtToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"])); // should match appsettings.json
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
        new Claim("userId", user.UserId.ToString()),
        new Claim("role", user.Role),
        new Claim(JwtRegisteredClaimNames.Sub, user.Username),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

        var token = new JwtSecurityToken(
            issuer: "WeavesApp",
            audience: "WeavesUsers",
            claims: claims,
            expires: DateTime.UtcNow.AddDays(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }


    // 1. POST /api/user/qrcode/scan
    [HttpPost("qrcode/scan")]
    public IActionResult ScanQRCode([FromBody] ScanQrRequest request)
    {
        var customer = _context.Customer.FirstOrDefault(c => c.CustId == request.CustId);
        if (customer == null)
            return NotFound("Customer not found");

        return Ok(new
        {
            customer.CustId,
            customer.FullName,
            customer.Email,
            customer.PhoneNumber,
            customer.Credit,
            customer.City,
            customer.Country,
            customer.Department,
            customer.Position
        });
    }

    // 2. POST /api/user/login
    [HttpPost("login")]
public IActionResult Login([FromBody] UserLoginRequest request)
{
    // Find user by username and plain password
    var user = _context.Users.FirstOrDefault(u =>
        u.Username == request.Username && u.Password == request.Password);

    if (user == null)
        return Unauthorized("Invalid Username or password");

    var token = GenerateJwtToken(user);

    return Ok(new
    {
        message = "Login successful",
        token,
        userId = user.UserId,
        username = user.Username,
        email = user.Email,
        role = user.Role
    });
}


    // 3. POST /api/user/register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUserRequest request)
    {
        // 1. Check for existing username/email
        if (_context.Users.Any(u => u.Username == request.Username))
            return BadRequest("Username already exists.");

        if (_context.Users.Any(u => u.Email == request.Email))
            return BadRequest("Email already exists.");

        // 2. Hash the password with salt
        using var hmac = new HMACSHA512();
        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            Password = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(request.Password))),
            Role = request.Role.ToLower() // store_admin or super_admin
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "User registered successfully." });
    }

    // 4. POST /api/user/customer/create
    [HttpPost("customer/create")]
    public IActionResult CreateCustomer([FromBody] CreateCustomerRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var customer = new Customer
        {
            FullName = request.FullName,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber,
            Credit = request.Credit,
            City = request.City,
            Country = request.Country,
            Department = request.Department,
            Position = request.Position,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Customer.Add(customer);
        _context.SaveChanges();

        return Ok(new { message = "Customer created", custId = customer.CustId });
    }
    
    [HttpGet("{id}")]
[Authorize]
public IActionResult GetUserById(int id)
{
    var user = _context.Users.FirstOrDefault(u => u.UserId == id);
    if (user == null)
        return NotFound("User not found");

    return Ok(new
    {
        user.UserId,
        user.Username,
        user.Email,
        user.Role
    });
}

  

}
