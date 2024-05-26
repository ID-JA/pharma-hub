using Microsoft.EntityFrameworkCore;
using PharmaHub.API.Common.Models;

namespace PharmaHub.API.Services.Interfaces;

public class MedicamentNameDto : BaseDto<MedicamentNameDto, Medicament>
{
    public int Id { get; set; }
    public string Name { get; set; }
}

public interface IMedicamentService : IService<Medicament>
{
    Task CreateMedicament(CreateMedicamentDto request);
    Task<List<MedicamentNameDto>> GetMedicamentsNames(string name, CancellationToken cancellationToken);
    Task<bool> UpdateMedicament(int id, CreateMedicamentDto request, CancellationToken cancellationToken = default);
    Task<PaginatedResponse<MedicamentDto>> SearchMedicamentsAsync(SearchQuery searchQuery, CancellationToken cancellationToken = default);
    Task<MedicamentDto?> GetMedicamentAsync(int id, CancellationToken cancellationToken = default);
    Task DeleteMedicament(int id, CancellationToken cancellationToken = default);
    Task<bool> IsSufficientQuantity(int medicamentId, int orderedQuantity, CancellationToken cancellationToken = default);
    Task<bool> CreateMedicamentHistoryAsync(CreateMedicamentHistoryDto request);
    Task<MedicamentInventoriesDto?> GetMedicamentInventories(int id, CancellationToken cancellationToken);

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
    public async Task CreateMedicament(CreateMedicamentDto request)
    {
        // create medicament basic info
        var medicament = new Medicament()
        {
            Name = request.Name,
            Barcode = request.Barcode,
            DCI = request.DCI,
            Form = request.Form,
            Type = request.Type,
            Family = request.Family,
            Section = request.Section,
            Dosage = request.Dosage,
            Laboratory = request.Laboratory,
            UsedBy = request.UsedBy,
            TVA = request.TVA,
            Marge = request.Marge,
            PBR = request.PBR,
            Status = "Out of stock",
            DiscountRate = request.Discount,
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
                ExpirationDate = request.ExpirationDate,
                Quantity = 0,
                PPH = request.PPH,
                PPV = request.PPV,
            };

            dbContext.Inventories.Add(inventory);
            await dbContext.SaveChangesAsync();
        }
    }

    public async Task<bool> CreateMedicamentHistoryAsync(CreateMedicamentHistoryDto request)
    {
        var stockHistory = request.ToEntity();
        dbContext.StockHistories.Add(stockHistory);
        var result = await dbContext.SaveChangesAsync();
        return result > 0;
    }

    public Task DeleteMedicament(int id, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public Task<MedicamentDto?> GetMedicamentAsync(int id, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public async Task<PaginatedResponse<MedicamentDto>> SearchMedicamentsAsync(SearchQuery searchQuery, CancellationToken cancellationToken = default)
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
            _ => throw new NotImplementedException(),
        };

        return await query.ProjectToType<MedicamentDto>()
            .PaginatedListAsync(searchQuery.PageNumber, searchQuery.PageSize);
    }

    public Task<bool> UpdateMedicament(int id, CreateMedicamentDto request, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public async Task<bool> IsSufficientQuantity(int medicamentId, int orderedQuantity, CancellationToken cancellationToken = default)
    {
        var medicamentQte = await dbContext.Medicaments.Where(m => m.Id == medicamentId).FirstOrDefaultAsync(cancellationToken);
        return true; //medicamentQte > orderedQuantity;
    }

    public async Task<List<MedicamentNameDto>> GetMedicamentsNames(string? name, CancellationToken cancellationToken)
    {
        var query = dbContext.Medicaments.AsNoTracking();

        if (string.IsNullOrWhiteSpace(name))
        {
            return await query.ProjectToType<MedicamentNameDto>().ToListAsync(cancellationToken);
        }

        return await query.Where(x => x.Name.Contains(name)).ProjectToType<MedicamentNameDto>().ToListAsync(cancellationToken);

    }

    public async Task<MedicamentInventoriesDto?> GetMedicamentInventories(int id, CancellationToken cancellationToken)
    {
        return await dbContext.Medicaments.AsNoTracking()
            .Where(i => i.Id == id)
            .Include(i => i.Inventories)
            .ProjectToType<MedicamentInventoriesDto>()
            .FirstOrDefaultAsync(cancellationToken);
    }
}


public class MedicamentInventoriesDto : BaseDto<MedicamentInventoriesDto, Medicament>
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string Barcode { get; set; } = null!;
    public string Section { get; set; } = null!;
    public string Form { get; set; } = null!;
    public int TotalQuantity { get; set; }
    public List<InventoryDto> Inventories { get; set; } = null!;

    public override void AddCustomMappings()
    {
        SetCustomMappingsInverse().Map(dest => dest.TotalQuantity, src => src.Inventories.Sum(i => i.Quantity));
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
}