namespace PharmaHub.API.Models;
public class CreditNote : BaseModel
{
    public int CreditNoteNumber { get; set; }
    public int? SupplierId { get; set; }
    public Supplier Supplier { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }
    public List<CreditNoteMedication> CreditNoteMedications { get; set; } = [];
    public List<InventoryHistory> InventoryHistories { get; set; } = [];
}
