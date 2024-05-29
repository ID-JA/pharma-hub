using PharmaHub.API.Dtos.Inventory;

namespace PharmaHub.API.Dtos.Medicament;


public class MedicationInventoriesDto : BaseDto<MedicationInventoriesDto, Models.Medicament>
{
    public MedicationDetailedDto MedicationDetails { get; set; }
    public List<InventoryBasicDto> Inventories { get; set; }
}