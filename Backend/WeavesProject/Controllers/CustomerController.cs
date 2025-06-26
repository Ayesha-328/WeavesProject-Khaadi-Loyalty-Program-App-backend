using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using QRCoder; // <-- QR Code generator
using System.Threading.Tasks;

// Your DbContext and models must be defined properly:
using WeavesProject.Data; // Replace with actual namespace
using WeavesProject.Models;
using System.IO;
using System.Text;
using System.Security.Cryptography;


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

        // Construct payload: "custId:timestamp"
        string payload = $"{custId};{DateTime.UtcNow:o}";

        // Encrypt payload
        string encryptedString = EncryptAES(payload);

        // Generate SVG string (NOT base64 or encoded)
        string svgQrCode = GenerateQrCodeSvg(encryptedString);

        // ✅ Return SVG with correct content type
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

    // 🔧 Utility: Encryption function
    private static readonly string aesKey = "1234567890123456";  // Should be 16/24/32 chars for AES-128/192/256
    private static readonly string aesIV = "ThisIsAnIV123456";     // 16 chars for AES

    private string EncryptAES(string plainText)
    {
        using (Aes aes = Aes.Create())
        {
            aes.Key = Encoding.UTF8.GetBytes(aesKey);
            aes.IV = Encoding.UTF8.GetBytes(aesIV);
            aes.Mode = CipherMode.CBC;
            aes.Padding = PaddingMode.PKCS7;

            ICryptoTransform encryptor = aes.CreateEncryptor(aes.Key, aes.IV);
            using (MemoryStream ms = new MemoryStream())
            using (CryptoStream cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
            {
                using (StreamWriter sw = new StreamWriter(cs))
                {
                    sw.Write(plainText);
                }
                byte[] encrypted = ms.ToArray();
                return Convert.ToBase64String(encrypted);
            }
        }
    }


    // For get all customers
    // 5. GET /api/customer/all
    [HttpGet("all")]
    public IActionResult GetAllCustomers()
    {
        var customers = _context.Customer.ToList();
        return Ok(customers);
    }
}
