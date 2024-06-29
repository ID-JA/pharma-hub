namespace PharmaHub.API;

public class CreditNoteCreateDto : BaseDto<CreditNoteCreateDto, CreditNote>
{
    public int CreditNoteNumber { get; set; }
    public int SupplierId { get; set; }
    public List<CreditNoteMedicationCreateDto> CreditNoteMedications { get; set; }
}
