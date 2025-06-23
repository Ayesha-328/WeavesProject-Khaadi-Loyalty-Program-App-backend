public class UpdateCreditRequest
{
    public int CustId { get; set; }
    public int UserId { get; set; }
    public int Credit { get; set; } // credit to ADD, not replace
}
