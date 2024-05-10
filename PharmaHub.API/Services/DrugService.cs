

namespace PharmaHub.API;

public class DrugService(ApplicationDbContext dbContext) : IDrugService
{
    public async Task<int> CreateDrugAsync(CreateDrugRequest request, CancellationToken cancellationToken)
    {
        Drug enity = new()
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
            Familly = request.Familly,
            UsedBy = request.UsedBy,
            WithPrescription = request.WithPrescription,

        };

        var result = dbContext.Drugs.Add(enity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return result.Entity.Id;
    }

    public Task DeleteDrug(int drugId, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public Task<Drug> GetDrugAsync(int drugId, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public Task<List<Drug>> GetDrugsAsync(CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public Task UpdateDrugAsync(CreateDrugRequest drug, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}
