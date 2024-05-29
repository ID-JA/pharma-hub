using PharmaHub.API.Dtos.StockHistory;
using PharmaHub.API.Dtos.User;

namespace PharmaHub.API.Dtos.Sale;

public class SaleDetailedDto : BaseDto<SaleDetailedDto, Models.Sale>
{
    public int Id { get; set; }
    public int TotalQuantity { get; set; }
    public double TotalPrice { get; set; }
    public string Status { get; set; }
    public float Discount { get; set; }
    public int SaleNumber { get; set; }
    public UserBasicDto User { get; set; }
    public List<SaleMedicamentDto> SaleMedicaments { get; set; }
    public List<StockHistoryBasicDto> StockHistories { get; set; }
}