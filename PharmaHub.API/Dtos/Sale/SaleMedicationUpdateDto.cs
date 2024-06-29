namespace PharmaHub.API.Dtos.Sale;

public class SaleMedicationUpdateDto : BaseDto<SaleMedicationUpdateDto, Models.Sale>
{
    public int Id { get; set; }
    public int InventoryId { get; set; }
    public int Quantity { get; set; }
    public decimal Ppv { get; set; }
    public decimal TotalPrice { get; set; }
    public double Tva { get; set; }
    public double Discount { get; set; }
}
