using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Collections.Generic;
using WeavesProject.Data;
using WeavesProject.Models;

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

    _context.Transactions.Add(transaction);  // ✅ Plural
    _context.SaveChanges(); // ✅ This will save both the customer update and transaction insert

    return Ok(new
    {
        message = "Transaction successful",
        transactionId = transaction.TransId
    });
}

}
