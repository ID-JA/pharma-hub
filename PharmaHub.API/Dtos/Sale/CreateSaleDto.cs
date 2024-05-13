
namespace PharmaHub.API.Dtos;

public class CreateSaleDto
{
    public int TotalQuantity { get; set; }
    public int TotalPrice { get; set; }
    public string Status { get; set; } = "Pending";
    public float Discount { get; set; }
    public List<SaleMedicamentDto> SaleMedicaments { get; set; } = [];

}
