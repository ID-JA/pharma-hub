using Microsoft.EntityFrameworkCore;

namespace PharmaHub.API.Models;

public class Inventory : BaseModel
{
    public int MedicationId { get; set; }
    public Medication Medication { get; set; } = null!;

    public int Quantity { get; set; }

    public DateTime ExpirationDate { get; set; }

    [Precision(10, 2)]
    public decimal Ppv { get; set; }

    [Precision(10, 2)]
    public decimal Pph { get; set; }

    public List<DeliveryMedication> OrderMedications { get; set; } = [];
    public List<InventoryHistory> InventoryHistories { get; set; } = [];
}