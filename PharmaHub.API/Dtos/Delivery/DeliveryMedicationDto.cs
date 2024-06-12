using System.Text.Json;
using System.Text.Json.Serialization;
using PharmaHub.API.Dtos.Inventory;
using PharmaHub.API.Dtos.Medicament;

namespace PharmaHub.API.Dtos.Delivery;

public class DeliveryMedicationDto : BaseDto<DeliveryMedicationDto, Models.DeliveryMedication>
{
    public int Quantity { get; set; }
    public decimal Ppv { get; set; }
    public decimal Pph { get; set; }
    public InventoryDetailedDto Inventory { get; set; }
}


public class DeliveryMedicationBasicDto : BaseDto<DeliveryMedicationBasicDto, Models.DeliveryMedication>
{
    public int Quantity { get; set; }
    public decimal Ppv { get; set; }
    public decimal Pph { get; set; }
}


