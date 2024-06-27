namespace PharmaHub.API.Dtos.Delivery;

public class DeliveryMedicationCreateDto : BaseDto<DeliveryMedicationCreateDto, Models.DeliveryMedication>
{
    public int DeliveredQuantity { get; set; }
    public int InventoryId { get; set; }
    public double DiscountRate { get; set; }
    public int TotalFreeUnits { get; set; }
    public int OrderItemId { get; set; } // we use this to change the orders status's to processed
}
