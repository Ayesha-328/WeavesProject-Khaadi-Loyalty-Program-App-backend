using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WeavesProject.Models // ✅ Wrap in correct namespace
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required]
        [MaxLength(50)]
        public string Username { get; set; }

        [EmailAddress]
        [MaxLength(100)]
        public string Email { get; set; }

        [Required]
        [MaxLength(255)]
        public string Password { get; set; }

        [Required]
    [MaxLength(20)]
    public string Role { get; set; } // ✅ Changed from enum to string

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // ✅ Pluralized and ready for EF Core navigation
        public ICollection<Transaction> Transactions { get; set; }
    }

    
}
