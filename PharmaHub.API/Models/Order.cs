namespace PharmaHub.API.Models;

public class Order : BaseModel
{

    public int TotalQuantity { get; set; }
    public int OrderNumber { get; set; }
    public DateTime OrderDate { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }
    public int? SupplierId { get; set; }
    public Supplier Supplier { get; set; }
    public int? BillId { get; set; }
    public Bill Bill { get; set; }
    public List<StockHistory> StockHistories { get; set; }
    public List<OrderMedicament> OrderMedicaments { get; set; } = [];
}
