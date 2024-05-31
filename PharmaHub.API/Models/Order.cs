namespace PharmaHub.API.Models;

public class Order : BaseModel
{
    public int TotalQuantity { get; set; }
    public int OrderNumber { get; set; }
    public DateTime OrderDate { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public int? SupplierId { get; set; }
    public Supplier Supplier { get; set; } = null!;
    public int? BillId { get; set; }
    public Bill Bill { get; set; } = null!;
    public List<InventoryHistory> InventoryHistories { get; set; } = [];
    public List<DeliveryMedication> OrderMedications { get; set; } = [];
}
