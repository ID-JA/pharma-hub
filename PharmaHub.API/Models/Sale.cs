using Microsoft.EntityFrameworkCore;

namespace PharmaHub.API.Models;

public class Sale : BaseModel
{
    public string Status { get; set; }
    public string? PaymentType { get; set; }
    public int SaleNumber { get; set; }
    public int TotalQuantities { get; set; }
    [Precision(18, 2)]
    public decimal TotalNetPrices { get; set; }
    [Precision(18, 2)]
    public decimal TotalBrutPrices { get; set; }
    [Precision(18, 2)]
    public decimal DiscountedAmount { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public List<SaleMedication> SaleMedications { get; set; } = [];
}
