namespace PharmaHub.API.Dtos.Sale;

public class SaleMedicationCreateDto : BaseDto<SaleMedicationCreateDto, Models.Sale>
{
    public int InventoryId { get; set; }
    public int Quantity { get; set; }
    public double Ppv { get; set; }
    public double TotalPrice { get; set; }
    public float Tva { get; set; }
    public float Discount { get; set; }
}