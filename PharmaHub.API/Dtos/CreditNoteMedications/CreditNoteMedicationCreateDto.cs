namespace PharmaHub.API;

public class CreditNoteMedicationCreateDto : BaseDto<CreditNoteMedicationCreateDto, CreditNoteMedication>
{
    public string? Motif { get; set; }
    public int IssuedQuantity { get; set; }
    public int AcceptedQuantity { get; set; }
    public int RefusedQuantity { get; set; }
    public int InventoryId { get; set; }
}
