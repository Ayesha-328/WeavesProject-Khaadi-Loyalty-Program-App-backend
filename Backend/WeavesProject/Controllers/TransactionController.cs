using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Collections.Generic;
using WeavesProject.Data;
using WeavesProject.Models;
using System.Linq;
using System;
using System.IO;
using CsvHelper;
using System.Globalization;




[ApiController]
[Route("api/[controller]")]
public class TransactionController : ControllerBase
{
    private readonly CustomerContext _context;

    public TransactionController(CustomerContext context)
    {
        _context = context;
    }

    // 1. GET /api/transaction
    [HttpGet]
    public IActionResult GetAllTransactions()
    {
        var transactions = _context.Transactions
            .OrderByDescending(t => t.CreatedAt)
            .ToList();

        return Ok(transactions);
    }

    // 2. GET /api/transaction/customer/{id}
    [HttpGet("customer/{id}")]
    public IActionResult GetCustomerTransactions(int id)
    {
        var customer = _context.Customer.FirstOrDefault(c => c.CustId == id);
        if (customer == null)
            return NotFound("Customer not found");

        var transactions = _context.Transactions
            .Where(t => t.CustId == id)
            .OrderByDescending(t => t.CreatedAt)
            .ToList();

        return Ok(transactions);
    }

    // 3. POST /api/transaction/create/debit
    [HttpPost("create/debit")]
    public IActionResult CreateDebitTransaction([FromBody] DebitTransactionRequest request)
    {
        var customer = _context.Customer.FirstOrDefault(c => c.CustId == request.CustId);
        var admin = _context.Users.FirstOrDefault(u => u.UserId == request.UserId);

        if (customer == null) return NotFound("Customer not found");
        if (admin == null) return NotFound("Admin user not found");

        if (request.Amount <= 0)
            return BadRequest("Amount must be greater than 0");

        if (customer.Credit < request.Amount)
            return BadRequest("Insufficient credit to complete this transaction");

        int previousCredit = customer.Credit;
        int newCredit = previousCredit - request.Amount;

        // ✅ Update customer's credit and timestamp
        customer.Credit = newCredit;
        customer.UpdatedAt = DateTime.UtcNow;

        // ✅ Create the transaction
        var transaction = new Transaction
        {
            CustId = request.CustId,
            UserId = request.UserId,
            Type = "Debit",
            Amount = request.Amount,
            PrevBalance = previousCredit,
            NewBalance = newCredit,
            CreatedAt = DateTime.UtcNow
        };

        _context.Transactions.Add(transaction);
        _context.SaveChanges(); // ✅ This will save both the customer update and transaction insert

        return Ok(new
        {
            message = "Transaction successful",
            transactionId = transaction.TransId
        });
    }

    // 4. PATCH /api/transaction/update-credit
    [HttpPatch("/update/credit")]
    public IActionResult UpdateCustomerCredit([FromBody] UpdateCreditRequest request)
    {
        var customer = _context.Customer.FirstOrDefault(c => c.CustId == request.CustId);
        if (customer == null)
            return NotFound("Customer not found");

        int prevCredit = customer.Credit;
        int creditToAdd = request.Credit;

        customer.Credit += creditToAdd;
        customer.UpdatedAt = DateTime.UtcNow;

        // Record the transaction
        var transaction = new Transaction
        {
            CustId = customer.CustId,
            UserId = request.UserId,
            Type = "Credit",
            Amount = creditToAdd,
            PrevBalance = prevCredit,
            NewBalance = customer.Credit,
            CreatedAt = DateTime.UtcNow
        };

        _context.Transactions.Add(transaction);
        _context.SaveChanges();

        return Ok(new { message = "Customer credit updated and transaction recorded" });
    }

    // 5. PATCH /api/transaction/update/bulk-upload
    [HttpPost("/update/bulk-upload")]
    public IActionResult BulkCreditUpdate(IFormFile file, [FromQuery] int performedByUserId)
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
                int prevCredit = customer.Credit;
                int creditToAdd = row.Credit;

                customer.Credit += creditToAdd; // increment credit
                customer.UpdatedAt = DateTime.UtcNow;
                updatedCount++;

                // Add credit transaction
                var transaction = new Transaction
                {
                    CustId = customer.CustId,
                    UserId = performedByUserId,
                    Type = "Credit",
                    Amount = creditToAdd,
                    PrevBalance = prevCredit,
                    NewBalance = customer.Credit,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Transactions.Add(transaction);
            }
        }

        _context.SaveChanges();

        return Ok(new
        {
            message = $"{updatedCount} customer credits added and transactions recorded successfully."
        });
    }

}
