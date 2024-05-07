namespace PharmaHub.Data.Models;
public class Order : BaseModel
{
    public string Status { get; set; }
    public int TotalQuantity { get; set; }
    // add totél price
    public int DeliveryNoteId { get; set; }
    public DeliveryNote DeliveryNote { get; set; }
}
