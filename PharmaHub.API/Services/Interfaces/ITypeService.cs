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
  public async Task<TypeDto?> GetTypeByIdAsync(int id, CancellationToken cancellationToken = default) => await dbContext.Taxes.Where(o => o.Id == id).ProjectToType<TypeDto>().FirstOrDefaultAsync(cancellationToken);
  public async Task<bool> CreateTypeAsync(TypeDto request, CancellationToken cancellationToken = default)
  {
    Tax tax = new()
    {
      Name = request.Name,
      Code = request.Code,
      Marge = request.Marge,
      Tva = request.Tva,
      TaxNature = request.TaxNature,
      SalesDiscountRate = request.SalesDiscountRate
    };

    dbContext.Taxes.Add(tax);
    await dbContext.SaveChangesAsync(cancellationToken);
    return true;
  }
  public async Task<bool> DeleteType(int id, CancellationToken cancellationToken = default)
  {
    var entity = await GetTypeByIdAsync(id, cancellationToken);

    if (entity is null) return false;

    dbContext.Taxes.Remove(entity.ToEntity());
    await dbContext.SaveChangesAsync(cancellationToken);

    return true;
  }
  public async Task<bool> UpdateType(int id, TypeDto request, CancellationToken cancellationToken = default)
  {
    var type = await GetTypeByIdAsync(id, cancellationToken);

    if (type is null) return false;

    type.Name = request.Name;
    type.Code = request.Code;
    type.Marge = request.Marge;
    type.Tva = request.Tva;
    type.TaxNature = request.TaxNature;
    type.SalesDiscountRate = request.SalesDiscountRate;

    dbContext.Taxes.Update(type.ToEntity());
    await dbContext.SaveChangesAsync(cancellationToken);

    return true;
  }

  public async Task<List<TDto>> GetTaxes<TDto>(string? name, CancellationToken cancellationToken) where TDto : class
  {
    var query = dbContext.Taxes.AsNoTracking();

    if (string.IsNullOrWhiteSpace(name))
    {
      return await query.ProjectToType<TDto>().ToListAsync(cancellationToken);
    }

    return await query.Where(x => x.Name.Contains(name)).ProjectToType<TDto>().ToListAsync(cancellationToken);
  }
}