using Microsoft.EntityFrameworkCore;
using PharmaHub.API.Common.Models;
using PharmaHub.API.Dtos.Delivery;
using PharmaHub.API.Dtos.Inventory;
using PharmaHub.API.Models;

namespace PharmaHub.API.Services.Interfaces;

public class OrderCreateDto : BaseDto<OrderCreateDto, Order>
{
    public DateTime OrderDate { get; set; }
    public int SupplierId { get; set; }
    public List<OrderItemCreateDto> OrderItems { get; set; } = [];

}

public class OrderBasicDto : BaseDto<OrderBasicDto, Order>
{
    public int Id { get; set; }
    public DateTime OrderDate { get; set; }
    public string Status { get; set; }
    public int SupplierId { get; set; }
    public Supplier Supplier { get; set; }
}

public class OrderDetailedDto : BaseDto<OrderDetailedDto, Order>
{
    public int Id { get; set; }
    public DateTime OrderDate { get; set; }
    public string Status { get; set; }
    public Supplier Supplier { get; set; }
    public List<OrderDeliveryInventoryBasicDto> OrderDeliveryInventories { get; set; }
}

public class OrderItemCreateDto : BaseDto<OrderItemCreateDto, OrderItem>
{
    public int InventoryId { get; set; }
    public int OrderedQuantity { get; set; }
    public decimal TotalPurchasePrice { get; set; }
    public decimal PurchasePriceUnit { get; set; }
    public double DiscountRate { get; set; }
}

public class OrderItemDetailedDto : BaseDto<OrderItemDetailedDto, OrderItem>
{
    public int Id { get; set; }
    public int OrderedQuantity { get; set; }
    public string Status { get; set; }
    public decimal TotalPurchasePrice { get; set; }
    public decimal PurchasePriceUnit { get; set; }
    public double DiscountRate { get; set; }
    public OrderBasicDto Order { get; set; }
    public InventoryDetailedDto Inventory { get; set; }
}

public interface IDeliveryService
{
    Task<PaginatedResponse<DeliveryDetailedDto>> GetDeliveriesAsync(int? deliveryNumber = null, DateTime? from = null, DateTime? to = null, int? supplierId = null, int pageNumber = 1, int pageSize = 10, string status = "pending", CancellationToken cancellationToken = default);
    Task<DeliveryBasicDto?> GetDeliveryByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<DeliveryDetailedDto?> GetDeliveryDetails(int deliveryNumber, CancellationToken cancellationToken = default);

    Task<int> CreateDeliveryAsync(DeliveryCreateDto request, CancellationToken cancellationToken = default);
    Task<bool> UpdateDelivery(int id, DeliveryUpdateDto request, CancellationToken cancellationToken = default);
    Task<bool> DeleteDelivery(int id, CancellationToken cancellationToken = default);

    Task<bool> CreateOrder(OrderCreateDto request, CancellationToken cancellationToken);
    Task<PaginatedResponse<OrderItemDetailedDto>> GetOrders(OrderSearchQuery searchQuery, CancellationToken cancellationToken);

    Task<List<OrdersDeliveriesData>> GetOrdersAndDeliveriesByDateRangeAsync(DateTime? startDate = null, DateTime? endDate = null, CancellationToken cancellationToken = default);
    Task<PaginatedResponse<OrderDetailedDto>> SearchOrdersAsync(OrderSearchQuery searchQuery, int pageNumber = 1, int pageSize = 10, CancellationToken cancellationToken = default);
}


public class DeliveryService(ApplicationDbContext dbContext, ICurrentUser currentUser) : IDeliveryService
{
    public async Task<DeliveryBasicDto?> GetDeliveryByIdAsync(int id, CancellationToken cancellationToken = default)
     => await dbContext.Deliveries
    .Where(o => o.Id == id)
    // .Include(o => o.DeliveryMedications)
    .ProjectToType<DeliveryBasicDto>()
    .FirstOrDefaultAsync(cancellationToken);

    public async Task<PaginatedResponse<DeliveryDetailedDto>> GetDeliveriesAsync(int? deliveryNumber = null, DateTime? from = null, DateTime? to = null, int? supplierId = null, int pageNumber = 1, int pageSize = 10, string status = "pending", CancellationToken cancellationToken = default)
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

