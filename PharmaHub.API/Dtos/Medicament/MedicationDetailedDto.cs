using PharmaHub.API.Dtos.Inventory;
using PharmaHub.API.Dtos.StockHistory;

namespace PharmaHub.API.Dtos.Medicament;

public class MedicationDetailedDto : BaseDto<MedicationBasicDto, Models.Medication>
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Dosage { get; set; }
    public string Barcode { get; set; }
    public List<string> Dci { get; set; }
    public string Form { get; set; }
    public string Family { get; set; }
    public string Type { get; set; }
    public string? Laboratory { get; set; }
    public decimal PfhtNotActive { get; set; }
    public decimal PfhtActive { get; set; }
    public decimal Pamp { get; set; }
    public decimal Pbr { get; set; }
    public double Tva { get; set; }
    public double Marge { get; set; }
    public double DiscountRate { get; set; }
    public double ReimbursementRate { get; set; }
    public string Status { get; set; }
    public string OrderSystem { get; set; }
    public int MinQuantity { get; set; }
    public int MaxQuantity { get; set; }
    public List<string> UsedBy { get; set; }
    public bool WithPrescription { get; set; }
    public string? Section { get; set; }
    public List<InventoryBasicDto> Inventories { get; set; }
    public List<StockHistoryBasicDto> InventoryHistories { get; set; }
}
