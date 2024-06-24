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
    Task<SaleBasicDto?> GetSaleAsync(int id, CancellationToken cancellationToken = default);
    Task DeleteSale(int id, CancellationToken cancellationToken = default);
}


public class SaleService(ApplicationDbContext dbContext, IService<Sale> saleRepository, IService<SaleMedication> saleMedicamentRepository, ICurrentUser currentUserService, IMedicationService medicationService) : ISaleService
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
                TotalQuantities = request.TotalQuantities,
                TotalNetPrices = request.TotalNetPrices,
                TotalBrutPrices = request.TotalBrutPrices,
                Status = request.Status,
                DiscountedAmount = request.DiscountedAmount,
                UserId = userId,
                SaleMedications = new List<SaleMedication>()
            };

            dbContext.Sales.Add(sale);
            await dbContext.SaveChangesAsync();

            var inventoryIds = request.SaleMedications.Select(sm => sm.InventoryId).ToList();

            var inventories = await dbContext.Inventories
                .Include(i => i.Medication)
                .Where(i => inventoryIds.Contains(i.Id))
                .ToDictionaryAsync(i => i.Id);

            var inventoryUpdates = new List<Inventory>();
            var inventoryHistories = new List<InventoryHistory>();
            foreach (var item in request.SaleMedications)
            {
                if (inventories.TryGetValue(item.InventoryId, out var inventory))
                {
                    var previousBoxQuantity = inventory.BoxQuantity;
                    var previousUnitQuantity = inventory.UnitQuantity;

                    SaleMedication saleItem = item.ToEntity();
                    if (item.SaleType.Equals("Box"))
                    {
                        inventory.BoxQuantity -= item.Quantity;
                        if (inventory.BoxQuantity < 0)
                        {
                            isOutOfStock = true;
                            saleItem.Status = "OutOfStock";
                        }
                    }
                    else if (item.SaleType.Equals("Unit"))
                    {
                        inventory.UnitQuantity -= item.Quantity;

                        if (inventory.UnitQuantity < 0)
                        {
                            int unitsPerBox = inventory.Medication.SaleUnits;
                            int boxesNeeded = (int)Math.Ceiling((double)Math.Abs(inventory.UnitQuantity) / unitsPerBox);

                            if (inventory.BoxQuantity > 0)
                            {
                                inventory.BoxQuantity -= boxesNeeded;
                                inventory.UnitQuantity += boxesNeeded * unitsPerBox;
                            }
                            else
                            {
                                isOutOfStock = true;
                                saleItem.Status = "OutOfStock";
                            }
                        }
                    }
                    // Record the inventory history
                    var inventoryHistory = new InventoryHistory
                    {
                        InventoryId = inventory.Id,
                        PreviousBoxQuantity = previousBoxQuantity,
                        PreviousUnitQuantity = previousUnitQuantity,
                        NewBoxQuantity = inventory.BoxQuantity,
                        NewUnitQuantity = inventory.UnitQuantity,
                        ChangeDate = DateTime.UtcNow,
                        ChangeType = "Sale",
                        SaleId = sale.Id
                    };

                    inventoryHistories.Add(inventoryHistory);
                    inventoryUpdates.Add(inventory);
                    sale.SaleMedications.Add(saleItem);
                }
                else
                {
                    isOutOfStock = true;
                }
            }

            dbContext.Inventories.UpdateRange(inventoryUpdates);
            dbContext.InventoryHistories.AddRange(inventoryHistories);
            sale.Status = isOutOfStock ? "OutOfStock" : request.Status;
            await dbContext.SaveChangesAsync();

            await transaction.CommitAsync();
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            throw new Exception("An error occurred while creating the sale.", ex);
        }
    }

    // private async Task UpdateInventory(int inventoryId, int quantityToChange, int saleId)
    // {
    //     var inventoryHistory = new InventoryHistory
    //     {
    //         InventoryId = inventoryId,
    //         QuantityChanged = quantityToChange,
    //         SaleId = saleId,
    //     };
    //     dbContext.InventoryHistories.Add(inventoryHistory);

    //     var inventory = await dbContext.Inventories.FindAsync(inventoryId);
    //     if (inventory != null)
    //     {
    //         inventory.Quantity -= quantityToChange;
    //         dbContext.Inventories.Update(inventory);
    //     }
    // }

    public async Task<bool> UpdateSale(int id, SaleUpdateDto request, CancellationToken cancellationToken = default)
    {
        var sale = await dbContext.Sales
            .Include(s => s.SaleMedications)
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken: cancellationToken);

        // It could be better if we create an endpoint for updating only sales item (/sales/{id}/items)
        if (sale is null) return false;

        // sale.TotalQuantity = request.SaleMedications.Sum(sm => sm.Quantity);
        // sale.TotalPrice = request.TotalPrice;
        // sale.Status = request.Status;
        // sale.Discount = request.Discount;

        dbContext.SaleMedications.RemoveRange(sale.SaleMedications);
        foreach (var item in request.SaleMedications)
        {
            var saleItemDetail = new SaleMedication
            {
                InventoryId = item.InventoryId,
                Quantity = item.Quantity,
                DiscountRate = item.Discount,
                NetPrice = item.TotalPrice,
            };

            sale.SaleMedications.Add(saleItemDetail);

            // if (request.Status == "Paid")
            // {
            //     await medicationService.CreateMedicamentHistoryAsync(new StockHistoryCreateDto()
            //     {
            //         InventoryId = item.InventoryId,
            //         QuantityChanged = sale.TotalQuantity,
            //         SaleId = sale.Id
            //     });
            // }
        }
        await dbContext.SaveChangesAsync(cancellationToken);
        return true;

    }

    public async Task<List<SaleBasicDto>> GetSalesAsync(CancellationToken cancellationToken = default)
    {
        return await dbContext.Sales.ProjectToType<SaleBasicDto>().ToListAsync(cancellationToken);
    }

    public async Task<SaleBasicDto?> GetSaleAsync(int id, CancellationToken cancellationToken = default)
    {
        return await dbContext.Sales.Where(s => s.Id == id).ProjectToType<SaleBasicDto>().FirstOrDefaultAsync(cancellationToken);
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