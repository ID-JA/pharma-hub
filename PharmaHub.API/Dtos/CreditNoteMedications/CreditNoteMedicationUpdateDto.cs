namespace PharmaHub.API;

public class CreditNoteMedicationUpdateDto : BaseDto<CreditNoteMedicationUpdateDto, CreditNoteMedications>
{
  public string Motif { get; set; }
  public int EmittedQuantity { get; set; }
  public int AcceptedQuantity { get; set; }

  public int RefusedQuantity { get; set; }
}