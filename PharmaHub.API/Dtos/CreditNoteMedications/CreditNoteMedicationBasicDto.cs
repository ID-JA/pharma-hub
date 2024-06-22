namespace PharmaHub.API;

public class CreditNoteMedicationBasicDto : BaseDto<CreditNoteMedicationBasicDto, CreditNoteMedications>
{
  public string Motif { get; set; }
  public int EmittedQuantity { get; set; }
  public int AcceptedQuantity { get; set; }

  public int RefusedQuantity { get; set; }
}



