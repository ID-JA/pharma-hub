namespace PharmaHub.API.Dtos.Delivery;

public class DeliveryUpdateDto : BaseDto<DeliveryUpdateDto, Models.Delivery>
{
    public int Id { get; set; }
    public int? TotalQuantity { get; set; }
    public int? OrderNumber { get; set; }
    public DateTime? OrderDate { get; set; }
    public int? SupplierId { get; set; }
    public int? BillId { get; set; }
    public List<DeliveryMedicationUpdateDto> DeliveryMedications { get; set; }
}