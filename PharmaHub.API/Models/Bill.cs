using Microsoft.EntityFrameworkCore;

namespace PharmaHub.API.Models;

public class Bill : BaseModel
{
    public int BillNumber { get; set; }
    public DateTime BillDate { get; set; }
    public string PaymentType { get; set; }
    public string? CheckNumber { get; set; }
    public string? EffectNumber { get; set; }
    public DateTime? DueDate { get; set; }
    public DateTime? DisbursementDate { get; set; }
    public string? BankName { get; set; }

    [Precision(10, 2)]
    public decimal TotalPph { get; set; }

    [Precision(10, 2)]
    public decimal TotalPphBrut { get; set; }

    [Precision(10, 2)]
    public decimal TotalPpv { get; set; }
    [Precision(10, 2)]
    public decimal TotalFreePpv { get; set; }
    [Precision(10, 2)]
    public decimal TotalPayment { get; set; }
    public string Status { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }
    public List<Delivery> Deliveries { get; set; }

}
