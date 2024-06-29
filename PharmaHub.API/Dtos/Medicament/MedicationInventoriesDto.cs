using PharmaHub.API.Dtos.Inventory;

namespace PharmaHub.API.Dtos.Medicament;


public class MedicationInventoriesDto : BaseDto<MedicationInventoriesDto, Models.Medication>
{
    public MedicationDetailedDto MedicationDetails { get; set; }
    public List<InventoryBasicDto> Inventories { get; set; }
}
