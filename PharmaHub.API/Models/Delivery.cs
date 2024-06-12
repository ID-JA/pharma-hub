namespace PharmaHub.API.Models;

public class Delivery : BaseModel
{
    public int TotalQuantity { get; set; }
    public int DeliveryNumber { get; set; }
    public DateTime DeliveryDate { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public int? SupplierId { get; set; }
    public Supplier Supplier { get; set; } = null!;
    public int? BillId { get; set; }
    public Bill Bill { get; set; } = null!;
    public List<InventoryHistory> InventoryHistories { get; set; } = [];
    public List<OrderDeliveryInventory> OrderDeliveryInventories { get; set; } = [];
}
