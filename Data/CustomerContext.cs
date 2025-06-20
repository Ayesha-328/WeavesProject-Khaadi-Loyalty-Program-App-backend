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

        // This property represents the Customers table in the database
        public DbSet<Customer> Customer { get; set; }
    }
}
