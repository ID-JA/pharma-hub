using Mapster;
using Microsoft.EntityFrameworkCore;

namespace PharmaHub.API;

public interface ISupplierService
{
    Task<List<SupplierDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<SupplierDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task CreateAsync(SupplierDto request, CancellationToken cancellationToken = default);
    Task<bool> UpdateAsync(int id, SupplierDto request, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
}

public class SupplierService(ApplicationDbContext dbContext) : ISupplierService
{
    public async Task CreateAsync(SupplierDto request, CancellationToken cancellationToken = default)
    {
        dbContext.Suppliers.Add(request.ToEntity());
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await GetByIdAsync(id, cancellationToken);

        if (entity is null)
            return false;

        dbContext.Suppliers.Remove(entity.ToEntity());
        await dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<SupplierDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default) => await dbContext.Suppliers.Where(s => s.Id == id).ProjectToType<SupplierDto>().FirstOrDefaultAsync();

    public async Task<List<SupplierDto>> GetAllAsync(CancellationToken cancellationToken = default) => await dbContext.Suppliers.ProjectToType<SupplierDto>().ToListAsync();

    public async Task<bool> UpdateAsync(int id, SupplierDto request, CancellationToken cancellationToken = default)
    {
        var entity = await GetByIdAsync(id, cancellationToken);

        if (entity is null)
            return false;

        entity.Name = request.Name;
        entity.Fax = request.Fax;
        entity.Phone = request.Phone;

        dbContext.Suppliers.Update(entity.ToEntity());
        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}
