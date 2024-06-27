using Microsoft.EntityFrameworkCore;

namespace PharmaHub.API.Models;

/// <summary>
/// this class is used to store the details of the medicament.
/// </summary>
/// <remarks>
/// Also known as the Medication's stock.
/// </remarks>
public class Medication : BaseModel
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
    public List<string> Dci { get; set; }
    public string Form { get; set; }
    public string Family { get; set; }

    /// <summary>
    /// Tax Nature / Tax Type
    /// </summary>
    public string Type { get; set; }
    public string? Laboratory { get; set; }

    [Precision(10, 2)]
    public decimal PfhtNotActive { get; set; }

    [Precision(10, 2)]
    public decimal PfhtActive { get; set; }

    [Precision(10, 2)]
    public decimal Pamp { get; set; }

    [Precision(10, 2)]
    public decimal Pbr { get; set; }

    public double Tva { get; set; }

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

    [Precision(10, 2)]
    public decimal UnitPrice { get; set; }
    public bool IsPartialSaleAllowed { get; set; }
    public int SaleUnits { get; set; }

    public List<Inventory> Inventories { get; set; } = [];
}
