using PharmaHub.API.Dtos.Inventory;
using PharmaHub.API.Dtos.Medicament;

namespace PharmaHub.API.Dtos.Sale;

public class SaleMedicationDto : BaseDto<SaleMedicationDto, SaleMedication>
{
    public int Id { get; set; }
    public int Quantity { get; set; }
    public string SaleType { get; set; }
    public decimal NetPrice { get; set; }
    public decimal BrutPrice { get; set; }
    public double DiscountRate { get; set; }
    public string Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public int SaleId { get; set; }
    public InventoryDetailedDto Inventory { get; set; } = null!;
}