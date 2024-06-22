using Microsoft.AspNetCore.Identity;

namespace PharmaHub.API.Models;
public class User : IdentityUser<int>
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Cni { get; set; }
    public char Gender { get; set; }
    public string Phone { get; set; }
    public string Address { get; set; }
    public List<Sale> Sales { get; set; } = [];
    public List<Delivery> Deliveries { get; set; } = [];
    public List<Bill> Bills { get; set; } = [];
    public List<CreditNote> CreditNotes { get; set; } = [];

}
