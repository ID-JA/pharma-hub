namespace PharmaHub.API.Dtos.Order;

public class OrderCreateDto : BaseDto<OrderCreateDto, Models.Order>
{
    public int TotalQuantity { get; set; }
    public int OrderNumber { get; set; }
    public DateTime OrderDate { get; set; }
    public int UserId { get; set; }
    public int? SupplierId { get; set; }
    public int? BillId { get; set; }
    public List<OrderMedicationCreateDto> OrderMedicaments { get; set; }
}