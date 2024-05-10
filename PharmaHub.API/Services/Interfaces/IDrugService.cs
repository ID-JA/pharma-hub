namespace PharmaHub.API;

public interface IMedicamentService
{
    public Task<int> CreateMedicamentAsync(CreateMedicamentRequest Medicament, CancellationToken cancellationToken);
    public Task DeleteMedicament(int medicamentId, CancellationToken cancellationToken);
    public Task UpdateMedicamentAsync(CreateMedicamentRequest Medicament, CancellationToken cancellationToken);
    public Task<Medicament> GetMedicamentAsync(int MedicamentId, CancellationToken cancellationToken);
    public Task<List<Medicament>> GetMedicamentsAsync(CancellationToken cancellationToken);
}
