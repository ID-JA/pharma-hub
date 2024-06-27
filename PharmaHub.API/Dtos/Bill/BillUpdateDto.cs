namespace PharmaHub.API;

public class BillUpdateDto : BaseDto<BillUpdateDto, Bill>
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
}
