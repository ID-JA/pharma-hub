namespace PharmaHub.Data.Models;
public class DeliveryNote : BaseModel
{
    public int BillId { get; set; }
    public Bill Bill { get; set; }
    public List<Order> Orders { get; set; }
}
