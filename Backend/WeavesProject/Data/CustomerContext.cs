using Microsoft.EntityFrameworkCore;
using WeavesProject.Models; // Make sure this matches your actual namespace

namespace WeavesProject.Data
{
    public class CustomerContext : DbContext
    {
        public CustomerContext(DbContextOptions<CustomerContext> options)
            : base(options)
        {
        }

        // This property represents the Transactions table in the database
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Customer> Customer { get; set; }


    }
    
}
