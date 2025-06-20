public class BulkCreditUpdateRequest
{
    public int CustId { get; set; }
    public string FullName { get; set; } // Optional: just for validation/display
    public int Credit { get; set; }
}
