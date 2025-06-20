namespace WeavesProject.Models
{
    public class DebitTransactionRequest
    {
        public int CustId { get; set; }
        public int UserId { get; set; }
        public int Amount { get; set; }
    }
}
