namespace PharmaHub.API.Dtos.Medicament;

public class MedicationBasicDto : BaseDto<MedicationBasicDto, Models.Medication>
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Section { get; set; }
    public string Laboratory { get; set; }
    public int MaxQuantity { get; set; }
    public int MinQuantity { get; set; }
    public double Tva { get; set; }
    public double Marge { get; set; }
    public double DiscountRate { get; set; }
    public string Dosage { get; set; }
    public string Barcode { get; set; }
    public string Family { get; set; }
    public string Status { get; set; }
    public List<string> Dci { get; set; }

    public override void AddCustomMappings()
    {
        SetCustomMappingsInverse()
            .Map(src => src.Dci, dest => dest.Dci);
    }
}
