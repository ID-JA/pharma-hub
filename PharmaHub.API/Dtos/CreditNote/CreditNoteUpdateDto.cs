namespace PharmaHub.API;

public class CreditNoteUpdateDto : BaseDto<CreditNoteUpdateDto, CreditNote>
{
  public int Id { get; set; }
  public int CreditNoteNumber { get; set; }
  public int? SupplierId { get; set; }
  public List<CreditNoteMedicationUpdateDto> CreditNoteMedications { get; set; }
}