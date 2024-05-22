namespace PharmaHub.API.Dtos;

public class MedicamentDto : BaseDto<MedicamentDto, Medicament>
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Dosage { get; set; }
    public string Codebar { get; set; }
    public string DCI { get; set; }
    public string Form { get; set; }
    public string Family { get; set; }
    public string Type { get; set; }
    public string laboratory { get; set; }
    public double PFHTNotActive { get; set; }
    public double PFHTActive { get; set; }
    public double PAMP { get; set; }
    public double PPV { get; set; }
    public double PPH { get; set; }
    public double PBR { get; set; }
    public float TVA { get; set; }
    public double Marge { get; set; }
    public float DiscountRate { get; set; }
    public float ReimbursementRate { get; set; }
    public string Status { get; set; }
    public string OrderSystem { get; set; }
    public int Quantity { get; set; }
    public int MinQuantity { get; set; }
    public int MaxQuantity { get; set; }
    public UsedBy UsedBy { get; set; }
    public bool WithPrescription { get; set; }
    public string Section { get; set; }
}
