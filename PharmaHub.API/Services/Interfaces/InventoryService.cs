using Microsoft.EntityFrameworkCore;
using PharmaHub.API.Common.Models;

namespace PharmaHub.API.Services;

public interface IInventoryService
{
    public Task<PaginatedResponse<InventoryDto>> SearchInventoryAsync(string medicamentName, CancellationToken cancellationToken = default);
}

public class InventoryService(ApplicationDbContext dbContext) : IInventoryService
{
    public async Task<PaginatedResponse<InventoryDto>> SearchInventoryAsync(string medicamentName, CancellationToken cancellationToken)
    {
        var query = dbContext.Inventories.AsNoTracking();

        if (string.IsNullOrWhiteSpace(medicamentName))
        {
            return await query.Include(i => i.Medicament).ProjectToType<InventoryDto>().PaginatedListAsync(1, 100);
        }

        return await query.Include(i => i.Medicament).Where(i => i.Medicament.Name.Contains(medicamentName)).ProjectToType<InventoryDto>().PaginatedListAsync(1, 100);
    }
}

public class InventoryDto : BaseDto<InventoryDto, Inventory>
{
    public int Id { get; set; }
    public int Quantity { get; set; }
    public DateTime ExpirationDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public decimal PPV { get; set; }
    public decimal PPH { get; set; }
    public MedicamentDto Medicament { get; set; }
}

public class MedicamentDto : BaseDto<MedicamentDto, Medicament>
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Dosage { get; set; }
    public string Barcode { get; set; }
    public List<string> Dcis { get; set; }
    public string Form { get; set; }
    public string Family { get; set; }
    public string Type { get; set; }
    public string laboratory { get; set; }
    // public decimal PFHTNotActive { get; set; }
    // public decimal PFHTActive { get; set; }
    // public decimal PAMP { get; set; }
    // public decimal PBR { get; set; }
    // public double TVA { get; set; }
    // public decimal Marge { get; set; }
    // public double DiscountRate { get; set; }
    // public double ReimbursementRate { get; set; }
    // public string Status { get; set; }
    // public string OrderSystem { get; set; }
    // public int Quantity { get; set; }
    // public int MinQuantity { get; set; }
    // public int MaxQuantity { get; set; }
    // public List<string> UsedBy { get; set; }
    // public bool WithPrescription { get; set; }
    // public int TotalQuantity { get; set; }
    // public string Section { get; set; }

    public void AddCustomMappings()
    {
        SetCustomMappingsInverse()
            .Map(src => src.Dcis, dest => dest.DCI);
    }
}




// public class InventoryDto 
// {
//     public Medication Medication { get; set; }

//     public int Quantity { get; set; }

//     public DateTime ExpirationDate { get; set; }

//     public decimal PPV { get; set; } //maybe we will need to move prices propreties to new table (StockMedicament)

//     public decimal PPH { get; set; }

// }