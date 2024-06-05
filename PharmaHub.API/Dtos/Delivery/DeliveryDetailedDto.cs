using PharmaHub.API.Dtos.Supplier;
using PharmaHub.API.Dtos.User;

namespace PharmaHub.API.Dtos.Delivery;

public class DeliveryDetailedDto : BaseDto<DeliveryDetailedDto, Models.Delivery>
{
    public int Id { get; set; }
    public int TotalQuantity { get; set; }
    public int DeliveryNumber { get; set; }
    public DateTime DeliveryDate { get; set; }
    public UserBasicDto User { get; set; }
    public SupplierBasicDto? Supplier { get; set; }
    public List<DeliveryMedicationDto> DeliveryMedications { get; set; }
}

public class BillBasic : BaseDto<BillBasic, Models.Bill>
{
    public int Id { get; set; }
}