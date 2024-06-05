using Mapster;
using Microsoft.EntityFrameworkCore;
using PharmaHub.API.Common.Models;
using PharmaHub.API.Dtos.Delivery;
using PharmaHub.API.Dtos.Inventory;
using PharmaHub.API.Dtos.Medicament;

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
    public DateTime DeliveryDate { get; set; }
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
        Delivery order = new()
        {
            UserId = userId,
            DeliveryDate = request.DeliveryDate,
            DeliveryNumber = request.DeliveryNumber,
            TotalQuantity = request.DeliveryMedications.Sum(item => item.Quantity),
            SupplierId = request.SupplierId
        };

        // var result = dbContext.Deliveries.Add(order);
        // await dbContext.SaveChangesAsync(cancellationToken);

        // foreach (var item in request.DeliveryMedications)
        // {
        //     var inventory = await dbContext.Inventories.FindAsync([item.InventoryId], cancellationToken);

        //     if (inventory is null) continue;

        //     inventory.Quantity += item.Quantity;
        //     inventory.Ppv = item.Ppv;
        //     inventory.Pph = item.Pph;

        //     dbContext.Inventories.Update(inventory);

        //     DeliveryMedication orderMedication = new()
        //     {
        //         DeliveryId = result.Entity.Id,
        //         Quantity = item.Quantity,
        //         InventoryId = inventory.Id,
        //         Ppv = item.Ppv,
        //         Pph = item.Pph,
        //     };
        //     order.DeliveryMedications.Add(orderMedication);

        //     // if the orderId > 0 we need to change status of the order
        //     if (item.OrderId > 0)
        //     {
        //         var orderItem = await dbContext.OrderItems
        //             .FirstOrDefaultAsync(oi => oi.OrderId == item.OrderId && oi.InventoryId == item.InventoryId, cancellationToken);
        //         if (orderItem is not null)
        //         {
        //             orderItem.Status = "Processed";
        //             dbContext.OrderItems.Update(orderItem);
        //             await dbContext.SaveChangesAsync(cancellationToken);

        //             // Check if all order items for this order have been processed
        //             bool allItemsProcessed = await dbContext.OrderItems
        //                 .Where(oi => oi.OrderId == item.OrderId)
        //                 .AllAsync(oi => oi.Status == "Processed", cancellationToken);

        //             if (allItemsProcessed)
        //             {
        //                 var orderToUpdate = await dbContext.Orders
        //                     .FirstOrDefaultAsync(o => o.Id == item.OrderId, cancellationToken);
        //                 if (orderToUpdate is not null)
        //                 {
        //                     orderToUpdate.Status = "Processed";
        //                     dbContext.Orders.Update(orderToUpdate);
        //                 }
        //             }
        //         }
        //     }

        // }

        // await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<bool> UpdateDelivery(int id, DeliveryUpdateDto request, CancellationToken cancellationToken = default)
    {
        // var order = await dbContext.Deliveries
        //     .Include(o => o.DeliveryMedications)
        //     .FirstOrDefaultAsync(s => s.Id == id, cancellationToken: cancellationToken);

        // if (order is null) return false;

        // order.TotalQuantity = request.DeliveryMedicaments.Sum(or => or.Quantity);
        // order.SupplierId = request.SupplierId;
        // order.DeliveryMedications.Clear();

        // foreach (var orderMedicament in request.DeliveryMedicaments.Select(item => new DeliveryMedication
        // {
        //     DeliveryId = order.Id,
        //     InventoryId = item.InventoryId,
        //     Pph = item.Pph,
        //     Ppv = item.Ppv,
        //     Quantity = item.Quantity
        // }))
        // {
        //     order.DeliveryMedications.Add(orderMedicament);
        // }

        // dbContext.Deliveries.Update(order);
        // await dbContext.SaveChangesAsync(cancellationToken);
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
            // .Include(d => d.DeliveryMedications)
            .ProjectToType<DeliveryDetailedDto>().FirstOrDefaultAsync(cancellationToken: cancellationToken);
        return result;
    }
}

public class OrderSearchQuery
{
    public string Status { get; set; } = "";
    public int Supplier { get; set; }
    public DateTime From { get; set; } = DateTime.Now;
    public DateTime To { get; set; } = DateTime.Now;
}