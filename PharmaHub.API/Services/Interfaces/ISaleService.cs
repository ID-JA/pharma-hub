using Mapster;
using Microsoft.EntityFrameworkCore;
using PharmaHub.API.Dtos.Medicament;
using PharmaHub.API.Dtos.Sale;
using PharmaHub.API.Dtos.StockHistory;

namespace PharmaHub.API.Services.Interfaces;

public interface ISaleService
{
    Task CreateSale(SaleCreateDto request);
    Task<bool> UpdateSale(int id, SaleUpdateDto request, CancellationToken cancellationToken = default);
    Task<List<SaleBasicDto>> GetSalesAsync(CancellationToken cancellationToken = default);
    Task<SaleBasicDto?> GetSaleAsync(int id, CancellationToken cancellationToken = default);
    Task DeleteSale(int id, CancellationToken cancellationToken = default);
}


public class SaleService(ApplicationDbContext dbContext, IService<Sale> saleRepository, IService<SaleMedications> saleMedicamentRepository, ICurrentUser currentUserService, IMedicationService medicationService) : ISaleService
{
    public async Task CreateSale(SaleCreateDto request)
    {
        var userId = currentUserService.GetUserId();

        var sale = new Sale
        {
            TotalQuantity = request.TotalQuantity,
            TotalPrice = request.TotalPrice,
            Status = request.Status,
            Discount = request.Discount,
            UserId = userId,
            SaleMedications = []
        };

        dbContext.Sales.Add(sale);
        await dbContext.SaveChangesAsync();

        if (sale.Id != 0)
        {
            foreach (var item in request.SaleMedications)
            {
                var isSufficient = await medicationService.IsSufficientQuantity(item.InventoryId, item.Quantity);

                var quantityToChange = isSufficient ? item.Quantity : -item.Quantity;

                var saleItem = new SaleMedications
                {
                    SaleId = sale.Id,
                    InventoryId = item.InventoryId,
                    Quantity = quantityToChange,
                    Ppv = item.Ppv,
                    Tva = item.Tva,
                    Discount = item.Discount,
                };

                sale.SaleMedications.Add(saleItem);

                if (quantityToChange < 0)
                {
                    sale.Status = "Out of Stock";
                }
                else if (request.Status == "Paid" && isSufficient)
                {
                    await medicationService.CreateMedicamentHistoryAsync(new StockHistoryCreateDto()
                    {
                        InventoryId = item.InventoryId,
                        QuantityChanged = item.Quantity,
                        SaleId = sale.Id
                    });
                }
            }

            if (request.Status == "Paid" && sale.Status != "Out of Stock")
            {
                sale.Status = "Paid";
            }

            await dbContext.SaveChangesAsync();
        }
    }

    public async Task<bool> UpdateSale(int id, SaleUpdateDto request, CancellationToken cancellationToken = default)
    {
        var sale = await dbContext.Sales
            .Include(s => s.SaleMedications)
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken: cancellationToken);

        // It could be better if we create an endpoint for updating only sales item (/sales/{id}/items)
        if (sale is null) return false;

        sale.TotalQuantity = request.SaleMedications.Sum(sm=>sm.Quantity);
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