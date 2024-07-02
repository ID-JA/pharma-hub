using Microsoft.EntityFrameworkCore;
using PharmaHub.API.Common.Models;
using PharmaHub.API.Dtos.Inventory;
using PharmaHub.API.Dtos.Medicament;
using PharmaHub.API.Dtos.StockHistory;

namespace PharmaHub.API.Services.Interfaces;

public interface IMedicationService : IService<Medication>
{
    Task CreateMedicament(MedicationCreateDto request);
    Task<List<MedicationBasicDto>> GetMedicationsBasicInfo(string name, CancellationToken cancellationToken);
    Task<bool> UpdateMedicament(int id, MedicationUpdateDto request, CancellationToken cancellationToken = default);
    Task<PaginatedResponse<MedicationDetailedDto>> SearchMedicationsAsync(SearchQuery searchQuery, CancellationToken cancellationToken = default);
    Task DeleteMedicament(int id, CancellationToken cancellationToken = default);
    Task<bool> IsSufficientQuantity(int InventoryId, int orderedQuantity, CancellationToken cancellationToken = default);
    Task<bool> CreateMedicamentHistoryAsync(StockHistoryCreateDto request);
    Task<MedicationInventoriesDto?> GetMedicamentInventories(int id, CancellationToken cancellationToken);
    Task<bool> CreateMedicamentInventory(int id, InventoryCreateDto request, CancellationToken cancellationToken);
    Task<bool> UpdateMedicamentInventory(int id, InventoryUpdateDto request, CancellationToken cancellationToken);
    Task<bool> DeleteMedicamentInventory(int id, CancellationToken cancellationToken);
    Task<MedicationDetailedDto?> GetMedicationDetails(int id, CancellationToken cancellationToken = default);
    Task SetupMedicationPartialSale(int id, PartialSaleMedicationConfig request, CancellationToken cancellationToken = default);
    Task<List<TopSoldProduct>> GetTopSoldProductsAsync(DateTime? startDate = null, DateTime? endDate = null);
    Task<List<InventoryDetailedDto>> GetMedicationNotSold(DateTime startDate, DateTime endDate);
}


public class PartialSaleMedicationConfig
{
    public decimal UnitPrice { get; set; }
    public int SaleUnits { get; set; }
    public bool IsPartialSaleAllowed { get; set; }
}

public class SearchQuery
{
    public string? Query { get; set; }
    public string? Field { get; set; }
    public int PageSize { get; set; } = 10;
    public int PageNumber { get; set; } = 1;
}

public class MedicationService(ApplicationDbContext dbContext) : Service<Medication>(dbContext), IMedicationService
{
    public async Task CreateMedicament(MedicationCreateDto request)
    {
        // create medicament basic info
        var medicament = new Medication()
        {
            Name = request.Name,
            Barcode = request.Barcode,
            Dci = request.Dci,
            Form = request.Form,
            Type = request.Type,
            Family = request.Family,
            Section = request.Section,
            Dosage = request.Dosage,
            Laboratory = request.Laboratory,
            UsedBy = request.UsedBy,
            Tva = request.Tva,
            Marge = request.Marge,
            Pbr = request.Pbr,
            MinQuantity = request.MinQuantity,
            MaxQuantity = request.MaxQuantity,
            Status = "Out of stock",
            DiscountRate = 0, // request.DiscountRate, this should be deleted because it belongs to inventory
            OrderSystem = request.OrderSystem,
            WithPrescription = request.WithPrescription == "yes" ? true : false,
        };

        dbContext.Medications.Add(medicament);
        var result = await dbContext.SaveChangesAsync();

        if (result > 0)
        {
            var inventory = new Inventory()
            {
                MedicationId = medicament.Id,
                ExpirationDate = request.Inventory.ExpirationDate,
                Quantity = request.Inventory.Quantity,
                BoxQuantity = request.Inventory.Quantity,
                Pph = request.Inventory.Pph,
                Ppv = request.Inventory.Ppv,
            };

            dbContext.Inventories.Add(inventory);
            await dbContext.SaveChangesAsync();
        }
    }

