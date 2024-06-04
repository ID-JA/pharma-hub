using Microsoft.EntityFrameworkCore;

namespace PharmaHub.API.Models.Order;

public class Order : BaseModel
{
    public DateTime OrderDate { get; set; }
    public string Status { get; set; }
    public int SupplierId { get; set; }
    public Supplier Supplier { get; set; }
    public List<OrderItem> OrderItems { get; set; }
}

public class OrderItem
{
    public int OrderId { get; set; }
    public Order Order { get; set; } = null!;
    public int Quantity { get; set; }
    [Precision(10, 2)]
    public decimal TotalPurchasePrice { get; set; }
    [Precision(10, 2)]
    public decimal Pph { get; set; }
    public double DiscountRate { get; set; }
    public int InventoryId { get; set; }
    public Inventory Inventory { get; set; } = null!;
    public string Status { get; set; }
}
