namespace PharmaHub.API.Dtos;

public class CreateOrderDto : BaseDto<CreateOrderDto, Order>
{
    public string Status { get; set; } = "Pending";
    public int TotalQuantity { get; set; }
    public int SupplierId { get; set; }
    public List<OrderMedicamentDto> OrderMedicaments { get; set; } = [];
}