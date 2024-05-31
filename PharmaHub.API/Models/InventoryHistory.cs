namespace PharmaHub.API.Models;

public class InventoryHistory : BaseModel
{
    public int QuantityChanged { get; set; }
    public int InventoryId { get; set; }
    public Inventory Inventory { get; set; } = null!;
    public int? SaleId { get; set; }
    public Sale Sale { get; set; } = null!;
    public int? OrderId { get; set; }
    public Delivery Order { get; set; } = null!;
}
