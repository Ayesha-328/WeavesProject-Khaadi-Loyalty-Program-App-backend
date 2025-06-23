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

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly CustomerContext _context;

    public UserController(CustomerContext context)
    {
        _context = context;
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
        var user = _context.Users.FirstOrDefault(u => u.Email == request.Email && u.Password == request.Password);
        if (user == null)
            return Unauthorized("Invalid email or password");

        return Ok(new
        {
            message = "Login successful",
            userId = user.UserId,
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

  

}
