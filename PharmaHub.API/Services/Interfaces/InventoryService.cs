using Microsoft.EntityFrameworkCore;
using PharmaHub.API.Common.Models;
using PharmaHub.API.Dtos.Inventory;

namespace PharmaHub.API.Services.Interfaces;

public interface IInventoryService
{
    public Task<PaginatedResponse<InventoryMedicationDto>> SearchInventoryAsync(string medicamentName, CancellationToken cancellationToken = default);
    public Task<PaginatedResponse<InventoryMedicationDto>> InventoriesByType(string typeName, CancellationToken cancellationToken = default);
}

public class InventoryService(ApplicationDbContext dbContext) : IInventoryService
{
    public async Task<PaginatedResponse<InventoryMedicationDto>> InventoriesByType(string typeName, CancellationToken cancellationToken = default)
    {
        return await dbContext.Inventories.Include(i => i.Medication).Where(i => i.Medication.Type == typeName).AsNoTracking().ProjectToType<InventoryMedicationDto>().PaginatedListAsync(1, 1000);
    }



    public async Task<PaginatedResponse<InventoryMedicationDto>> SearchInventoryAsync(string medicamentName, CancellationToken cancellationToken)
    {
        var query = dbContext.Inventories.AsNoTracking();

        if (string.IsNullOrWhiteSpace(medicamentName))
        {
            return await query.Include(i => i.Medication).ProjectToType<InventoryMedicationDto>().PaginatedListAsync(1, 100);
        }

        return await query.Include(i => i.Medication).Where(i => i.Medication.Name.Contains(medicamentName)).ProjectToType<InventoryMedicationDto>().PaginatedListAsync(1, 100);
    }
}
