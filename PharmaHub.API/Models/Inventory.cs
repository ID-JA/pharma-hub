using Microsoft.EntityFrameworkCore;

namespace PharmaHub.API.Models;

public class Inventory : BaseModel
{
    public int MedicationId { get; set; }
    public Medication Medication { get; set; } = null!;

    [Obsolete("this should be remove, use BoxQuantity")]
    public int Quantity { get; set; }
    public int UnitQuantity { get; set; }
    public int BoxQuantity { get; set; }

    public DateTime ExpirationDate { get; set; }

    [Precision(10, 2)]
    public decimal Ppv { get; set; }

    [Precision(10, 2)]
    public decimal Pph { get; set; }

    public List<OrderDeliveryInventory> OrderDeliveryInventories { get; set; } = [];
    public List<InventoryHistory> InventoryHistories { get; set; } = [];
    public List<CreditNoteMedication> CreditNoteMedications { get; set; } = [];

}
