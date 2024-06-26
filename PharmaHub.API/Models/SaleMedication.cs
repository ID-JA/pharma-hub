using System.ComponentModel;
using Microsoft.EntityFrameworkCore;

namespace PharmaHub.API.Models;

public class SaleMedication : BaseModel
{
    public int Quantity { get; set; }
    [DefaultValue("Box")]
    public string SaleType { get; set; }
    [Precision(18, 2)]
    public decimal NetPrice { get; set; }
    [Precision(18, 2)]
    public decimal BrutPrice { get; set; }
    public double DiscountRate { get; set; }
    public string? Status { get; set; }
    public int SaleId { get; set; }
    public Sale Sale { get; set; } = null!;
    public int InventoryId { get; set; }
    public Inventory Inventory { get; set; } = null!;
    public List<InventoryHistory> InventoryHistories { get; set; } = [];
}
