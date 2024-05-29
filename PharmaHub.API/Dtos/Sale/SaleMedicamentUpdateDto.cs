namespace PharmaHub.API.Dtos.Sale;

public class SaleMedicamentUpdateDto : BaseDto<SaleMedicamentUpdateDto, Models.Sale>
{
    public int Id { get; set; }
    public int MedicamentId { get; set; }
    public int Quantity { get; set; }
    public double PPV { get; set; }
    public double TotalPrice { get; set; }
    public float TVA { get; set; }
    public float Discount { get; set; }
}