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
    public DateTime DeliveryDate { get; set; }
    public string Status { get; set; }
    public int SupplierId { get; set; }
    public Supplier Supplier { get; set; }
    public List<OrderItemDetailedDto> OrderItems { get; set; }
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
    Task<PaginatedResponse<DeliveryDetailedDto>> GetDeliveriesAsync(DateTime from, DateTime to, int supplier, int pageNumber, int pageSize, CancellationToken cancellationToken = default);
    Task<DeliveryBasicDto?> GetDeliveryByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<DeliveryDetailedDto?> GetDeliveryDetails(int deliveryNumber, CancellationToken cancellationToken = default);

    Task<bool> CreateDeliveryAsync(DeliveryCreateDto request, CancellationToken cancellationToken = default);
    Task<bool> UpdateDelivery(int id, DeliveryUpdateDto request, CancellationToken cancellationToken = default);
    Task<bool> DeleteDelivery(int id, CancellationToken cancellationToken = default);

    Task<bool> CreateOrder(OrderCreateDto request, CancellationToken cancellationToken);
    Task<PaginatedResponse<OrderItemDetailedDto>> GetOrders(OrderSearchQuery searchQuery, CancellationToken cancellationToken);
}


public class DeliveryService(ApplicationDbContext dbContext, ICurrentUser currentUser) : IDeliveryService
{
    public async Task<DeliveryBasicDto?> GetDeliveryByIdAsync(int id, CancellationToken cancellationToken = default)
     => await dbContext.Deliveries
    .Where(o => o.Id == id)
    // .Include(o => o.DeliveryMedications)
    .ProjectToType<DeliveryBasicDto>()
    .FirstOrDefaultAsync(cancellationToken);

    public async Task<PaginatedResponse<DeliveryDetailedDto>> GetDeliveriesAsync(DateTime from, DateTime to, int supplier, int pageNumber, int pageSize, CancellationToken cancellationToken = default)
    {
        var query = dbContext.Deliveries.AsNoTracking()
            .Where(d => d.DeliveryDate >= from && d.DeliveryDate <= to);

        if (supplier > 0)
        {
            query = query.Where(d => d.SupplierId == supplier);
        }

        var result = await query
            .OrderBy(d => d.DeliveryDate)
            // .Include(d => d.DeliveryMedications)
            .ProjectToType<DeliveryDetailedDto>()
            .PaginatedListAsync(1, 1000);

        return result;
    }

    public async Task<bool> CreateDeliveryAsync(DeliveryCreateDto request, CancellationToken cancellationToken = default)
    {
        var userId = currentUser.GetUserId();
        Delivery delivery = new()
        {
            UserId = userId,
            DeliveryDate = request.DeliveryDate,
            DeliveryNumber = request.DeliveryNumber,
            TotalQuantity = request.DeliveryMedications.Sum(item => item.DeliveredQuantity),
            SupplierId = request.SupplierId
        };

        dbContext.Deliveries.Add(delivery);
        await dbContext.SaveChangesAsync(cancellationToken);
        foreach (var item in request.DeliveryMedications)
        {
            var inventory = await dbContext.Inventories.FindAsync([item.InventoryId], cancellationToken);



            // update order items if the order item id is > 0 else we create it
            if (item.OrderItemId > 0)
            {
                var orderItem = await dbContext.OrderDeliveryInventories.FindAsync([item.OrderItemId], cancellationToken);
                if (orderItem is not null)
                {
                    orderItem.Status = "Delivered";
                    orderItem.DeliveryId = delivery.Id;
                    orderItem.DeliveredQuantity = item.DeliveredQuantity;
                    orderItem.TotalFreeUnits = item.TotalFreeUnits;
                    orderItem.DiscountRate = item.DiscountRate;

                    dbContext.OrderDeliveryInventories.Update(orderItem);
                    await dbContext.SaveChangesAsync(cancellationToken);

                    // Check if all order items for this order have been processed
                    bool allItemsProcessed = await dbContext.OrderDeliveryInventories
                        .Where(oi => oi.OrderId == orderItem.OrderId)
                        .AllAsync(oi => oi.Status == "Delivered", cancellationToken);

                    if (allItemsProcessed)
                    {
                        var orderToUpdate = await dbContext.Orders.FindAsync([orderItem.OrderId], cancellationToken);
                        if (orderToUpdate is not null)
                        {
                            orderToUpdate.Status = "Delivered";
                            dbContext.Orders.Update(orderToUpdate);
                        }
                    }
                }
            }
            else
            {
                var deliveryItem = new OrderDeliveryInventory()
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

                dbContext.OrderDeliveryInventories.Add(deliveryItem);

            }
            if (inventory is null) continue;

            inventory.Quantity += item.DeliveredQuantity + item.TotalFreeUnits;

            await dbContext.SaveChangesAsync(cancellationToken);
        }
        return true;
    }
    public async Task<bool> UpdateDelivery(int id, DeliveryUpdateDto request, CancellationToken cancellationToken = default)
    {
        var existingDelivery = await dbContext.Deliveries
            .Include(d => d.OrderDeliveryInventories)
            .ThenInclude(odi => odi.Inventory)
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);

