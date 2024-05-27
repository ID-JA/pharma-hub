namespace PharmaHub.API.Dtos;

public class OrderDto : BaseDto<OrderDto, Order>
{
    public int Id { get; set; }
    public string Status { get; set; } = null!;
    public int TotalQuantity { get; set; }


    public int UserId { get; set; }
    public int? SupplierId { get; set; }


    public List<OrderMedicamentDto> OrderMedicaments { get; set; } = [];
}