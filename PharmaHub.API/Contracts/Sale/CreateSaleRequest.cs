namespace PharmaHub.API.Contracts;

public class CreateSaleRequest
{
    public int TotalQuantity { get; set; }
    public int TotalPrice { get; set; }
    public string Status { get; set; } = "Pending";
    public float Discount { get; set; }
    public List<SaleItem> SaleItems { get; set; } = [];
}


public class SaleItem
{
    public int MedicamentId { get; set; }
    public int Quantity { get; set; }
    public int PPV { get; set; }
    public float Discount { get; set; }
}