    public async Task<bool> CreateMedicamentHistoryAsync(StockHistoryCreateDto request)
    {
        dbContext.InventoryHistories.Add(request.ToEntity());
        var result = await dbContext.SaveChangesAsync();
        return result > 0;
    }

    public Task DeleteMedicament(int id, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }


    public async Task<PaginatedResponse<MedicationDetailedDto>> SearchMedicationsAsync(SearchQuery searchQuery, CancellationToken cancellationToken = default)
    {
        var query = dbContext.Medications.AsNoTracking();

        if (string.IsNullOrWhiteSpace(searchQuery.Query) || string.IsNullOrWhiteSpace(searchQuery.Field))
        {
            return await query
                .Include(m => m.Inventories)
                .ProjectToType<MedicationDetailedDto>()
                .PaginatedListAsync(searchQuery.PageNumber, searchQuery.PageSize);
        }

        if (searchQuery.Field == "name_position")
        {
            var medications = await query.Include(m => m.Inventories).ToListAsync(cancellationToken);
            var filteredMedications = medications.Where(m => NameMatchesPosition(m.Name, searchQuery.Query));
            var pagedMedications = filteredMedications
                .Skip((searchQuery.PageNumber - 1) * searchQuery.PageSize)
                .Take(searchQuery.PageSize)
                .ToList();

            var result = new PaginatedResponse<MedicationDetailedDto>(filteredMedications.Select(m => m.Adapt<MedicationDetailedDto>()).ToList(), filteredMedications.Count(), 1, 1000);
            return result;
        }

        query = searchQuery.Field switch
        {
            "barcode" => query.Where(m => m.Barcode == searchQuery.Query).Include(m => m.Inventories),
            "name" => query.Where(m => m.Name.Contains(searchQuery.Query)).Include(m => m.Inventories),
            "ppv" => query.Include(m => m.Inventories).Where(m => m.Inventories.Any(i => i.Ppv == decimal.Parse(searchQuery.Query))),
            "type" => query.Where(m => m.Type.Contains(searchQuery.Query)).Include(m => m.Inventories),
            _ => throw new NotImplementedException(),
        };

        return await query.ProjectToType<MedicationDetailedDto>()
            .PaginatedListAsync(searchQuery.PageNumber, searchQuery.PageSize);
    }

    private bool NameMatchesPosition(string name, string pattern)
    {
        if (string.IsNullOrEmpty(name) || string.IsNullOrEmpty(pattern))
        {
            return false;
        }

        var nameChars = name.ToCharArray();
        var patternChars = pattern.ToCharArray();

        int patternIndex = 0;

        for (int i = 0; i < nameChars.Length; i++)
        {
            if (patternIndex >= patternChars.Length)
            {
                return true;
            }

            if (patternChars[patternIndex] == ',')
            {
                patternIndex++;
            }

            if (patternIndex < patternChars.Length &&
                patternChars[patternIndex] != ',' &&
                char.ToLower(patternChars[patternIndex]) == char.ToLower(nameChars[i]))
            {
                patternIndex++;
            }
        }

        return patternIndex == patternChars.Length;
    }




