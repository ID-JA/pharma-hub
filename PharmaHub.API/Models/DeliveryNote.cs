namespace PharmaHub.API.Models;

public class DeliveryNote : BaseModel
{
    public float TotalPrice { get; set; }
    public int BillId { get; set; }
    public Bill Bill { get; set; }
    public List<Order> Orders { get; set; }
}