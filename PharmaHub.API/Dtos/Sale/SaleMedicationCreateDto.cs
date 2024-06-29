namespace PharmaHub.API.Dtos.Sale;

public class SaleMedicationCreateDto : BaseDto<SaleMedicationCreateDto, SaleMedication>
{
    public int InventoryId { get; set; }
    public int Quantity { get; set; }
    public string SaleType { get; set; }
    public decimal NetPrice { get; set; }
    public decimal BrutPrice { get; set; }
    public double DiscountRate { get; set; }
}
