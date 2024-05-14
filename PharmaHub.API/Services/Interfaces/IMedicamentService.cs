using Microsoft.EntityFrameworkCore;

namespace PharmaHub.API.Services.Interfaces;

public interface IMedicamentService : IService<Medicament>
{
    Task CreateMedicament(CreateMedicamentDto request);
    Task<bool> UpdateMedicament(int id, CreateMedicamentDto request, CancellationToken cancellationToken = default);
    Task<List<MedicamentDto>> GetMedicamentsAsync(CancellationToken cancellationToken = default);
    Task<MedicamentDto?> GetMedicamentAsync(int id, CancellationToken cancellationToken = default);
    Task DeleteMedicament(int id, CancellationToken cancellationToken = default);
    Task<bool> IsSufficientQuantity(int medicamentId, int orderedQuantity, CancellationToken cancellationToken = default);
    Task<bool> CreateMedicamentHistoryAsync(CreateMedicamentHistoryDto request);

}


public class MedicamentService(ApplicationDbContext dbContext) : Service<Medicament>(dbContext), IMedicamentService
{
    public Task CreateMedicament(CreateMedicamentDto request)
    {
        throw new NotImplementedException();
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

    public Task<List<MedicamentDto>> GetMedicamentsAsync(CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public Task<bool> UpdateMedicament(int id, CreateMedicamentDto request, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public async Task<bool> IsSufficientQuantity(int medicamentId, int orderedQuantity, CancellationToken cancellationToken = default)
    {
        var medicamentQte = await dbContext.Medicaments.Where(m => m.Id == medicamentId).Select(m => m.Quantity).FirstOrDefaultAsync(cancellationToken);
        return medicamentQte > orderedQuantity;
    }
}
