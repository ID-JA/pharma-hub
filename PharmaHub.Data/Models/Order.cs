namespace PharmaHub.Data.Models;
public class Order : BaseModel
{
    public string Status { get; set; }
    public int TotalQuantity { get; set; }
    public int DeliveryNoteId { get; set; }
    public DeliveryNote DeliveryNote { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }
    public int SupplierId { get; set; }
    public Supplier Supplier { get; set; }
    public List<StockHistory> StockHistories { get; set; }
}
