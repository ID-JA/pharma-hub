namespace PharmaHub.API.Dtos.Delivery;

public class DeliveryCreateDto : BaseDto<DeliveryCreateDto, Models.Delivery>
{
    public decimal TotalPpv { get; set; }
    public decimal TotalFreePpv { get; set; }
    public decimal TotalNetPph { get; set; }
    public decimal TotalBrutPph { get; set; }
    public decimal DiscountedAmount { get; set; }
    public int TotalQuantity { get; set; }
    public int DeliveryNumber { get; set; }
    public DateTime DeliveryDate { get; set; }
    public int? SupplierId { get; set; }
    public List<DeliveryMedicationCreateDto> DeliveryMedications { get; set; }
}
