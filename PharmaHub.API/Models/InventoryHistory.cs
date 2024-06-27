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
    public int? SaleMedicationId { get; set; }
    public SaleMedication SaleMedication { get; set; } = null!;
    public int? OrderDeliveryInventoryId { get; set; }
    public OrderDeliveryInventory OrderDeliveryInventory { get; set; } = null!;
}
