using System.ComponentModel.DataAnnotations;

public class CreateCustomerRequest
{
    [Required]
    public string FullName { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    public string PhoneNumber { get; set; }

    public int Credit { get; set; }
    public string City { get; set; }
    public string Country { get; set; }
    public string Department { get; set; }
    public string Position { get; set; }
}