using Microsoft.EntityFrameworkCore;

namespace PharmaHub.API.Services.Interfaces;

public interface IDCIService
{
  Task<bool> CreateDCIAsync(DCIDto request, CancellationToken cancellationToken = default);
  Task<DCIDto?> GetDCIAsync(int id, CancellationToken cancellationToken = default);
  Task<bool> DeleteDCI(int id, CancellationToken cancellationToken = default);
  Task<bool> UpdateDCI(int id, DCIDto request, CancellationToken cancellationToken = default);

}
public class DCIService(ApplicationDbContext dbContext, ICurrentUser currentUser) : IDCIService
{
  public async Task<DCIDto?> GetDCIAsync(int id, CancellationToken cancellationToken = default) => await dbContext.DCIs.Where(o => o.Id == id).ProjectToType<DCIDto>().FirstOrDefaultAsync(cancellationToken);
  public async Task<bool> CreateDCIAsync(DCIDto request, CancellationToken cancellationToken = default)
  {
    DCI dCI = new()
    {
      Name = request.Name,
      Description = request.Description
    };

    dbContext.DCIs.Add(dCI);


    await dbContext.SaveChangesAsync(cancellationToken);
    return true;
  }
  public async Task<bool> DeleteDCI(int id, CancellationToken cancellationToken = default)
  {
    var dCI = await dbContext.DCIs.FirstOrDefaultAsync(s => s.Id == id, cancellationToken: cancellationToken);

    if (dCI is not null)
    {
      dbContext.DCIs.Remove(dCI);
      await dbContext.SaveChangesAsync(cancellationToken);
      return true;
    }
    return false;
  }

  public async Task<bool> UpdateDCI(int id, DCIDto request, CancellationToken cancellationToken = default)
  {
    var dCI = await dbContext.DCIs.FirstOrDefaultAsync(s => s.Id == id, cancellationToken: cancellationToken);

    if (dCI is not null)
    {
      dCI.Name = request.Name;
      dCI.Description = request.Description;

      dbContext.DCIs.Update(dCI);
      await dbContext.SaveChangesAsync(cancellationToken);
      return true;
    }
    return false;
  }
}



