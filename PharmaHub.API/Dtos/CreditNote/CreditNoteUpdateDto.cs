namespace PharmaHub.API;

public class CreditNoteUpdateDto : BaseDto<CreditNoteUpdateDto, CreditNote>
{
  public int CreditNoteNumber { get; set; }
  public int? SupplierId { get; set; }
  public List<CreditNoteMedicationCreateDto> CreditNoteMedications { get; set; }

}