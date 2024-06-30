using PharmaHub.API.Dtos.Inventory;

namespace PharmaHub.API.Dtos.Medicament;


public class MedicationInventoriesDto : BaseDto<MedicationInventoriesDto, Models.Medication>
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
    public string? Section { get; set; }
    public decimal PfhtNotActive { get; set; }
    public decimal PfhtActive { get; set; }
    public decimal Pamp { get; set; }
    public decimal Pbr { get; set; }
    public double Tva { get; set; }
    public double Marge { get; set; }
    // public MedicationDetailedDto MedicationDetails { get; set; }
    public List<InventoryBasicDto> Inventories { get; set; }

}
