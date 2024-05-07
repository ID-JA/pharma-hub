namespace PharmaHub.Data.Models;
public class Bill : BaseModel
{
    public int BillNumber { get; set; }
    public string Status { get; set; }

    public int UserId { get; set; }
    public User User { get; set; }

    public List<DeliveryNote> DeliveryNotes { get; set; }

}
