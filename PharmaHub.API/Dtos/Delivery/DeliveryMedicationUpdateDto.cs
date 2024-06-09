namespace PharmaHub.API.Dtos.Delivery;

public class DeliveryMedicationUpdateDto : BaseDto<DeliveryMedicationUpdateDto, OrderDeliveryInventory>
{
    public int DeliveredQuantity { get; set; }
    public int OrderedQuantity { get; set; }
    public decimal Pph { get; set; }
    public int InventoryId { get; set; }
    public double DiscountRate { get; set; }
    public int TotalFreeUnits { get; set; }
    public int OrderItemId { get; set; } // we use this to change the orders status's to processed
}