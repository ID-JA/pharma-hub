namespace PharmaHub.API.Models;

public class StockHistory : BaseModel
{
    public int QuantityChanged { get; set; }
    public int MedicamentId { get; set; }
    public Medicament Medicament { get; set; }
    public int InventoryId { get; set; }
    public Inventory Inventory { get; set; }
    public int? SaleId { get; set; }
    public Sale Sale { get; set; }
    public int? OrderId { get; set; }
    public Order Order { get; set; }
}
