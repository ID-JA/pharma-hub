namespace PharmaHub.API.Dtos.Order;

public class OrderUpdateDto : BaseDto<OrderUpdateDto , Models.Order>
{
    public int Id { get; set; }
    public int? TotalQuantity { get; set; }
    public int? OrderNumber { get; set; }
    public DateTime? OrderDate { get; set; }
    public int? UserId { get; set; }
    public int? SupplierId { get; set; }
    public int? BillId { get; set; }
    public List<OrderMedicationUpdateDto> OrderMedicaments { get; set; }
}