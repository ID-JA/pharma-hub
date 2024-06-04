using PharmaHub.API.Dtos.Supplier;
using PharmaHub.API.Dtos.User;

namespace PharmaHub.API.Dtos.Delivery;

public class DeliveryDetailedDto : BaseDto<DeliveryDetailedDto, Models.Delivery>
{
    public int Id { get; set; }
    public int TotalQuantity { get; set; }
    public int OrderNumber { get; set; }
    public DateTime OrderDate { get; set; }
    public UserBasicDto User { get; set; }
    public SupplierBasicDto? Supplier { get; set; }
    public List<DeliveryMedicationBasicDto> OrderMedications { get; set; }
}

public class BillBasic : BaseDto<BillBasic, Models.Bill>
{
    public int Id { get; set; }
}