namespace PharmaHub.API.Models;

public class StockHistory : BaseModel
{
    public int QuantityChanged { get; set; }
    public int DrugId { get; set; }
    public Drug Drug { get; set; }
    public int SaleId { get; set; }
    public Sale Sale { get; set; }
    public int OrderId { get; set; }
    public Order Order { get; set; }
}
