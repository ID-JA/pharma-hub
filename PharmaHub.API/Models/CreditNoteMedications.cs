namespace PharmaHub.API.Models;
public class CreditNoteMedications
{
  public string Motif { get; set; }
  public int EmittedQuantity { get; set; }
  public int AcceptedQuantity { get; set; }

  public int RefusedQuantity { get; set; }
  public int? CreditNoteId { get; set; }
  public CreditNote CreditNote { get; set; }
  public int? InventoryId { get; set; }
  public Inventory Inventory { get; set; }
}