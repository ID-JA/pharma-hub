using System.ComponentModel;
using Microsoft.EntityFrameworkCore;

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

    public string Barcode { get; set; }

    /// <summary>
    ///  Dénomination commune internationale
    /// </summary>
    public List<string> DCI { get; set; }
    public string Form { get; set; }
    public string Family { get; set; }

    /// <summary>
    /// Tax Nature / Tax Type
    /// </summary>
    public string Type { get; set; }
    public string? Laboratory { get; set; }

    [Precision(10, 2)]
    public decimal PFHTNotActive { get; set; }

    [Precision(10, 2)]
    public decimal PFHTActive { get; set; }

    [Precision(10, 2)]
    public decimal PAMP { get; set; }

    [Precision(10, 2)]
    public decimal PBR { get; set; }

    public double TVA { get; set; }

    public double Marge { get; set; }
    public double DiscountRate { get; set; }

    public double ReimbursementRate { get; set; }

    /// <summary>
    /// The status of the medicament (in stock or out of stock)
    /// </summary>
    public string Status { get; set; }

    public string OrderSystem { get; set; }

    public int MinQuantity { get; set; }

    public int MaxQuantity { get; set; }

    public List<string> UsedBy { get; set; }

    public bool WithPrescription { get; set; }

    public string? Section { get; set; }

    public List<Inventory> Inventories { get; set; }
    public List<StockHistory> StockHistories { get; set; }
    public List<SaleMedicament> SaleMedicaments { get; set; }
    public List<OrderMedicament> OrderMedicaments { get; set; } = [];
}
public enum UsedBy
{
    [Description("Infant")]
    Infant,

    [Description("Child")]
    Child,

    [Description("Adult")]
    Adult
}
