using Microsoft.EntityFrameworkCore;
using PharmaHub.API.Common.Models;
using PharmaHub.API.Dtos.Inventory;
using PharmaHub.API.Dtos.Medicament;
using PharmaHub.API.Dtos.StockHistory;

namespace PharmaHub.API.Services.Interfaces;

public interface IMedicamentService : IService<Medicament>
{
    Task CreateMedicament(MedicationCreateDto request);
    Task<List<MedicationBasicDto>> GetMedicationsBasicInfo(string name, CancellationToken cancellationToken);
    Task<bool> UpdateMedicament(int id, MedicationUpdateDto request, CancellationToken cancellationToken = default);
    Task<PaginatedResponse<MedicamentDto>> SearchMedicationsAsync(SearchQuery searchQuery, CancellationToken cancellationToken = default);
    Task DeleteMedicament(int id, CancellationToken cancellationToken = default);
    Task<bool> IsSufficientQuantity(int medicamentId, int orderedQuantity, CancellationToken cancellationToken = default);
    Task<bool> CreateMedicamentHistoryAsync(StockHistoryCreateDto request);
    Task<MedicationInventoriesDto?> GetMedicamentInventories(int id, CancellationToken cancellationToken);
    Task<bool> CreateMedicamentInventory(int id, InventoryCreateDto request, CancellationToken cancellationToken);
    Task<bool> UpdateMedicamentInventory(int id, InventoryUpdateDto request, CancellationToken cancellationToken);
    Task<bool> DeleteMedicamentInventory(int id, CancellationToken cancellationToken);

}

public class SearchQuery
{
    public string? Query { get; set; }
    public string? Field { get; set; }
    public int PageSize { get; set; } = 10;
    public int PageNumber { get; set; } = 1;
}

public class MedicamentService(ApplicationDbContext dbContext) : Service<Medicament>(dbContext), IMedicamentService
{
    public async Task CreateMedicament(MedicationCreateDto request)
    {
        // create medicament basic info
        var medicament = new Medicament()
        {
            Name = request.Name,
            Barcode = request.Barcode,
            DCI = request.Dci,
            Form = request.Form,
            Type = request.Type,
            Family = request.Family,
            Section = request.Section,
            Dosage = request.Dosage,
            Laboratory = request.Laboratory,
            UsedBy = request.UsedBy,
            TVA = request.Tva,
            Marge = request.Marge,
            PBR = request.Pbr,
            Status = "Out of stock",
            DiscountRate = request.DiscountRate,
            OrderSystem = request.OrderSystem,
            WithPrescription = request.WithPrescription,
        };

        dbContext.Medicaments.Add(medicament);
        var result = await dbContext.SaveChangesAsync();

        if (result > 0)
        {
            var inventory = new Inventory()
            {
                MedicamentId = medicament.Id,
                ExpirationDate = request.Inventory.ExpirationDate,
                Quantity = request.Inventory.Quantity,
                PPH = request.Inventory.Pph,
                PPV = request.Inventory.Ppv,
            };

            dbContext.Inventories.Add(inventory);
            await dbContext.SaveChangesAsync();
        }
    }

    public async Task<bool> CreateMedicamentHistoryAsync(StockHistoryCreateDto request)
    {
        dbContext.StockHistories.Add(request.ToEntity());
        var result = await dbContext.SaveChangesAsync();
        return result > 0;
    }

    public Task DeleteMedicament(int id, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }


    public async Task<PaginatedResponse<MedicamentDto>> SearchMedicationsAsync(SearchQuery searchQuery, CancellationToken cancellationToken = default)
    {
        var query = dbContext.Medicaments.AsNoTracking();

        if (string.IsNullOrWhiteSpace(searchQuery.Query) || string.IsNullOrWhiteSpace(searchQuery.Field))
        {
            return await query
            .Include(m => m.Inventories)
            .ProjectToType<MedicamentDto>()
            .PaginatedListAsync(searchQuery.PageNumber, searchQuery.PageSize);
        }

        query = searchQuery.Field switch
        {
            "barcode" => query.Where(m => m.Barcode == searchQuery.Query).Include(m => m.Inventories),
            "name" => query.Where(m => m.Name.Contains(searchQuery.Query)).Include(m => m.Inventories),
            "ppv" => query.Include(m => m.Inventories).Where(m => m.Inventories.Any(i => i.PPV == decimal.Parse(searchQuery.Query))),
            "type" => query.Where(m => m.Type.Contains(searchQuery.Query)).Include(m => m.Inventories),
            _ => throw new NotImplementedException(),
        };

        return await query.ProjectToType<MedicamentDto>()
            .PaginatedListAsync(searchQuery.PageNumber, searchQuery.PageSize);
    }

    public Task<bool> UpdateMedicament(int id, MedicationUpdateDto request, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public async Task<bool> IsSufficientQuantity(int medicamentId, int orderedQuantity, CancellationToken cancellationToken = default)
    {
        var medicamentQte = await dbContext.Medicaments.Where(m => m.Id == medicamentId).FirstOrDefaultAsync(cancellationToken);
        return true; //medicamentQte > orderedQuantity;
    }

    public async Task<List<MedicationBasicDto>> GetMedicationsBasicInfo(string? name, CancellationToken cancellationToken)
    {
        var query = dbContext.Medicaments.AsNoTracking();

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
        return await dbContext.Medicaments.AsNoTracking()
            .Where(i => i.Id == id)
            .Include(i => i.Inventories)
            .ProjectToType<MedicationInventoriesDto>()
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<bool> CreateMedicamentInventory(int id, InventoryCreateDto request, CancellationToken cancellationToken)
    {
        Inventory inventory = new()
        {
            MedicamentId = id,
            ExpirationDate = request.ExpirationDate,
            Quantity = request.Quantity,
            PPH = request.Pph,
            PPV = request.Ppv
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
        inventory.Quantity = request.Quantity;
        inventory.PPH = request.Pph;
        inventory.PPV = request.Ppv;

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
}