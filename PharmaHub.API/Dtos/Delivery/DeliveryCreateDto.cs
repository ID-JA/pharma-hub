namespace PharmaHub.API.Dtos.Delivery;

public class DeliveryCreateDto : BaseDto<DeliveryCreateDto, Models.Delivery>
{
    public int TotalQuantity { get; set; }
    public int OrderNumber { get; set; }
    public DateTime OrderDate { get; set; }
    public int? SupplierId { get; set; }
    public List<DeliveryMedicationCreateDto> DeliveryMedications { get; set; }
}