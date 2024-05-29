namespace PharmaHub.API.Dtos.Order;

public class OrderBasicDto: BaseDto<OrderBasicDto, Models.Order>
{
    public int Id { get; set; }
    public int OrderNumber { get; set; }
    public DateTime OrderDate { get; set; }
    public int TotalQuantity { get; set; }
}