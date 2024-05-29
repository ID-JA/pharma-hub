namespace PharmaHub.API.Models;

public class Sale : BaseModel
{
    public int TotalQuantity { get; set; }
    public double TotalPrice { get; set; }
    public string Status { get; set; }
    public float Discount { get; set; }
    public int SaleNumber { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public List<SaleMedications> SaleMedications { get; set; } = [];
    public List<InventoryHistory> InventoryHistories { get; set; } = [];
}
