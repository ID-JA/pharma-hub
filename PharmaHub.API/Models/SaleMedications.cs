namespace PharmaHub.API.Models;

public class SaleMedications : BaseModel
{
    public int Quantity { get; set; }
    public double Ppv { get; set; } // remove this
    public double TotalPrice { get; set; }
    public float Tva { get; set; } // remove this
    public float Discount { get; set; }
    public int SaleId { get; set; }
    public Sale Sale { get; set; } = null!;
    public int InventoryId { get; set; }
    public Inventory Inventory { get; set; } = null!;
}
