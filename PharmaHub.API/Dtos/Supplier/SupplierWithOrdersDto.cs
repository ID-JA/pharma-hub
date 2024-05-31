using PharmaHub.API.Dtos.Delivery;

namespace PharmaHub.API.Dtos.Supplier;

public class SupplierWithOrdersDto
{
    public SupplierBasicDto Supplier { get; set; }
    public List<DeliveryBasicDto> Orders { get; set; }
}