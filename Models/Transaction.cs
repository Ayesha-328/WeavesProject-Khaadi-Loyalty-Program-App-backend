using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WeavesProject.Models; // ✅ This makes Customer and User visible

namespace WeavesProject.Models // ✅ Wrap in the correct namespace
{
    public class Transaction
    {
        [Key]
        public int TransId { get; set; }

        [Required]
        public int CustId { get; set; }

        [ForeignKey("CustId")]
        public Customer Customer { get; set; }

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; }

        [Required]
        [EnumDataType(typeof(TransactionType))]
        public TransactionType Type { get; set; }

        public int Amount { get; set; }

        public int PrevBalance { get; set; }

        public int NewBalance { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public enum TransactionType
    {
        Credit,
        Debit
    }
}