    public Task<bool> UpdateMedicament(int id, MedicationUpdateDto request, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public async Task<bool> IsSufficientQuantity(int inventoryId, int orderedQuantity, CancellationToken cancellationToken = default)
    {
        var medicamentQte = await dbContext.Inventories
            .Where(m => m.Id == inventoryId)
            .Select(m => m.Quantity)
            .FirstOrDefaultAsync(cancellationToken);
        return medicamentQte >= orderedQuantity;
    }


    public async Task<List<MedicationBasicDto>> GetMedicationsBasicInfo(string? name, CancellationToken cancellationToken)
    {
        var query = dbContext.Medications.AsNoTracking();

        if (string.IsNullOrWhiteSpace(name))
        {
            return await query.ProjectToType<MedicationBasicDto>()
                .ToListAsync(cancellationToken);
        }

        return await query.Where(x => x.Name.Contains(name))
            .ProjectToType<MedicationBasicDto>()
            .ToListAsync(cancellationToken);

    }

    public async Task<MedicationInventoriesDto?> GetMedicamentInventories(int id, CancellationToken cancellationToken)
    {
        return await dbContext.Medications.AsNoTracking()
            .Where(i => i.Id == id)
            .Include(i => i.Inventories)
            .ProjectToType<MedicationInventoriesDto>()
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<bool> CreateMedicamentInventory(int id, InventoryCreateDto request, CancellationToken cancellationToken)
    {
        Inventory inventory = new()
        {
            MedicationId = id,
            ExpirationDate = request.ExpirationDate,
            BoxQuantity = request.Quantity,
            Pph = request.Pph,
            Ppv = request.Ppv
        };
        dbContext.Inventories.Add(inventory);
        var result = await dbContext.SaveChangesAsync(cancellationToken);
        return result > 0;
    }

    public async Task<bool> UpdateMedicamentInventory(int id, InventoryUpdateDto request, CancellationToken cancellationToken)
    {
        var inventory = await dbContext.Inventories.FindAsync([id], cancellationToken);

        if (inventory is null) return false;

        inventory.ExpirationDate = request.ExpirationDate;
        inventory.BoxQuantity = request.Quantity;
        inventory.Pph = request.Pph;
        inventory.Ppv = request.Ppv;

        dbContext.Inventories.Update(inventory);
        var result = await dbContext.SaveChangesAsync(cancellationToken);

        return result > 0;
    }

    public async Task<bool> DeleteMedicamentInventory(int id, CancellationToken cancellationToken)
    {
        var inventory = await dbContext.Inventories.FindAsync([id]);
        dbContext.Inventories.Remove(inventory!);
        var result = await dbContext.SaveChangesAsync(cancellationToken);
        return result > 0 ? true : false;
    }

    public async Task<MedicationDetailedDto?> GetMedicationDetails(int id, CancellationToken cancellationToken = default)
    {
        var result = await dbContext.Medications
            .AsNoTracking()
            .Where(m => m.Id == id)
            .Include(m => m.Inventories)
            .ProjectToType<MedicationDetailedDto>()
            .FirstOrDefaultAsync();

        if (result is null)
            return null;

        return result;
    }

    public async Task SetupMedicationPartialSale(int id, PartialSaleMedicationConfig request, CancellationToken cancellationToken = default)
    {
        var medication = await dbContext.Medications.FindAsync([id]);

        if (medication is not null)
        {
            medication.SaleUnits = request.SaleUnits;
            medication.UnitPrice = request.UnitPrice;
            medication.IsPartialSaleAllowed = request.IsPartialSaleAllowed;

            dbContext.Medications.Update(medication);
            await dbContext.SaveChangesAsync(cancellationToken);
        }
    }

    public async Task<List<TopSoldProduct>> GetTopSoldProductsAsync(DateTime? startDate = null, DateTime? endDate = null)
    {
        startDate ??= DateTime.Now.AddYears(-1);
        endDate ??= DateTime.Now;

        var topSoldProducts = await dbContext.SaleMedications
            .Where(sm => sm.Sale.CreatedAt >= startDate && sm.Sale.CreatedAt <= endDate)
            .GroupBy(sm => sm.Inventory.Medication)
            .Select(g => new TopSoldProduct
            {
                MedicationName = g.Key.Name,
                TotalQuantitySold = g.Sum(sm => sm.Quantity)
            })
            .OrderByDescending(p => p.TotalQuantitySold)
            .Take(10)
            .ToListAsync();

        return topSoldProducts;
    }

    public async Task<List<InventoryDetailedDto>> GetMedicationNotSold(DateTime startDate, DateTime endDate)
    {
        var soldInventories = await dbContext.SaleMedications
            .Where(sm => sm.CreatedAt >= startDate && sm.CreatedAt <= endDate)
            .Select(sm => sm.InventoryId)
            .Distinct()
            .ToListAsync();

        var medicationNotSold = await dbContext.Inventories
            .Where(i => !soldInventories.Contains(i.Id))
            .Include(i => i.Medication)
            .ProjectToType<InventoryDetailedDto>()
            .ToListAsync();

        return medicationNotSold;
    }
}

public class TopSoldProduct
{
    public string MedicationName { get; set; }
    public int TotalQuantitySold { get; set; }
}
