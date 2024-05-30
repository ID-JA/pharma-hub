namespace PharmaHub.API.Dtos.Order;

public class OrderMedicationCreateDto : BaseDto<OrderMedicationCreateDto, Models.OrderMedication>
{
    public int Quantity { get; set; }
    public decimal Ppv { get; set; }
    public decimal Pph { get; set; }
    public int InventoryId { get; set; }
}