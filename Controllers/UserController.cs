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

    // 3. POST /api/user/customer/create
    [HttpPost("customer/create")]
    public IActionResult CreateCustomer([FromBody] CreateCustomerRequest request)
    {
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

    // 4. PATCH /api/user/customer/update-credit
    [HttpPatch("customer/update-credit")]
    public IActionResult UpdateCustomerCredit([FromBody] UpdateCreditRequest request)
    {
        var customer = _context.Customer.FirstOrDefault(c => c.CustId == request.CustId);
        if (customer == null)
            return NotFound("Customer not found");

        customer.Credit = request.Credit;
        customer.UpdatedAt = DateTime.UtcNow;
        _context.SaveChanges();

        return Ok(new { message = "Customer credit updated" });
    }

   [HttpPost("/api/customer/bulk-upload")]
public IActionResult BulkCreditUpdate(IFormFile file)
{
    if (file == null || file.Length == 0)
        return BadRequest("Invalid file");

    using var reader = new StreamReader(file.OpenReadStream());
    using var csv = new CsvHelper.CsvReader(reader, CultureInfo.InvariantCulture);

    var updates = csv.GetRecords<BulkCreditUpdateRequest>().ToList();
    int updatedCount = 0;

    foreach (var row in updates)
    {
        var customer = _context.Customer.FirstOrDefault(c => c.CustId == row.CustId);
        if (customer != null)
        {
            customer.Credit = row.Credit;
            customer.UpdatedAt = DateTime.UtcNow;
            updatedCount++;
        }
    }

    _context.SaveChanges();

    return Ok(new
    {
        message = $"{updatedCount} customer credits updated successfully."
    });
}

}
