namespace PharmaHub.API.Dtos.Delivery;

public class DeliveryMedicationUpdateDto : BaseDto<DeliveryMedicationUpdateDto, Models.DeliveryMedication>
{
    public int Id { get; set; }
    public int Quantity { get; set; }
    public decimal Ppv { get; set; }
    public decimal Pph { get; set; }
    public int InventoryId { get; set; }
}