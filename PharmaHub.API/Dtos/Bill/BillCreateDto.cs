namespace PharmaHub.API;

public class BillCreateDto : BaseDto<BillCreateDto, Bill>
{
    public int BillNumber { get; set; }
    public DateTime BillDate { get; set; }
    public string PaymentType { get; set; }
    public string? CheckNumber { get; set; }
    public string? EffectNumber { get; set; }
    public DateTime? DueDate { get; set; }
    public DateTime? DisbursementDate { get; set; }

    public string? BankName { get; set; }
    public decimal TotalPayment { get; set; }
    public decimal TotalPph { get; set; }
    public decimal TotalPphBrut { get; set; }
    public decimal TotalPpv { get; set; }
    public decimal TotalFreePpv { get; set; }
    public List<int> DeliveryIds { get; set; }
}
