namespace PharmaHub.API.Services.Interfaces;

public interface IBillService
{
  Task<bool> CreateBillAsync(CreateBillDto request, CancellationToken cancellationToken = default);
  // Task<BillDto?> GetBillAsync(int id, CancellationToken cancellationToken = default);
  // Task<bool> DeleteBill(int id, CancellationToken cancellationToken = default);
  // Task<bool> UpdateBill(int id, BillDto request, CancellationToken cancellationToken = default);
  // Task<PaginatedResponse<Bill>> GetBills(string name, CancellationToken cancellationToken);
}
public class BillService(ApplicationDbContext dbContext, ICurrentUser currentUser) : IBillService
{

  public async Task<bool> CreateBillAsync(CreateBillDto request, CancellationToken cancellationToken = default)
  {
    var userId = currentUser.GetUserId();
    Bill bill = new()
    {
      UserId = userId,
      BillNumber = request.BillNumber,
      BillDate = request.BillDate,
      PaymentType = request.PaymentType,
      CheckNumber = request.CheckNumber,
      EffectNumber = request.EffectNumber,
      DueDate = request.DueDate,
      DisbursementDate = request.DisbursementDate,
      BankName = request.BankName,
      TotalPayment = request.TotalPayment,
      Status = "Paid"
    };
    dbContext.Bills.Add(bill);
    await dbContext.SaveChangesAsync(cancellationToken);
    return true;
  }
}