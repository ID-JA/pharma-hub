using PharmaHub.API.Dtos.Inventory;

namespace PharmaHub.API;

public class CreditNoteMedicationDetailDto : BaseDto<CreditNoteMedicationDetailDto, CreditNoteMedication>
{
    public string Motif { get; set; }
    public int IssuedQuantity { get; set; }
    public int AcceptedQuantity { get; set; }
    public int RefusedQuantity { get; set; }
    public InventoryDetailedDto Inventory { get; set; }
}