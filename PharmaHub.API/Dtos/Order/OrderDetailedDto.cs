using PharmaHub.API.Dtos.StockHistory;
using PharmaHub.API.Dtos.Supplier;
using PharmaHub.API.Dtos.User;

namespace PharmaHub.API.Dtos.Order;

public class OrderDetailedDto : BaseDto<OrderDetailedDto, Models.Order>
{
    public int Id { get; set; }
    public int TotalQuantity { get; set; }
    public int OrderNumber { get; set; }
    public DateTime OrderDate { get; set; }
    public UserBasicDto User { get; set; }
    public SupplierBasicDto? Supplier { get; set; }
    public BillBasic? Bill { get; set; }
    public List<StockHistoryBasicDto> StockHistories { get; set; }
    public List<OrderMedicamentDto> OrderMedicaments { get; set; }
}

public class BillBasic
{

}