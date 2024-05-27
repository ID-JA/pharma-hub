namespace PharmaHub.API.Dtos;

public class CreateOrderDto : BaseDto<CreateOrderDto, Order>
{

    public int TotalQuantity { get; set; }
    public int OrderNumber { get; set; }
    public DateTime OrderDate { get; set; }
    public int SupplierId { get; set; }
    public List<OrderMedicamentDto> OrderMedicaments { get; set; } = [];
}