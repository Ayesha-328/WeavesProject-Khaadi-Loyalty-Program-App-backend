using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WeavesProject.Models
{
    public class Customer
    {
        [Key]
        public int CustId { get; set; }

        [Required]
        [MaxLength(100)]
        public string FullName { get; set; }

        [EmailAddress]
        [MaxLength(100)]
        public string Email { get; set; }

        [Required]
        [Phone]
        [MaxLength(20)]
        public string PhoneNumber { get; set; } // ✅ New property

        public int Credit { get; set; }

        [MaxLength(50)]
        public string City { get; set; }

        [MaxLength(50)]
        public string Country { get; set; }

        [MaxLength(100)]
        public string Department { get; set; }

        [MaxLength(100)]
        public string Position { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public ICollection<Transaction> Transaction { get; set; }
    }
}
