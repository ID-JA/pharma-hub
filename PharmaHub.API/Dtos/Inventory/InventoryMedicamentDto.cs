using PharmaHub.API.Dtos.Medicament;

namespace PharmaHub.API.Dtos.Inventory;

public class InventoryMedicamentDto : BaseDto<InventoryMedicamentDto, Models.Inventory>
{
    public InventoryBasicDto Inventory { get; set; }

    public MedicationBasicDto Medication { get; set; }          
}