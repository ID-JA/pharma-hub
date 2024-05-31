namespace PharmaHub.API.Dtos.Delivery;

public class DeliveryMedicationCreateDto : BaseDto<DeliveryMedicationCreateDto, Models.DeliveryMedication>
{
    public int Quantity { get; set; }
    public decimal Ppv { get; set; }
    public decimal Pph { get; set; }
    public int InventoryId { get; set; }
}