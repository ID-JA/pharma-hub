using PharmaHub.API.Dtos.Order;

namespace PharmaHub.API.Dtos.Supplier;

public class SupplierWithOrdersDto
{
    public SupplierBasicDto Supplier { get; set; }
    public List<OrderBasicDto> Orders { get; set; }
}