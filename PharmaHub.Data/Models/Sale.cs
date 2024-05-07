namespace PharmaHub.Data.Models;
public class Sale : BaseModel
{
    public int TotalQuantity { get; set; }
    public int TotalPrice { get; set; }
    public string Status { get; set; }
    public float Discount { get; set; }
    public int SaleNumber { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }
    public List<SaleDrug> SaleDrugs { get; set; }
    public List<StockHistory> StockHistories { get; set; }
}
