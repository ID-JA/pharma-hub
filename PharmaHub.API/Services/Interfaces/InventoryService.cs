using Microsoft.EntityFrameworkCore;
using PharmaHub.API.Common.Models;
using PharmaHub.API.Dtos.Inventory;

namespace PharmaHub.API.Services.Interfaces;

public interface IInventoryService
{
    public Task<PaginatedResponse<InventoryBasicDto>> SearchInventoryAsync(string medicamentName, CancellationToken cancellationToken = default);
}

public class InventoryService(ApplicationDbContext dbContext) : IInventoryService
{
    public async Task<PaginatedResponse<InventoryBasicDto>> SearchInventoryAsync(string medicamentName, CancellationToken cancellationToken)
    {
        var query = dbContext.Inventories.AsNoTracking();

        if (string.IsNullOrWhiteSpace(medicamentName))
        {
            return await query.Include(i => i.Medication).ProjectToType<InventoryBasicDto>().PaginatedListAsync(1, 100);
        }

        return await query.Include(i => i.Medication).Where(i => i.Medication.Name.Contains(medicamentName)).ProjectToType<InventoryBasicDto>().PaginatedListAsync(1, 100);
    }
}