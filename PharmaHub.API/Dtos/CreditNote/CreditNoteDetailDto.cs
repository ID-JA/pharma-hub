namespace PharmaHub.API;

public class CreditNoteDetailDto : BaseDto<CreditNoteDetailDto, CreditNote>
{
    public int Id { get; set; }
    public int CreditNoteNumber { get; set; }
    public Supplier Supplier { get; set; }
    public User User { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<CreditNoteMedicationDetailDto> CreditNoteMedications { get; set; } = [];
    public List<InventoryHistory> InventoryHistories { get; set; } = [];
}
