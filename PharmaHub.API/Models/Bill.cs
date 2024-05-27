namespace PharmaHub.API.Models;

public class Bill : BaseModel
{
    public int BillNumber { get; set; }
    public string Status { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }
    public List<Order> Orders { get; set; }
}
