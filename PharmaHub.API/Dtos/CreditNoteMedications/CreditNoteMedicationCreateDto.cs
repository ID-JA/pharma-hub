namespace PharmaHub.API;

public class CreditNoteMedicationCreateDto : BaseDto<CreditNoteMedicationCreateDto, CreditNoteMedications>
{
  public string Motif { get; set; }
  public int EmittedQuantity { get; set; }
  public int AcceptedQuantity { get; set; }

  public int RefusedQuantity { get; set; }
  public int? InventoryId { get; set; }
}