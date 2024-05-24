using Mapster;
using Microsoft.EntityFrameworkCore;
using PharmaHub.API.Common.Models;

namespace PharmaHub.API.Services.Interfaces;

public interface IMedicamentService : IService<Medicament>
{
    Task CreateMedicament(CreateMedicamentDto request);
    Task<bool> UpdateMedicament(int id, CreateMedicamentDto request, CancellationToken cancellationToken = default);
    Task<PaginatedResponse<MedicamentDto>> SearchMedicamentsAsync(SearchQuery searchQuery, CancellationToken cancellationToken = default);
    Task<MedicamentDto?> GetMedicamentAsync(int id, CancellationToken cancellationToken = default);
    Task DeleteMedicament(int id, CancellationToken cancellationToken = default);
    Task<bool> IsSufficientQuantity(int medicamentId, int orderedQuantity, CancellationToken cancellationToken = default);
    Task<bool> CreateMedicamentHistoryAsync(CreateMedicamentHistoryDto request);
    // Task SearchMedicamentsAsync();

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
            PAMP = request.PAMP,
            PBR = request.PBR,
            Status = request.Quantity < 0 ? "out of stock" : "in stock",
            DiscountRate = request.Discount,
            ReimbursementRate = request.ReimbursementRate,
            OrderSystem = request.OrderSystem,
            WithPrescription = request.WithPrescription,
        };

        dbContext.Medicaments.Add(medicament);
        var result = await dbContext.SaveChangesAsync();

        if (result > 0)
        {
            // create an inventroy for the medicament
            var inventroy = new Inventory()
            {
                MedicamentId = medicament.Id,
                ExperationDate = request.ExperationDate,
                Quantity = request.Quantity,
                PPH = request.PPH,
                PPV = request.PPV,
            };

            dbContext.Inventories.Add(inventroy);
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
        var query = dbContext.Medicaments.AsNoTracking().AsQueryable();

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
}
