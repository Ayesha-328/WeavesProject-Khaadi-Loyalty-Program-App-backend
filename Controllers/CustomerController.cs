using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using QRCoder; // <-- QR Code generator
using System.Threading.Tasks;

// Your DbContext and models must be defined properly:
using WeavesProject.Data; // Replace with actual namespace
using WeavesProject.Models;

[ApiController]
[Route("api/[controller]")]
public class CustomerController : ControllerBase
{
    private readonly CustomerContext _context;

public CustomerController(CustomerContext context)
{
    _context = context;
}

    // 1. POST /api/customer/login
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        var customer = _context.Customer.FirstOrDefault(c => c.PhoneNumber == request.PhoneNumber);
        if (customer == null)
            return NotFound("Customer not found");

        return Ok(new
        {
            message = "Login successful",
            customerId = customer.CustId
        });
    }

    // 2. POST /api/customer/logout
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        // Stateless logout
        return Ok(new { message = "Logout successful" });
    }

    // 3. GET /api/customer/:id
    [HttpGet("{id}")]
    public IActionResult GetCustomerById(int id)
    {
        var customer = _context.Customer.FirstOrDefault(c => c.CustId == id);
        if (customer == null)
            return NotFound("Customer not found");

        return Ok(customer);
    }

    // 4. GET /api/customer/qrcode/:custId
[HttpGet("qrcode/{custId}")]
public IActionResult GenerateCustomerQRCode(int custId)
{
    var customer = _context.Customer.FirstOrDefault(c => c.CustId == custId);
    if (customer == null)
        return NotFound("Customer not found");

    string svgQrCode = GenerateQrCodeSvg(custId.ToString());

    // ✅ Return raw SVG with correct content-type
    return Content(svgQrCode, "image/svg+xml");
}

    // 🔧 Utility: Generate SVG QR Code
    private string GenerateQrCodeSvg(string data)
    {
        using var qrGenerator = new QRCodeGenerator();
        using var qrData = qrGenerator.CreateQrCode(data, QRCodeGenerator.ECCLevel.Q);
        var qrCode = new SvgQRCode(qrData);
        return qrCode.GetGraphic(5);
    }
}
