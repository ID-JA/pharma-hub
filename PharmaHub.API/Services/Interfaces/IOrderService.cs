using Mapster;
using Microsoft.EntityFrameworkCore;

namespace PharmaHub.API.Services.Interfaces;

public interface IOrderService
{
    Task<List<OrderDto>> GetOrdersAsync(CancellationToken cancellationToken = default);
    Task<OrderDto?> GetOrderAsync(int id, CancellationToken cancellationToken = default);
    Task<bool> CreateOrderAsync(CreateOrderDto request, CancellationToken cancellationToken = default);
    Task<bool> UpdateOrder(int id, CreateOrderDto request, CancellationToken cancellationToken = default);
    Task<bool> DeleteOrder(int id, CancellationToken cancellationToken = default);
}


public class OrderSerivce(ApplicationDbContext dbContext, ICurrentUser currentUser) : IOrderService
{
    public async Task<OrderDto?> GetOrderAsync(int id, CancellationToken cancellationToken = default) => await dbContext.Orders.Where(o => o.Id == id).ProjectToType<OrderDto>().FirstOrDefaultAsync(cancellationToken);

    public async Task<List<OrderDto>> GetOrdersAsync(CancellationToken cancellationToken = default) => await dbContext.Orders.Include(o => o.OrderMedicaments).ProjectToType<OrderDto>().ToListAsync(cancellationToken);

    public async Task<bool> CreateOrderAsync(CreateOrderDto request, CancellationToken cancellationToken = default)
    {
        var userId = currentUser.GetUserId();
        Order order = new()
        {
            UserId = userId,
            OrderDate = request.OrderDate,
            OrderNumber = request.OrderNumber,
            TotalQuantity = request.OrderMedicaments.Sum(item => item.Quantity),
            SupplierId = request.SupplierId
        };
        var result = dbContext.Orders.Add(order);
        await dbContext.SaveChangesAsync(cancellationToken);
        if (result is not null)
        {
            foreach (var item in request.OrderMedicaments)
            {
                var inventory = await dbContext.Inventories.FindAsync([item.InventoryId], cancellationToken);
                if (inventory is not null)
                {
                    inventory.Quantity = item.Quantity;
                    inventory.PPV = item.PPV;
                    inventory.PPH = item.PPH;
                    dbContext.Inventories.Update(inventory);
                }
                OrderMedicament orderMedicament = new()
                {
                    OrderId = result.Entity.Id,
                    MedicamentId = item.MedicamentId,
                    Quantity = item.Quantity

                };

                order.OrderMedicaments.Add(orderMedicament);

            }

            await dbContext.SaveChangesAsync(cancellationToken);
            return true;
        }

        return false;
    }

    public async Task<bool> UpdateOrder(int id, CreateOrderDto request, CancellationToken cancellationToken = default)
    {
        var order = await dbContext.Orders
            .Include(o => o.OrderMedicaments)
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken: cancellationToken);

        if (order is not null)
        {
            order.TotalQuantity = request.TotalQuantity;
            order.SupplierId = request.SupplierId;
            order.OrderMedicaments.Clear();

            foreach (var item in request.OrderMedicaments)
            {
                var orderMedicament = new OrderMedicament
                {
                    OrderId = order.Id,
                    MedicamentId = item.MedicamentId,
                    Quantity = item.Quantity
                };
                order.OrderMedicaments.Add(orderMedicament);
            }

            dbContext.Orders.Update(order);
            await dbContext.SaveChangesAsync(cancellationToken);
            return true;
        }
        return false;
    }

    public async Task<bool> DeleteOrder(int id, CancellationToken cancellationToken = default)
    {
        var entity = await GetOrderAsync(id, cancellationToken);
        if (entity is not null)
        {
            dbContext.Orders.Remove(entity.ToEntity());
            await dbContext.SaveChangesAsync(cancellationToken);
            return true;
        }
        return false;
    }

}