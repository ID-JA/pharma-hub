namespace PharmaHub.API.Dtos.Delivery;

public class DeliveryCreateDto : BaseDto<DeliveryCreateDto, Models.Delivery>
{
    public int TotalQuantity { get; set; }
    public int DeliveryNumber { get; set; }
    public DateTime DeliveryDate { get; set; }
    public int? SupplierId { get; set; }
    public List<DeliveryMedicationCreateDto> DeliveryMedications { get; set; }
}
