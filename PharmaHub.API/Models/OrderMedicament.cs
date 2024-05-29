using Microsoft.EntityFrameworkCore;

namespace PharmaHub.API.Models;

public class OrderMedicament
{
    public int OrderId { get; set; }
    public Order Order { get; set; } = null!;
    public int MedicamentId { get; set; }
    public Medicament Medicament { get; set; } = null!;
    public int Quantity { get; set; } = 0;
    [Precision(10, 2)]
    public decimal PPV { get; set; }
    [Precision(10, 2)]
    public decimal PPH { get; set; }
    public int? InventoryId { get; set; }
    public Inventory Inventory { get; set; }
}
