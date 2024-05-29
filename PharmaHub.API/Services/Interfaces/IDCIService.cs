using Microsoft.EntityFrameworkCore;
using PharmaHub.API.Common.Models;

namespace PharmaHub.API.Services.Interfaces;

public interface IDciService
{
  Task<bool> CreateDciAsync(DciDto request, CancellationToken cancellationToken = default);
  Task<DciDto?> GetDciAsync(int id, CancellationToken cancellationToken = default);
  Task<bool> DeleteDci(int id, CancellationToken cancellationToken = default);
  Task<bool> UpdateDci(int id, DciDto request, CancellationToken cancellationToken = default);
  Task<PaginatedResponse<Dci>> GetDcIs(string name, CancellationToken cancellationToken);

}
public class DciService(ApplicationDbContext dbContext, ICurrentUser currentUser) : IDciService
{
  public async Task<DciDto?> GetDciAsync(int id, CancellationToken cancellationToken = default) => await dbContext.MedicationNames.Where(o => o.Id == id).ProjectToType<DciDto>().FirstOrDefaultAsync(cancellationToken);
  public async Task<bool> CreateDciAsync(DciDto request, CancellationToken cancellationToken = default)
  {
    Dci dCi = new()
    {
      Name = request.Name,
      Description = request.Description
    };

    dbContext.MedicationNames.Add(dCi);


    await dbContext.SaveChangesAsync(cancellationToken);
    return true;
  }
  public async Task<bool> DeleteDci(int id, CancellationToken cancellationToken = default)
  {
    var dCi = await dbContext.MedicationNames.FirstOrDefaultAsync(s => s.Id == id, cancellationToken: cancellationToken);

    if (dCi is not null)
    {
      dbContext.MedicationNames.Remove(dCi);
      await dbContext.SaveChangesAsync(cancellationToken);
      return true;
    }
    return false;
  }

  public async Task<bool> UpdateDci(int id, DciDto request, CancellationToken cancellationToken = default)
  {
    var dCi = await dbContext.MedicationNames.FirstOrDefaultAsync(s => s.Id == id, cancellationToken: cancellationToken);

    if (dCi is not null)
    {
      dCi.Name = request.Name;
      dCi.Description = request.Description;

      dbContext.MedicationNames.Update(dCi);
      await dbContext.SaveChangesAsync(cancellationToken);
      return true;
    }
    return false;
  }

  public async Task<PaginatedResponse<Dci>> GetDcIs(string? name, CancellationToken cancellationToken)
  {
    var query = dbContext.MedicationNames.AsNoTracking();

    if (string.IsNullOrWhiteSpace(name))
    {
      return await query.PaginatedListAsync(1, 100);
    }

    return await query.Where(x => x.Name.Contains(name)).PaginatedListAsync(1, 100);

  }
}



