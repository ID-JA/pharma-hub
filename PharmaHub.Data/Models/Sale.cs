namespace PharmaHub.Data.Models;
public class Sale : BaseModel
{
    public int TotalQuantity { get; set; }
    public int TotalPrice { get; set; }
    public string Status { get; set; }
    // add discount flot
    public int SaleNumber { get; set; } // auto increment
    public int UserId { get; set; }
    public User User { get; set; }
    public List<SaleDrug> SaleDrugs { get; set; }

}
