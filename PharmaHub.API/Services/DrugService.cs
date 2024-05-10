

namespace PharmaHub.API;

public class MedicamentService(ApplicationDbContext dbContext) : IMedicamentService
{
    public async Task<int> CreateMedicamentAsync(CreateMedicamentRequest request, CancellationToken cancellationToken)
    {
        Medicament enity = new()
        {
            Name = request.Name,
            DCI = request.DCI,
            Form = request.Form,
            PPV = request.PPV,
            PPH = request.PPH,
            TVA = request.TVA,
            Discount = request.Discount,
            PBR = request.PBR,
            Type = request.Type,
            Marge = request.Marge,
            Codebar = request.Codebar,
            Family = request.Familly,
            UsedBy = request.UsedBy,
            WithPrescription = request.WithPrescription,

        };

        var result = dbContext.Medicaments.Add(enity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return result.Entity.Id;
    }

    public Task DeleteMedicament(int medicamentsId, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public Task<Medicament> GetMedicamentAsync(int medicamentsId, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public Task<List<Medicament>> GetMedicamentsAsync(CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public Task UpdateMedicamentAsync(CreateMedicamentRequest request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}
