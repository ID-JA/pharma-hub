namespace PharmaHub.API.Dtos.Delivery;

public class DeliveryBasicDto : BaseDto<DeliveryBasicDto, Models.Delivery>
{
    public int Id { get; set; }
    public int OrderNumber { get; set; }
    public DateTime OrderDate { get; set; }
    public int TotalQuantity { get; set; }
}