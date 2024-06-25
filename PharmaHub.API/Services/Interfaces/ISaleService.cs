using Mapster;
using Microsoft.EntityFrameworkCore;
using PharmaHub.API.Dtos.Medicament;
using PharmaHub.API.Dtos.Sale;
using PharmaHub.API.Dtos.StockHistory;

namespace PharmaHub.API.Services.Interfaces;

public interface ISaleService
{
    Task<long> GetNextSaleNumberAsync(CancellationToken cancellationToken = default);
    Task CreateSale(SaleCreateDto request);
    Task<bool> UpdateSale(int id, SaleUpdateDto request, CancellationToken cancellationToken = default);
    Task<List<SaleBasicDto>> GetSalesAsync(CancellationToken cancellationToken = default);
    Task<SaleDetailedDto?> GetSaleAsync(int id, CancellationToken cancellationToken = default);
    Task DeleteSale(int id, CancellationToken cancellationToken = default);
}


public class SaleService(ApplicationDbContext dbContext, IService<Sale> saleRepository, IService<SaleMedications> saleMedicamentRepository, ICurrentUser currentUserService, IMedicationService medicationService) : ISaleService
{
    public async Task<long> GetNextSaleNumberAsync(CancellationToken cancellationToken = default)
    {
        var lastSale = await dbContext.Sales
           .OrderByDescending(s => s.SaleNumber)
           .AsNoTracking()
           .FirstOrDefaultAsync(cancellationToken);

        return lastSale != null ? lastSale.SaleNumber + 1 : 100;
    }
    public async Task CreateSale(SaleCreateDto request)
    {
        var userId = currentUserService.GetUserId();
        bool isOutOfStock = false;

        using var transaction = await dbContext.Database.BeginTransactionAsync();
        try
        {
            var sale = new Sale
            {
                TotalQuantity = request.SaleMedications.Sum(sm => sm.Quantity),
                TotalPrice = request.SaleMedications.Sum(sm => sm.NetPrice),
                Status = request.Status,
                Discount = request.Discount,
                UserId = userId,
                SaleMedications = new List<SaleMedications>()
            };

            dbContext.Sales.Add(sale);
            await dbContext.SaveChangesAsync();

            foreach (var item in request.SaleMedications)
            {
                var isSufficient = await medicationService.IsSufficientQuantity(item.InventoryId, item.Quantity);
                var quantityToChange = isSufficient ? item.Quantity : -item.Quantity;

                var saleItem = new SaleMedications
                {
                    SaleId = sale.Id,
                    InventoryId = item.InventoryId,
                    Quantity = quantityToChange,
                    TotalPrice = item.NetPrice,
                    Discount = item.Discount,
                };
                sale.SaleMedications.Add(saleItem);

                if (!isSufficient)
                {
                    isOutOfStock = true;
                }

                if (request.Status == "Paid" && isSufficient)
                {
                    await UpdateInventory(item.InventoryId, quantityToChange, sale.Id);
                }
            }

            sale.Status = DetermineSaleStatus(request.Status, isOutOfStock);
            await dbContext.SaveChangesAsync();

            await transaction.CommitAsync();
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            throw new Exception("An error occurred while creating the sale.", ex);
        }
    }

    private string DetermineSaleStatus(string initialStatus, bool isOutOfStock)
    {
        if (isOutOfStock)
        {
            return "OutOfStock";
        }
        return initialStatus;
    }

    private async Task UpdateInventory(int inventoryId, int quantityToChange, int saleId)
    {
        var inventoryHistory = new InventoryHistory
        {
            InventoryId = inventoryId,
            QuantityChanged = quantityToChange,
            SaleId = saleId,
        };
        dbContext.InventoryHistories.Add(inventoryHistory);

        var inventory = await dbContext.Inventories.FindAsync(inventoryId);
        if (inventory != null)
        {
            inventory.Quantity -= quantityToChange;
            dbContext.Inventories.Update(inventory);
        }
    }

    public async Task<bool> UpdateSale(int id, SaleUpdateDto request, CancellationToken cancellationToken = default)
    {
        var sale = await dbContext.Sales
            .Include(s => s.SaleMedications)
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken: cancellationToken);

        // It could be better if we create an endpoint for updating only sales item (/sales/{id}/items)
        if (sale is null) return false;

        sale.TotalQuantity = request.SaleMedications.Sum(sm => sm.Quantity);
        sale.TotalPrice = request.TotalPrice;
        sale.Status = request.Status;
        sale.Discount = request.Discount;

        dbContext.SaleMedications.RemoveRange(sale.SaleMedications);
        foreach (var item in request.SaleMedications)
        {
            var saleItemDetail = new SaleMedications
            {
                InventoryId = item.InventoryId,
                Quantity = item.Quantity,
                Ppv = item.Ppv,
                Discount = item.Discount,
                TotalPrice = item.TotalPrice,
                Tva = item.Tva,
            };

            sale.SaleMedications.Add(saleItemDetail);

            if (request.Status == "Paid")
            {
                await medicationService.CreateMedicamentHistoryAsync(new StockHistoryCreateDto()
                {
                    InventoryId = item.InventoryId,
                    QuantityChanged = sale.TotalQuantity,
                    SaleId = sale.Id
                });
            }
        }
        await dbContext.SaveChangesAsync(cancellationToken);
        return true;

    }

    public async Task<List<SaleBasicDto>> GetSalesAsync(CancellationToken cancellationToken = default)
    {
        return await dbContext.Sales.ProjectToType<SaleBasicDto>().ToListAsync(cancellationToken);
    }

    public async Task<SaleDetailedDto?> GetSaleAsync(int id, CancellationToken cancellationToken = default)
    {
        return await dbContext.Sales.Where(s => s.Id == id)
            .Include(s => s.SaleMedications)
            .ThenInclude(s => s.Inventory)
            .ThenInclude(s => s.Medication)
            .AsNoTracking()
            .ProjectToType<SaleDetailedDto>()
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task DeleteSale(int id, CancellationToken cancellationToken = default)
    {
        var entity = await saleRepository.GetByIdAsync(id, cancellationToken);
        if (entity is not null)
        {
            await saleRepository.DeleteAsync(entity, cancellationToken);
        }
    }
}