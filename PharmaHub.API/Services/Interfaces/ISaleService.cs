using Microsoft.EntityFrameworkCore;
using PharmaHub.API.Dtos.Sale;

namespace PharmaHub.API.Services.Interfaces;

public interface ISaleService
{
    Task<long> GetNextSaleNumberAsync(CancellationToken cancellationToken = default);
    Task CreateSale(SaleCreateDto request);
    Task<bool> UpdateSale(int id, SaleUpdateDto request, CancellationToken cancellationToken = default);
    Task<List<SaleDetailedDto>> GetSalesAsync(DateTime? from = null, DateTime? to = null, int? saleNumber = null, CancellationToken cancellationToken = default);
    Task<SaleBasicDto?> GetSaleAsync(int id, CancellationToken cancellationToken = default);
    Task DeleteSale(int id, CancellationToken cancellationToken = default);
    Task CancelSale(int saleId, int? inventoryId, CancellationToken cancellationToken);

    Task<SalesWithQuantities> GetSalesCountByDateRangeAsync(DateTime? startDate = null, DateTime? endDate = null, CancellationToken cancellationToken = default);

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
                PaymentType = request.PaymentType,
                SaleMedications = new List<SaleMedication>()
            };

            dbContext.Sales.Add(sale);
            await dbContext.SaveChangesAsync();

            var inventoryIds = request.SaleMedications.Select(sm => sm.InventoryId).Distinct().ToList();
            var inventories = await dbContext.Inventories
                .Include(i => i.Medication)
                .Where(i => inventoryIds.Contains(i.Id))
                .ToDictionaryAsync(i => i.Id);

            var saleMedications = new List<SaleMedication>();

            foreach (var item in request.SaleMedications)
            {
                if (!inventories.TryGetValue(item.InventoryId, out var inventory))
                {
                    isOutOfStock = true;
                    continue;
                }

                var previousBoxQuantity = inventory.BoxQuantity;
                var previousUnitQuantity = inventory.UnitQuantity;

                var saleItem = item.ToEntity();
                saleItem.SaleId = sale.Id;

                if (item.SaleType.Equals("Box", StringComparison.OrdinalIgnoreCase))
                {
                    inventory.BoxQuantity -= item.Quantity;
                    if (inventory.BoxQuantity < 0)
                    {
                        isOutOfStock = true;
                        saleItem.Status = "OutOfStock";
                        saleItem.Quantity = -item.Quantity;
                    }
                }
                else if (item.SaleType.Equals("Unit", StringComparison.OrdinalIgnoreCase))
                {
                    inventory.UnitQuantity -= item.Quantity;
                    if (inventory.UnitQuantity < 0)
                    {
                        int unitsPerBox = inventory.Medication.SaleUnits;
                        int boxesNeeded = (int)Math.Ceiling((double)Math.Abs(inventory.UnitQuantity) / unitsPerBox);

                        if (inventory.BoxQuantity >= boxesNeeded)
                        {
                            inventory.BoxQuantity -= boxesNeeded;
                            inventory.UnitQuantity += boxesNeeded * unitsPerBox;
                        }
                        else
                        {
                            isOutOfStock = true;
                            saleItem.Status = "OutOfStock";
                            saleItem.Quantity = -item.Quantity;
                        }
                    }
                }

                if (!isOutOfStock)
                {
                    saleItem.Status = request.Status;
                }

                saleMedications.Add(saleItem);
            }

            await dbContext.SaleMedications.AddRangeAsync(saleMedications);
            await dbContext.SaveChangesAsync();

            var inventoryHistories = saleMedications.Select(saleItem =>
            {
                var inventory = inventories[saleItem.InventoryId];
                return new InventoryHistory
                {
                    InventoryId = inventory.Id,
                    PreviousBoxQuantity = inventory.BoxQuantity,
                    PreviousUnitQuantity = inventory.UnitQuantity,
                    NewBoxQuantity = inventory.BoxQuantity,
                    NewUnitQuantity = inventory.UnitQuantity,
                    ChangeDate = DateTime.UtcNow,
                    ChangeType = "Sale",
                    SaleMedicationId = saleItem.Id
                };
            }).ToList();

            dbContext.InventoryHistories.AddRange(inventoryHistories);
            dbContext.Inventories.UpdateRange(inventories.Values);

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

    public async Task<List<SaleDetailedDto>> GetSalesAsync(DateTime? from = null, DateTime? to = null, int? saleNumber = null, CancellationToken cancellationToken = default)
    {
        if (!from.HasValue && !to.HasValue)
        {
            to = DateTime.UtcNow.Date;
            from = to.Value.AddDays(-6);
        }

        if (from.HasValue && to.HasValue && from > to)
        {
            (from, to) = (to, from);
        }

        if (to.HasValue)
        {
            to = to.Value.Date.AddDays(1).AddTicks(-1);
        }

        var query = dbContext.Sales
            .Where(s => (!from.HasValue || s.CreatedAt >= from) && (!to.HasValue || s.CreatedAt <= to))
            .Where(s => s.Status != "Pending"); // Exclude sales with status "Pending"

        if (saleNumber.HasValue)
        {
            query = query.Where(s => s.SaleNumber == saleNumber.Value);
        }

        var result = await query
            .ProjectToType<SaleDetailedDto>()
            .ToListAsync(cancellationToken);

        return result;
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

    public async Task CancelSale(int saleId, int? saleItemId, CancellationToken cancellationToken)
    {
        using var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);
        try
        {
            var sale = await dbContext.Sales
                .Include(s => s.SaleMedications)
                    .ThenInclude(sm => sm.Inventory)
                    .ThenInclude(i => i.Medication)
                .Include(s => s.SaleMedications)
                    .ThenInclude(sm => sm.InventoryHistories)
                .FirstOrDefaultAsync(s => s.Id == saleId, cancellationToken);

            if (sale == null)
            {
                throw new Exception("Sale not found.");
            }

            if (saleItemId.HasValue)
            {
                var saleMedication = sale.SaleMedications.FirstOrDefault(sm => sm.Id == saleItemId.Value);
                if (saleMedication == null)
                {
                    throw new Exception("Sale item not found.");
                }

                var inventory = saleMedication.Inventory;
                if (saleMedication.SaleType.Equals("Unit", StringComparison.OrdinalIgnoreCase))
                {
                    inventory.UnitQuantity += saleMedication.Quantity;
                    if (inventory.UnitQuantity >= inventory.Medication.SaleUnits)
                    {
                        inventory.BoxQuantity += inventory.UnitQuantity / inventory.Medication.SaleUnits;
                        inventory.UnitQuantity %= inventory.Medication.SaleUnits;
                    }
                }
                else if (saleMedication.SaleType.Equals("Box", StringComparison.OrdinalIgnoreCase))
                {
                    inventory.BoxQuantity += saleMedication.Quantity;
                }

                dbContext.InventoryHistories.Add(new InventoryHistory
                {
                    InventoryId = inventory.Id,
                    SaleMedicationId = saleMedication.Id,
                    ChangeDate = DateTime.UtcNow,
                    ChangeType = "Return",
                    PreviousBoxQuantity = inventory.BoxQuantity - saleMedication.Quantity,
                    PreviousUnitQuantity = inventory.UnitQuantity - saleMedication.Quantity,
                    NewBoxQuantity = inventory.BoxQuantity,
                    NewUnitQuantity = inventory.UnitQuantity
                });

                saleMedication.Status = "Return";
                saleMedication.Quantity = -saleMedication.Quantity;

                if (sale.SaleMedications.All(sm => sm.Status == "Return"))
                {
                    sale.Status = "Return";
                }
            }
            else
            {
                var inventoriesToUpdate = sale.SaleMedications
                    .GroupBy(sm => sm.InventoryId)
                    .Select(g => new
                    {
                        Inventory = g.First().Inventory,
                        UnitQuantity = g.Sum(sm => sm.SaleType.Equals("Unit", StringComparison.OrdinalIgnoreCase) ? sm.Quantity : 0),
                        BoxQuantity = g.Sum(sm => sm.SaleType.Equals("Box", StringComparison.OrdinalIgnoreCase) ? sm.Quantity : 0)
                    }).ToList();

                foreach (var item in inventoriesToUpdate)
                {
                    var previousBoxQuantity = item.Inventory.BoxQuantity;
                    var previousUnitQuantity = item.Inventory.UnitQuantity;

                    item.Inventory.UnitQuantity += item.UnitQuantity;
                    if (item.Inventory.UnitQuantity >= item.Inventory.Medication.SaleUnits)
                    {
                        item.Inventory.BoxQuantity += item.Inventory.UnitQuantity / item.Inventory.Medication.SaleUnits;
                        item.Inventory.UnitQuantity %= item.Inventory.Medication.SaleUnits;
                    }
                    item.Inventory.BoxQuantity += item.BoxQuantity;

                    dbContext.InventoryHistories.Add(new InventoryHistory
                    {
                        InventoryId = item.Inventory.Id,
                        SaleMedicationId = null,
                        ChangeDate = DateTime.UtcNow,
                        ChangeType = "Return",
                        PreviousBoxQuantity = previousBoxQuantity,
                        PreviousUnitQuantity = previousUnitQuantity,
                        NewBoxQuantity = item.Inventory.BoxQuantity,
                        NewUnitQuantity = item.Inventory.UnitQuantity
                    });
                }

                foreach (var saleMedication in sale.SaleMedications)
                {
                    saleMedication.Status = "Return";
                    saleMedication.Quantity = -saleMedication.Quantity;
                }

                sale.Status = "Return";
            }

            await dbContext.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync(cancellationToken);
            throw new Exception("An error occurred while canceling the sale.", ex);
        }
    }

    public async Task<SalesWithQuantities> GetSalesCountByDateRangeAsync(DateTime? startDate = null, DateTime? endDate = null, CancellationToken cancellationToken = default)
    {
        startDate ??= DateTime.Now.AddMonths(-1);
        endDate ??= DateTime.Now;

        var salesGroupedByDate = await dbContext.Sales
            .Where(s => s.CreatedAt >= startDate && s.CreatedAt <= endDate)
            .GroupBy(s => s.CreatedAt.Date)
            .Select(g => new
            {
                Date = g.Key,
                Returned = g.Count(s => s.Status.ToLower() == "return"),
                Paid = g.Count(s => s.Status.ToLower() == "paid"),
                OutOfStock = g.Count(s => s.Status.ToLower() == "outofstock"),
                Pending = g.Count(s => s.Status.ToLower() == "pending"),
                SalesQuantities = g.Select(s => new
                {
                    s.CreatedAt,
                    s.TotalQuantities
                }).ToList()
            })
            .ToListAsync(cancellationToken);

        var salesData = salesGroupedByDate.Select(s => new SalesData
        {
            Date = s.Date.ToString("MM/dd/yyyy"),
            Returned = s.Returned,
            Paid = s.Paid,
            OutOfStock = s.OutOfStock,
            Pending = s.Pending
        }).ToList();

        var salesQuantities = salesGroupedByDate.SelectMany(s => s.SalesQuantities.Select(q => new SalesQuantity
        {
            Date = q.CreatedAt.ToString("MM/dd/yyyy"),
            Quantity = q.TotalQuantities
        })).ToList();

        return new SalesWithQuantities
        {
            Sales = salesData,
            SalesQuantities = salesQuantities
        };
    }


}

public class TimeSeriesData
{
    public string Date { get; set; }
    public int Returned { get; set; }
    public int Paid { get; set; }
    public int OutOfStock { get; set; }
    public int Pending { get; set; }
}


public class SalesData
{
    public string Date { get; set; }
    public int Returned { get; set; }
    public int Paid { get; set; }
    public int OutOfStock { get; set; }
    public int Pending { get; set; }
}

public class SalesQuantity
{
    public string Date { get; set; }
    public int Quantity { get; set; }
}

public class SalesWithQuantities
{
    public List<SalesData> Sales { get; set; }
    public List<SalesQuantity> SalesQuantities { get; set; }
}
