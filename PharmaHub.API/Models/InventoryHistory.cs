namespace PharmaHub.API.Models;

public class InventoryHistory : BaseModel
{
    public int PreviousBoxQuantity { get; set; }
    public int PreviousUnitQuantity { get; set; }
    public int NewBoxQuantity { get; set; }
    public int NewUnitQuantity { get; set; }
    public DateTime ChangeDate { get; set; }
    public string ChangeType { get; set; }
    public int InventoryId { get; set; }
    public Inventory Inventory { get; set; } = null!;
    public int? SaleId { get; set; }
    public Sale Sale { get; set; } = null!;
    public int? OrderId { get; set; }
    public Delivery Order { get; set; } = null!;
}
