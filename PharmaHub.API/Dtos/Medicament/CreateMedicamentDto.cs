namespace PharmaHub.API.Dtos;

public class CreateMedicamentDto : BaseDto<CreateMedicamentDto, Medicament>
{
    public string Name { get; set; }
    public string DCI { get; set; }
    public string Form { get; set; }
    public decimal PPV { get; set; }
    public decimal PPH { get; set; }
    public double TVA { get; set; }
    public decimal PAMP { get; set; }
    public DateTime ExperationDate { get; set; }
    public int Quantity { get; set; }
    public float Discount { get; set; }
    public float ReimbursementRate { get; set; }
    public string OrderSystem { get; set; }
    public decimal PBR { get; set; }
    public string Type { get; set; }
    public float Marge { get; set; }
    public string Barcode { get; set; }
    public string Section { get; set; }
    public string Dosage { get; set; }
    public string Family { get; set; }
    public string Status { get; set; }
    public string Laboratory { get; set; }
    public UsedBy UsedBy { get; set; }
    public bool WithPrescription { get; set; }
}
