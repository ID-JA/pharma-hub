using Mapster;
using Microsoft.EntityFrameworkCore;
using PharmaHub.API.Dtos.Order;

namespace PharmaHub.API.Services.Interfaces;

public interface IOrderService
{
    Task<List<OrderBasicDto>> GetOrdersAsync(CancellationToken cancellationToken = default);
    Task<OrderBasicDto?> GetOrderAsync(int id, CancellationToken cancellationToken = default);
    Task<bool> CreateOrderAsync(OrderCreateDto request, CancellationToken cancellationToken = default);
    Task<bool> UpdateOrder(int id, OrderUpdateDto request, CancellationToken cancellationToken = default);
    Task<bool> DeleteOrder(int id, CancellationToken cancellationToken = default);
}


public class OrderService(ApplicationDbContext dbContext, ICurrentUser currentUser) : IOrderService
{
    public async Task<OrderBasicDto?> GetOrderAsync(int id, CancellationToken cancellationToken = default) => await dbContext.Orders.Where(o => o.Id == id).ProjectToType<OrderBasicDto>().FirstOrDefaultAsync(cancellationToken);

    public async Task<List<OrderBasicDto>> GetOrdersAsync(CancellationToken cancellationToken = default) => await dbContext.Orders.Include(o => o.OrderMedicaments).ProjectToType<OrderBasicDto>().ToListAsync(cancellationToken);

    public async Task<bool> CreateOrderAsync(OrderCreateDto request, CancellationToken cancellationToken = default)
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
        
        foreach (var item in request.OrderMedicaments)
        {
            var inventory = await dbContext.Inventories.FindAsync([item.InventoryId], cancellationToken);
            
            if (inventory is null) continue;
            
            inventory.Quantity += item.Quantity;
            inventory.PPV = item.Ppv;
            inventory.PPH = item.Pph;
            
            dbContext.Inventories.Update(inventory);

            OrderMedicament orderMedicament = new()
            {
                OrderId = result.Entity.Id,
                MedicamentId = item.MedicamentId,
                Quantity = item.Quantity,
                InventoryId = inventory.Id,
                PPV = item.Ppv,
                PPH = item.Pph,
            };
            order.OrderMedicaments.Add(orderMedicament);
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return true;

        return false;
    }

    public async Task<bool> UpdateOrder(int id, OrderUpdateDto request, CancellationToken cancellationToken = default)
    {
        var order = await dbContext.Orders
            .Include(o => o.OrderMedicaments)
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken: cancellationToken);

        if (order is null) return false;
       
        order.TotalQuantity = request.OrderMedicaments.Sum(or=>or.Quantity);
        order.SupplierId = request.SupplierId;
        order.OrderMedicaments.Clear();

        foreach (var orderMedicament in request.OrderMedicaments.Select(item => new OrderMedicament
                 {
                     OrderId = order.Id,
                     MedicamentId = item.MedicamentId,
                     Quantity = item.Quantity
                 }))
        {
            order.OrderMedicaments.Add(orderMedicament);
        }

        dbContext.Orders.Update(order);
        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }

    public Task<bool> DeleteOrder(int id, CancellationToken cancellationToken = default)
    {
        dbContext.Database.ExecuteSqlRaw("EXEC RollBackQuantity @p0", id);
        return Task.FromResult(true);
    }

}