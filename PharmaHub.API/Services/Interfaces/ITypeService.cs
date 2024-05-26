using Microsoft.EntityFrameworkCore;
namespace PharmaHub.API.Services.Interfaces;

public interface ITypeService
{
  Task<bool> CreateTypeAsync(TypeDto request, CancellationToken cancellationToken = default);
  Task<TypeDto?> GetTypeByIdAsync(int id, CancellationToken cancellationToken = default);
  Task<bool> DeleteType(int id, CancellationToken cancellationToken = default);
  Task<bool> UpdateType(int id, TypeDto request, CancellationToken cancellationToken = default);
  public Task<List<TDto>> GetTaxes<TDto>(string? name, CancellationToken cancellationToken) where TDto : class;
}

public class TypeService(ApplicationDbContext dbContext, ICurrentUser currentUser) : ITypeService
{
  public async Task<TypeDto?> GetTypeByIdAsync(int id, CancellationToken cancellationToken = default) => await dbContext.Types.Where(o => o.Id == id).ProjectToType<TypeDto>().FirstOrDefaultAsync(cancellationToken);
  public async Task<bool> CreateTypeAsync(TypeDto request, CancellationToken cancellationToken = default)
  {
    Models.Type type = new()
    {
      Name = request.Name,
      Code = request.Code,
      Marge = request.Marge,
      TVA = request.TVA,
      TaxNature = request.TaxNature,
      SalesDiscountRate = request.SalesDiscountRate
    };

    dbContext.Types.Add(type);
    await dbContext.SaveChangesAsync(cancellationToken);
    return true;
  }
  public async Task<bool> DeleteType(int id, CancellationToken cancellationToken = default)
  {
    var entity = await GetTypeByIdAsync(id, cancellationToken);
    if (entity is not null)
    {
      dbContext.Types.Remove(entity.ToEntity());
      await dbContext.SaveChangesAsync(cancellationToken);
      return true;
    }
    return false;
  }
  public async Task<bool> UpdateType(int id, TypeDto request, CancellationToken cancellationToken = default)
  {
    var type = await GetTypeByIdAsync(id, cancellationToken);

    if (type is not null)
    {
      type.Name = request.Name;
      type.Code = request.Code;
      type.Marge = request.Marge;
      type.TVA = request.TVA;
      type.TaxNature = request.TaxNature;
      type.SalesDiscountRate = request.SalesDiscountRate;
      dbContext.Types.Update(type.ToEntity());
      await dbContext.SaveChangesAsync(cancellationToken);
      return true;
    }
    return false;
  }

  public async Task<List<TDto>> GetTaxes<TDto>(string? name, CancellationToken cancellationToken) where TDto : class
  {
    var query = dbContext.Types.AsNoTracking();

    if (string.IsNullOrWhiteSpace(name))
    {
      return await query.ProjectToType<TDto>().ToListAsync(cancellationToken);
    }

    return await query.Where(x => x.Name.Contains(name)).ProjectToType<TDto>().ToListAsync(cancellationToken);
  }
}