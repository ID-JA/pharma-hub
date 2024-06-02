namespace PharmaHub.API.Dtos.Delivery;

public class DeliveryMedicationCreateDto : BaseDto<DeliveryMedicationCreateDto, Models.DeliveryMedication>
{
    public int Quantity { get; set; }
    public decimal Ppv { get; set; }
    public decimal Pph { get; set; }
    public int InventoryId { get; set; }
    public int OrderId { get; set; } // we use this to change the orders status's to processed
}