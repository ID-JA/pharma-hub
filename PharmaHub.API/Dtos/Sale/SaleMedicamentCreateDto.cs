namespace PharmaHub.API.Dtos.Sale;

public class SaleMedicamentCreateDto : BaseDto<SaleMedicamentCreateDto, Models.Sale>
{
    public int MedicamentId { get; set; }
    public int Quantity { get; set; }
    public double Ppv { get; set; }
    public double TotalPrice { get; set; }
    public float Tva { get; set; }
    public float Discount { get; set; }
}