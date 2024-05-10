namespace PharmaHub.API;

public interface IDrugService
{
    public Task<int> CreateDrugAsync(CreateDrugRequest drug, CancellationToken cancellationToken);
    public Task DeleteDrug(int drugId, CancellationToken cancellationToken);
    public Task UpdateDrugAsync(CreateDrugRequest drug, CancellationToken cancellationToken);
    public Task<Drug> GetDrugAsync(int drugId, CancellationToken cancellationToken);
    public Task<List<Drug>> GetDrugsAsync(CancellationToken cancellationToken);
}
