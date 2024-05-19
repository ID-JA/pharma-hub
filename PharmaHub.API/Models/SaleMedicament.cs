namespace PharmaHub.API.Models;

public class SaleMedicament : BaseModel
{
    public int Quantity { get; set; }
    public double PPV { get; set; }
    public double TotalPrice { get; set; }
    public int TVA { get; set; }
    public float Discount { get; set; }
    public int SaleId { get; set; }
    public Sale Sale { get; set; }
    public int MedicamentId { get; set; }
    public Medicament Medicament { get; set; }
}
