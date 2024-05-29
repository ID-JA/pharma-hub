namespace PharmaHub.API.Dtos.Order;

public class OrderMedicamentUpdateDto : BaseDto<OrderMedicamentUpdateDto, Models.OrderMedicament>
{
    public int Id { get; set; }
    public int Quantity { get; set; }
    public decimal Ppv { get; set; }
    public decimal Pph { get; set; }
    public int MedicamentId { get; set; }
    public int InventoryId { get; set; }
}