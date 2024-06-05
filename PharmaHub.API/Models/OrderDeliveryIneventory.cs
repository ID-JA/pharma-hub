using Microsoft.EntityFrameworkCore;

namespace PharmaHub.API.Models;

public class OrderDeliveryInventory : BaseModel
{
    public int InventoryId { get; set; }
    public Inventory Inventory { get; set; } = null!;

    public int? DeliveryId { get; set; }
    public Delivery Delivery { get; set; } = null!;

    public int? OrderId { get; set; }
    public Order Order { get; set; } = null!;

    public int OrderedQuantity { get; set; }

    public int DeliveredQuantity { get; set; }

    [Precision(10, 2)]
    public decimal Ppv { get; set; }

    [Precision(10, 2)]
    public decimal Pph { get; set; }

    [Precision(10, 2)]
    public decimal TotalPurchasePrice { get; set; }

    [Precision(10, 2)]
    public decimal PurchasePriceUnit { get; set; }

    public double DiscountRate { get; set; }

    public string Status { get; set; } = "Pending";
    public int TotalFreeUnits { get; set; }
}