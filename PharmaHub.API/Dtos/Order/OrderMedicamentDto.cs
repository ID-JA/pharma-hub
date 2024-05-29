using PharmaHub.API.Dtos.Inventory;
using PharmaHub.API.Dtos.Medicament;

namespace PharmaHub.API.Dtos.Order;

public class OrderMedicamentDto : BaseDto<OrderMedicamentDto, Models.OrderMedicament>
{
    public int Id { get; set; }
    public int Quantity { get; set; }
    public decimal Ppv { get; set; }
    public decimal Pph { get; set; }
    public int MedicamentId { get; set; }
    public MedicationBasicDto Medication { get; set; }
    public int InventoryId { get; set; }
    public InventoryBasicDto Inventory { get; set; }
}