        var query = dbContext.Deliveries
            .Where(s => (!from.HasValue || s.CreatedAt >= from) &&
                        (!to.HasValue || s.CreatedAt <= to) &&
                        (status == "pending" ? s.BillId == null : s.BillId != null))
            .Include(d => d.OrderDeliveryInventories)
            .AsNoTracking();

        if (deliveryNumber.HasValue)
        {
            query = query.Where(d => d.DeliveryNumber == deliveryNumber.Value);
        }

        if (supplierId.HasValue && supplierId.Value > 0)
        {
            query = query.Where(d => d.SupplierId == supplierId.Value);
        }

        var result = await query
            .OrderBy(d => d.CreatedAt)
            .ProjectToType<DeliveryDetailedDto>()
            .PaginatedListAsync(pageNumber, pageSize);

        return result;
    }



    public async Task<int> CreateDeliveryAsync(DeliveryCreateDto request, CancellationToken cancellationToken = default)
    {
        var userId = currentUser.GetUserId();

        using var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);
        try
        {
            var delivery = new Delivery
            {
                TotalPpv = request.TotalPpv,
                TotalFreePpv = request.TotalFreePpv,
                TotalNetPph = request.TotalNetPph,
                TotalBrutPph = request.TotalBrutPph,
                DiscountedAmount = request.DiscountedAmount,
                UserId = userId,
                DeliveryDate = request.DeliveryDate,
                DeliveryNumber = request.DeliveryNumber,
                TotalQuantity = request.DeliveryMedications.Sum(item => item.DeliveredQuantity),
                SupplierId = request.SupplierId
            };
            dbContext.Deliveries.Add(delivery);
            await dbContext.SaveChangesAsync(cancellationToken);

            var inventoryIds = request.DeliveryMedications.Select(dm => dm.InventoryId).Distinct().ToList();
            var inventories = await dbContext.Inventories
                .Where(i => inventoryIds.Contains(i.Id))
                .ToDictionaryAsync(i => i.Id, cancellationToken);

            var inventoryHistories = new List<InventoryHistory>();
            var updatedOrderIds = new HashSet<int>();
            var newOrderDeliveryInventories = new List<OrderDeliveryInventory>();

            foreach (var item in request.DeliveryMedications)
            {
                if (!inventories.TryGetValue(item.InventoryId, out var inventory))
                {
                    continue;
                }

                var previousBoxQuantity = inventory.BoxQuantity;
                var previousUnitQuantity = inventory.UnitQuantity;

                if (item.OrderItemId > 0)
                {
                    var orderDeliveryInventory = await dbContext.OrderDeliveryInventories
                        .FirstOrDefaultAsync(odi => odi.Id == item.OrderItemId, cancellationToken);

                    if (orderDeliveryInventory != null)
                    {
                        orderDeliveryInventory.Status = "Delivered";
                        orderDeliveryInventory.DeliveryId = delivery.Id;
                        orderDeliveryInventory.DeliveredQuantity = item.DeliveredQuantity;
                        orderDeliveryInventory.TotalFreeUnits = item.TotalFreeUnits;
                        orderDeliveryInventory.DiscountRate = item.DiscountRate;

                        updatedOrderIds.Add(orderDeliveryInventory.OrderId!.Value);
                        dbContext.OrderDeliveryInventories.Update(orderDeliveryInventory);
                    }
                }
                else
                {
                    var newOrderDeliveryInventory = new OrderDeliveryInventory
                    {
                        InventoryId = item.InventoryId,
                        DeliveredQuantity = item.DeliveredQuantity,
                        DeliveryId = delivery.Id,
                        DiscountRate = item.DiscountRate,
                        OrderedQuantity = 0,
                        Status = "Delivered",
                        TotalFreeUnits = item.TotalFreeUnits,
                        PurchasePriceUnit = inventory.Pph,
                        TotalPurchasePrice = inventory.Pph * item.DeliveredQuantity,
                    };
                    newOrderDeliveryInventories.Add(newOrderDeliveryInventory);
                    dbContext.OrderDeliveryInventories.Add(newOrderDeliveryInventory);
                    await dbContext.SaveChangesAsync(cancellationToken);
                }

                inventory.BoxQuantity += item.DeliveredQuantity + item.TotalFreeUnits;

                var inventoryHistory = new InventoryHistory
                {
                    InventoryId = inventory.Id,
                    PreviousBoxQuantity = previousBoxQuantity,
                    PreviousUnitQuantity = previousUnitQuantity,
                    NewBoxQuantity = inventory.BoxQuantity,
                    NewUnitQuantity = inventory.UnitQuantity,
                    ChangeDate = DateTime.UtcNow,
                    ChangeType = "Refill",
                    OrderDeliveryInventoryId = item.OrderItemId > 0 ? item.OrderItemId : newOrderDeliveryInventories.Last().Id
                };

                inventoryHistories.Add(inventoryHistory);
            }

            dbContext.InventoryHistories.AddRange(inventoryHistories);
            dbContext.Inventories.UpdateRange(inventories.Values);

            await dbContext.SaveChangesAsync(cancellationToken);

            foreach (var orderId in updatedOrderIds)
            {
                bool allItemsProcessed = await dbContext.OrderDeliveryInventories
                    .Where(oi => oi.OrderId == orderId)
                    .AllAsync(oi => oi.Status == "Delivered", cancellationToken);

                if (allItemsProcessed)
                {
                    var orderToUpdate = await dbContext.Orders
                        .FirstOrDefaultAsync(o => o.Id == orderId, cancellationToken);

                    if (orderToUpdate != null)
                    {
                        orderToUpdate.Status = "Delivered";
                        dbContext.Orders.Update(orderToUpdate);
                    }
                }
            }

            await dbContext.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);

            return delivery.Id;
        }
        catch (Exception)
        {
            await transaction.RollbackAsync(cancellationToken);
            throw;
        }
    }





    public async Task<bool> UpdateDelivery(int id, DeliveryUpdateDto request, CancellationToken cancellationToken = default)
    {
        var existingDelivery = await dbContext.Deliveries
            .Include(d => d.OrderDeliveryInventories)
            .ThenInclude(odi => odi.Inventory)
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);

        if (existingDelivery is null) return false;

        var requestItemIds = request.DeliveryMedications.Select(dm => dm.OrderItemId).ToList();

        var deletedItems = existingDelivery.OrderDeliveryInventories
            .Where(oldItem => !requestItemIds.Contains(oldItem.Id))
            .ToList();

        var inventoryUpdates = new Dictionary<int, int>();

        foreach (var item in deletedItems)
        {
            if (!inventoryUpdates.ContainsKey(item.InventoryId))
            {
                inventoryUpdates[item.InventoryId] = 0;
            }
            inventoryUpdates[item.InventoryId] -= item.DeliveredQuantity + item.TotalFreeUnits;
            dbContext.OrderDeliveryInventories.Remove(item);
        }

        foreach (var item in request.DeliveryMedications)
        {
            var deliveryItem = existingDelivery.OrderDeliveryInventories
                .FirstOrDefault(odi => odi.Id == item.OrderItemId);

            if (deliveryItem == null)
            {
                deliveryItem = new OrderDeliveryInventory
                {
                    InventoryId = item.InventoryId,
                    DeliveredQuantity = item.DeliveredQuantity,
                    DeliveryId = id,
                    DiscountRate = item.DiscountRate,
                    OrderedQuantity = item.OrderedQuantity,
                    Status = "Delivered",
                    TotalFreeUnits = item.TotalFreeUnits,
                    PurchasePriceUnit = item.Pph,
                    TotalPurchasePrice = item.Pph * item.DeliveredQuantity,
                };
                dbContext.OrderDeliveryInventories.Add(deliveryItem);
            }
            else
            {
                if (!inventoryUpdates.ContainsKey(deliveryItem.InventoryId))
                {
                    inventoryUpdates[deliveryItem.InventoryId] = 0;
                }
                inventoryUpdates[deliveryItem.InventoryId] -= deliveryItem.DeliveredQuantity + deliveryItem.TotalFreeUnits;

                deliveryItem.DeliveredQuantity = item.DeliveredQuantity;
                deliveryItem.DiscountRate = item.DiscountRate;
                deliveryItem.OrderedQuantity = item.OrderedQuantity;
                deliveryItem.Status = "Delivered";
                deliveryItem.TotalFreeUnits = item.TotalFreeUnits;
                deliveryItem.PurchasePriceUnit = item.Pph;
                deliveryItem.TotalPurchasePrice = item.Pph * item.DeliveredQuantity;

                dbContext.OrderDeliveryInventories.Update(deliveryItem);
            }

            if (!inventoryUpdates.ContainsKey(item.InventoryId))
            {
                inventoryUpdates[item.InventoryId] = 0;
            }
            inventoryUpdates[item.InventoryId] += item.DeliveredQuantity + item.TotalFreeUnits;
        }

        var inventoryIds = inventoryUpdates.Keys.ToList();
        var inventories = await dbContext.Inventories
            .Where(inv => inventoryIds.Contains(inv.Id))
            .ToListAsync(cancellationToken);

        foreach (var inventory in inventories)
        {
            inventory.BoxQuantity += inventoryUpdates[inventory.Id];
            dbContext.Inventories.Update(inventory);
        }

        existingDelivery.TotalQuantity = request.DeliveryMedications.Sum(item => item.DeliveredQuantity + item.TotalFreeUnits);
        existingDelivery.TotalPpv = request.TotalPpv;
        existingDelivery.TotalFreePpv = request.TotalFreePpv;
        existingDelivery.TotalNetPph = request.TotalNetPph;
        existingDelivery.TotalBrutPph = request.TotalBrutPph;
        existingDelivery.DiscountedAmount = request.DiscountedAmount;
        dbContext.Deliveries.Update(existingDelivery);

        await dbContext.SaveChangesAsync(cancellationToken);

        return true;
    }

    public Task<bool> DeleteDelivery(int id, CancellationToken cancellationToken = default)
    {
        dbContext.Database.ExecuteSqlRaw("EXEC RollBackQuantity @p0", id);
        return Task.FromResult(true);
    }

    public async Task<bool> CreateOrder(OrderCreateDto request, CancellationToken cancellationToken)
    {
        Order order = new()
        {
            SupplierId = request.SupplierId,
            OrderDate = request.OrderDate,
            Status = "Pending"
        };

        dbContext.Orders.Add(order);
        var result = await dbContext.SaveChangesAsync();


        if (result > 0)
        {
            foreach (var orderItem in request.OrderItems)
            {
                var item = new OrderDeliveryInventory()
                {
                    InventoryId = orderItem.InventoryId,
                    OrderId = order.Id,
                    OrderedQuantity = orderItem.OrderedQuantity,
                    PurchasePriceUnit = orderItem.PurchasePriceUnit,
                    TotalPurchasePrice = orderItem.TotalPurchasePrice,
                    DiscountRate = orderItem.DiscountRate

                };
                dbContext.OrderDeliveryInventories.Add(item);
            }
        }
        await dbContext.SaveChangesAsync(cancellationToken);


        return true;
    }

    public async Task<PaginatedResponse<OrderItemDetailedDto>> GetOrders(OrderSearchQuery searchQuery, CancellationToken cancellationToken)
    {
        // Define the base query
        var query = dbContext.OrderDeliveryInventories
            .Include(oi => oi.Inventory)
            .ThenInclude(i => i.Medication)
            .Include(oi => oi.Order)
            .AsQueryable();

        if (!string.IsNullOrEmpty(searchQuery.Status))
        {
            query = query.Where(oi => oi.Status == searchQuery.Status);
        }

        if (searchQuery.Supplier > 0)
        {
            query = query.Where(oi => oi.Order.SupplierId == searchQuery.Supplier);
        }

        query = query.Where(oi => oi.Order.OrderDate >= searchQuery.From && oi.Order.OrderDate <= searchQuery.To);

        return await query.ProjectToType<OrderItemDetailedDto>().PaginatedListAsync(1, 1000);
    }

    public async Task<PaginatedResponse<OrderDetailedDto>> SearchOrdersAsync(OrderSearchQuery searchQuery, int pageNumber = 1, int pageSize = 10, CancellationToken cancellationToken = default)
    {
        // Ensure the searchQuery has a valid date range
        if (!searchQuery.From.HasValue && !searchQuery.To.HasValue)
        {
            searchQuery.To = DateTime.UtcNow.Date;
            searchQuery.From = searchQuery.To.Value.AddDays(-6);
        }

        if (searchQuery.From.HasValue && searchQuery.To.HasValue && searchQuery.From > searchQuery.To)
        {
            (searchQuery.From, searchQuery.To) = (searchQuery.To, searchQuery.From);
        }

        searchQuery.To = searchQuery.To?.Date.AddDays(1).AddTicks(-1);

        // Define the base query
        var query = dbContext.Orders
            .Include(o => o.OrderDeliveryInventories)
            .AsQueryable();

        // // Apply filters
        // if (!string.IsNullOrEmpty(searchQuery.Status))
        // {
        //     query = query.Where(o => o.Status == searchQuery.Status);
        // }

        if (searchQuery.Supplier > 0)
        {
            query = query.Where(o => o.SupplierId == searchQuery.Supplier);
        }

        if (searchQuery.From.HasValue)
        {
            query = query.Where(o => o.OrderDate >= searchQuery.From);
        }

        if (searchQuery.To.HasValue)
        {
            query = query.Where(o => o.OrderDate <= searchQuery.To);
        }

        // Order by CreatedAt and paginate the results
        var result = await query
            .OrderBy(o => o.OrderDate)
            .ProjectToType<OrderDetailedDto>()
            .PaginatedListAsync(pageNumber, pageSize);

        return result;
    }


    public async Task<DeliveryDetailedDto?> GetDeliveryDetails(int deliveryNumber, CancellationToken cancellationToken = default)
    {
        var result = await dbContext.Deliveries.Where(d => d.DeliveryNumber == deliveryNumber)
            .Include(d => d.OrderDeliveryInventories)
            .ProjectToType<DeliveryDetailedDto>().AsNoTracking().FirstOrDefaultAsync(cancellationToken: cancellationToken);
        return result;
    }

    public async Task<List<OrdersDeliveriesData>> GetOrdersAndDeliveriesByDateRangeAsync(DateTime? startDate = null, DateTime? endDate = null, CancellationToken cancellationToken = default)
    {
        startDate ??= DateTime.Now.AddMonths(-1);
        endDate ??= DateTime.Now;

        var combinedData = await dbContext.OrderDeliveryInventories
            .Where(odi => odi.CreatedAt >= startDate && odi.CreatedAt <= endDate)
            .GroupBy(odi => odi.CreatedAt.Date)
            .Select(g => new OrdersDeliveriesData
            {
                Date = g.Key.ToString("MM/dd/yyyy"),
                QuantityOrdered = g.Where(odi => odi.OrderId != null).Sum(odi => odi.OrderedQuantity),
                QuantityReceived = g.Sum(odi => odi.DeliveredQuantity)
            })
            .ToListAsync(cancellationToken);

        return combinedData;
    }


    // DON'T DELETE IT: we could use this function in the future
    public async Task RollBackQuantityAsync(int itemId)
    {
        using (var transaction = await dbContext.Database.BeginTransactionAsync())
        {
            try
            {
                var item = await dbContext.OrderDeliveryInventories.FindAsync([itemId]);

                if (item is null) return;

                var inventory = await dbContext.Inventories.FindAsync([item.InventoryId]);

                if (inventory != null)
                {
                    inventory.Quantity -= item.DeliveredQuantity + item.TotalFreeUnits;
                    dbContext.Inventories.Update(inventory);
                }

                dbContext.OrderDeliveryInventories.Remove(item);
                await dbContext.SaveChangesAsync();

                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
    }
}

public class OrderSearchQuery
{
    public string? Status { get; set; }
    public int? Supplier { get; set; }
    public DateTime? From { get; set; } = DateTime.Now;
    public DateTime? To { get; set; } = DateTime.Now;
}

public class OrdersDeliveriesData
{
    public string Date { get; set; }
    public int QuantityOrdered { get; set; }
    public int QuantityReceived { get; set; }
}
