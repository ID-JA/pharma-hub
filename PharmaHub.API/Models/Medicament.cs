namespace PharmaHub.API.Models;

/// <summary>
/// this class is used to store the details of the medicament.
/// </summary>
/// <remarks>
/// Also known as the Medicament's stock.
/// </remarks>
public class Medicament : BaseModel
{
    /// <summary>
    /// The name of the medicament
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// the size or frequency of a dose of a medicine or drug.
    /// </summary>
    public string Dosage { get; set; }
    public string Codebar { get; set; }

    /// <summary>
    ///  Dénomination commune internationale
    /// </summary>
    public string DCI { get; set; }
    public string Form { get; set; }
    public string Family { get; set; }
    public string Type { get; set; }
    public string? laboratory { get; set; }
    public double PFHTNotActive { get; set; }
    public double PFHTActive { get; set; }
    /// <summary>
    /// It is the Weighted Average Purchase Price. It is used to calculate the value of an item in stock, based on its current quantity in stock, as well as the history of its entries into stock.
    /// </summary>
    /// <see href="https://melkal.supporthero.io/article/show/20813-qu-est-ce-que-le-pamp-comment-est-il-calcule-quelle-influence-sur-mon-stock-comment-le-modifier">more details</see> 
    public double PAMP { get; set; }
    public double PPV { get; set; } //maybe we will need to move prices propreties to new table (StockMedicament)
    public double PPH { get; set; }
    public double PBR { get; set; }
    public float TVA { get; set; }
    public double Marge { get; set; }
    public float DiscountRate { get; set; }
    public float ReimbursementRate { get; set; }
    /// <summary>
    /// The status of the medicament (in stock or out of stock)
    /// </summary>
    public string Status { get; set; }
    public string OrderSystem { get; set; }
    public int Quantity { get; set; }
    public int MinQuantity { get; set; }
    public int MaxQuantity { get; set; }

    public UsedBy UsedBy { get; set; }
    public bool WithPrescription { get; set; }
    public string? Section { get; set; }
    public List<StockHistory> StockHistories { get; set; }
    public List<SaleMedicament> SaleMedicaments { get; set; }
    public List<OrderMedicament> OrderMedicaments { get; set; } = [];
}
public enum UsedBy
{
    Infant,
    Child,
    Adult
}
