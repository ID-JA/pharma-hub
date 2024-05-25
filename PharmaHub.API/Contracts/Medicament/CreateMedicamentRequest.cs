using System.Text.Json.Serialization;

namespace PharmaHub.API;

public class CreateMedicamentRequest
{
    public string Name { get; set; }
    public string DCI { get; set; }
    public string Form { get; set; }
    public decimal PPV { get; set; }
    public decimal PPH { get; set; }
    public double TVA { get; set; }
    public double Discount { get; set; }
    public decimal PBR { get; set; }
    public string Type { get; set; }
    public double Marge { get; set; }
    public string Barcode { get; set; }
    public string Family { get; set; }
    [JsonConverter(typeof(JsonStringEnumConverter<UsedBy>))]
    public UsedBy UsedBy { get; set; }
    public bool WithPrescription { get; set; }
}
