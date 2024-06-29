using Microsoft.EntityFrameworkCore;

namespace PharmaHub.API.Models;

public class Delivery : BaseModel
{
    public int TotalQuantity { get; set; }
    [Precision(18, 2)]
    public decimal TotalPpv { get; set; }
    [Precision(18, 2)]
    public decimal TotalFreePpv { get; set; }
    [Precision(18, 2)]
    public decimal TotalNetPph { get; set; }
    [Precision(18, 2)]
    public decimal TotalBrutPph { get; set; }
    [Precision(18, 2)]
    public decimal DiscountedAmount { get; set; }
    public int DeliveryNumber { get; set; }
    public DateTime DeliveryDate { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public int? SupplierId { get; set; }
    public Supplier Supplier { get; set; } = null!;
    public int? BillId { get; set; }
    public Bill Bill { get; set; } = null!;
    public List<OrderDeliveryInventory> OrderDeliveryInventories { get; set; } = [];
}
