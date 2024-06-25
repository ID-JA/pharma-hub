using PharmaHub.API.Dtos.StockHistory;
using PharmaHub.API.Dtos.User;

namespace PharmaHub.API.Dtos.Sale;

public class SaleDetailedDto : BaseDto<SaleDetailedDto, Models.Sale>
{
    public int Id { get; set; }
    public string Status { get; set; }
    public string PaymentType { get; set; }
    public int SaleNumber { get; set; }
    public int TotalQuantities { get; set; }
    public decimal TotalNetPrices { get; set; }
    public decimal TotalBrutPrices { get; set; }
    public decimal DiscountedAmount { get; set; }
    public DateTime CreatedAt { get; set; }
    public UserBasicDto User { get; set; }
    public List<SaleMedicationDto> SaleMedications { get; set; } = [];
    public List<StockHistoryBasicDto> InventoryHistories { get; set; } = [];
}