using Mapster;
using Microsoft.EntityFrameworkCore;
using PharmaHub.API.Common.Models;
using PharmaHub.API.Dtos.Delivery;
using PharmaHub.API.Models.Order;

namespace PharmaHub.API.Services.Interfaces;

public class OrderCreateDto : BaseDto<OrderCreateDto, Order>
{
    public DateTime OrderDate { get; set; }
    public int SupplierId { get; set; }
    public List<OrderItemCreateDto> OrderItems { get; set; } = [];

}

public class OrderItemCreateDto : BaseDto<OrderItemCreateDto, Models.Order.OrderItem>
{
    public int Quantity { get; set; }
    public decimal TotalPurchasePrice { get; set; }
    public decimal Pph { get; set; }
    public double DiscountRate { get; set; }
    public int InventoryId { get; set; }
}

public interface IDeliveryService
{
    Task<PaginatedResponse<DeliveryBasicDto>> GetDeliveriesAsync(DateTime from, DateTime to, int supplier, int pageNumber, int pageSize, CancellationToken cancellationToken = default);
    Task<DeliveryBasicDto?> GetDeliveryAsync(int id, CancellationToken cancellationToken = default);
    Task<bool> CreateDeliveryAsync(DeliveryCreateDto request, CancellationToken cancellationToken = default);
    Task<bool> UpdateDelivery(int id, DeliveryUpdateDto request, CancellationToken cancellationToken = default);
    Task<bool> DeleteDelivery(int id, CancellationToken cancellationToken = default);

    Task<bool> CreateOrder(OrderCreateDto request, CancellationToken cancellationToken);
}


public class DeliveryService(ApplicationDbContext dbContext, ICurrentUser currentUser) : IDeliveryService
{
    public async Task<DeliveryBasicDto?> GetDeliveryAsync(int id, CancellationToken cancellationToken = default)
     => await dbContext.Deliveries
    .Where(o => o.Id == id)
    .Include(o => o.OrderMedications)
    .ProjectToType<DeliveryBasicDto>()
    .FirstOrDefaultAsync(cancellationToken);

    public async Task<PaginatedResponse<DeliveryBasicDto>> GetDeliveriesAsync(DateTime from, DateTime to, int supplier, int pageNumber, int pageSize, CancellationToken cancellationToken = default)
    {
        if (supplier != 0)
        {
            return await dbContext.Deliveries.Where(o => o.OrderDate >= from && o.OrderDate <= to && o.SupplierId == supplier).OrderBy(o => o.OrderDate)
                    .Include(o => o.OrderMedications).ProjectToType<DeliveryBasicDto>().PaginatedListAsync(pageNumber, pageSize);
        }
        else
        {
            return await dbContext.Deliveries.Where(o => o.OrderDate >= from && o.OrderDate <= to).OrderBy(o => o.OrderDate)
                   .Include(o => o.OrderMedications).ProjectToType<DeliveryBasicDto>().PaginatedListAsync(pageNumber, pageSize);
        }
    }

    public async Task<bool> CreateDeliveryAsync(DeliveryCreateDto request, CancellationToken cancellationToken = default)
    {
        var userId = currentUser.GetUserId();
        Delivery order = new()
        {
            UserId = userId,
            OrderDate = request.OrderDate,
            OrderNumber = request.OrderNumber,
            TotalQuantity = request.DeliveryMedications.Sum(item => item.Quantity),
            SupplierId = request.SupplierId
        };

        var result = dbContext.Deliveries.Add(order);
        await dbContext.SaveChangesAsync(cancellationToken);

        foreach (var item in request.DeliveryMedications)
        {
            var inventory = await dbContext.Inventories.FindAsync([item.InventoryId], cancellationToken);

            if (inventory is null) continue;

            inventory.Quantity += item.Quantity;
            inventory.Ppv = item.Ppv;
            inventory.Pph = item.Pph;

            dbContext.Inventories.Update(inventory);

            DeliveryMedication orderMedication = new()
            {
                DeliveryId = result.Entity.Id,
                Quantity = item.Quantity,
                InventoryId = inventory.Id,
                Ppv = item.Ppv,
                Pph = item.Pph,
            };
            order.OrderMedications.Add(orderMedication);
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<bool> UpdateDelivery(int id, DeliveryUpdateDto request, CancellationToken cancellationToken = default)
    {
        var order = await dbContext.Deliveries
            .Include(o => o.OrderMedications)
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken: cancellationToken);

        if (order is null) return false;

        order.TotalQuantity = request.DeliveryMedicaments.Sum(or => or.Quantity);
        order.SupplierId = request.SupplierId;
        order.OrderMedications.Clear();

        foreach (var orderMedicament in request.DeliveryMedicaments.Select(item => new DeliveryMedication
        {
            DeliveryId = order.Id,
            InventoryId = item.InventoryId,
            Pph = item.Pph,
            Ppv = item.Ppv,
            Quantity = item.Quantity
        }))
        {
            order.OrderMedications.Add(orderMedicament);
        }

        dbContext.Deliveries.Update(order);
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
            Status = "Pending",
        };

        dbContext.Orders.Add(order);
        var result = await dbContext.SaveChangesAsync();


        if (result > 0)
        {
            foreach (var OrderItem in request.OrderItems)
            {
                OrderItem orderItem = new()
                {
                    OrderId = order.Id,
                    InventoryId = OrderItem.InventoryId,
                    DiscountRate = OrderItem.DiscountRate,
                    TotalPurchasePrice = OrderItem.TotalPurchasePrice,
                    Pph = OrderItem.Pph,
                    Quantity = OrderItem.Quantity,
                };

                dbContext.OrderItems.Add(orderItem);
                await dbContext.SaveChangesAsync();
            }
        }

        return true;
    }
}