        if (existingDelivery is null) return false;

        var requestItemIds = request.DeliveryMedications.Select(dm => dm.OrderItemId).ToList();

        // Find deleted items
        var deletedItems = existingDelivery.OrderDeliveryInventories
            .Where(oldItem => !requestItemIds.Contains(oldItem.Id))
            .ToList();

        // Cache inventory updates to minimize DB calls
        var inventoryUpdates = new Dictionary<int, int>();

        // Process deleted items
        foreach (var item in deletedItems)
        {
            if (!inventoryUpdates.ContainsKey(item.InventoryId))
            {
                inventoryUpdates[item.InventoryId] = 0;
            }
            inventoryUpdates[item.InventoryId] -= item.DeliveredQuantity + item.TotalFreeUnits;
            dbContext.OrderDeliveryInventories.Remove(item);
        }

        // Process updated and new items
        foreach (var item in request.DeliveryMedications)
        {
            var deliveryItem = existingDelivery.OrderDeliveryInventories
                .FirstOrDefault(odi => odi.Id == item.OrderItemId);

            if (deliveryItem == null)
            {
                // New delivery item
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
                // Adjust inventory quantity for the old item values
                if (!inventoryUpdates.ContainsKey(deliveryItem.InventoryId))
                {
                    inventoryUpdates[deliveryItem.InventoryId] = 0;
                }
                inventoryUpdates[deliveryItem.InventoryId] -= deliveryItem.DeliveredQuantity + deliveryItem.TotalFreeUnits;

                // Update existing delivery item
                deliveryItem.DeliveredQuantity = item.DeliveredQuantity;
                deliveryItem.DiscountRate = item.DiscountRate;
                deliveryItem.OrderedQuantity = item.OrderedQuantity;
                deliveryItem.Status = "Delivered";
                deliveryItem.TotalFreeUnits = item.TotalFreeUnits;
                deliveryItem.PurchasePriceUnit = item.Pph;
                deliveryItem.TotalPurchasePrice = item.Pph * item.DeliveredQuantity;

                dbContext.OrderDeliveryInventories.Update(deliveryItem);
            }

            // Update inventory quantity for the new item values
            if (!inventoryUpdates.ContainsKey(item.InventoryId))
            {
                inventoryUpdates[item.InventoryId] = 0;
            }
            inventoryUpdates[item.InventoryId] += item.DeliveredQuantity + item.TotalFreeUnits;
        }

        // Apply inventory updates
        var inventoryIds = inventoryUpdates.Keys.ToList();
        var inventories = await dbContext.Inventories
            .Where(inv => inventoryIds.Contains(inv.Id))
            .ToListAsync(cancellationToken);

        foreach (var inventory in inventories)
        {
            inventory.Quantity += inventoryUpdates[inventory.Id];
            dbContext.Inventories.Update(inventory);
        }

        // Update the total quantity in the delivery
        existingDelivery.TotalQuantity = request.DeliveryMedications.Sum(item => item.DeliveredQuantity + item.TotalFreeUnits);
        dbContext.Deliveries.Update(existingDelivery);

        // Save changes
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

    public async Task<DeliveryDetailedDto?> GetDeliveryDetails(int deliveryNumber, CancellationToken cancellationToken = default)
    {
        var result = await dbContext.Deliveries.Where(d => d.DeliveryNumber == deliveryNumber)
            .Include(d => d.OrderDeliveryInventories)
            .ProjectToType<DeliveryDetailedDto>().AsNoTracking().FirstOrDefaultAsync(cancellationToken: cancellationToken);
        return result;
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
    public string Status { get; set; } = "";
    public int Supplier { get; set; }
    public DateTime From { get; set; } = DateTime.Now;
    public DateTime To { get; set; } = DateTime.Now;
}