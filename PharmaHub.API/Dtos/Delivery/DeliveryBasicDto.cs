namespace PharmaHub.API.Dtos.Delivery;

public class DeliveryBasicDto : BaseDto<DeliveryBasicDto, Models.Delivery>
{
    public int Id { get; set; }
    public int DeliveryNumber { get; set; }
    public DateTime DeliveryDate { get; set; }
    public int TotalQuantity { get; set; }
}
