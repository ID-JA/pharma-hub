using PharmaHub.API.Dtos.Medicament;

namespace PharmaHub.API.Dtos.Inventory;

public class InventoryMedicationDto : BaseDto<InventoryMedicationDto, Models.Inventory>
{
    public InventoryBasicDto Inventory { get; set; }

    public MedicationBasicDto Medication { get; set; }

    public override void AddCustomMappings()
    {
        SetCustomMappingsInverse()
            .Map(src => src.Inventory.Id, dest => dest.Id)
            .Map(src => src.Inventory.Ppv, dest => dest.Ppv)
            .Map(src => src.Inventory.ExpirationDate, dest => dest.ExpirationDate)
            .Map(src => src.Inventory.Pph, dest => dest.Pph)
            .Map(src => src.Inventory.Quantity, dest => dest.Quantity);
    }
}