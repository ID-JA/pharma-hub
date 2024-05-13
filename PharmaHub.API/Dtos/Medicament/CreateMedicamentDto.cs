namespace PharmaHub.API.Dtos;

public class CreateMedicamentDto : BaseDto<CreateMedicamentHistoryDto, StockHistory>
{
    public string Name { get; set; }
    public string DCI { get; set; }
    public string Form { get; set; }
    public double PPV { get; set; }
    public double PPH { get; set; }
    public double TVA { get; set; }
    public float Discount { get; set; }
    public double PBR { get; set; }
    public string Type { get; set; }
    public int Marge { get; set; }
    public string Codebar { get; set; }
    public string Family { get; set; }
    public UsedBy UsedBy { get; set; }
    public bool WithPrescription { get; set; }
}
