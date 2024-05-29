﻿using Mapster;
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


public class SaleService(ApplicationDbContext dbContext, IService<Sale> saleRepository, IService<SaleMedicament> saleMedicamentRepository, ICurrentUser currentUserService, IMedicamentService medicamentService) : ISaleService
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
            SaleMedicaments = []
        };

        dbContext.Sales.Add(sale);
        await dbContext.SaveChangesAsync();

        if (sale.Id != 0)
        {
            foreach (var item in request.SaleMedicaments)
            {
                var isSufficient = await medicamentService.IsSufficientQuantity(item.MedicamentId, item.Quantity);

                var quantityToChange = isSufficient ? item.Quantity : -item.Quantity;

                var saleItem = new SaleMedicament
                {
                    SaleId = sale.Id,
                    MedicamentId = item.MedicamentId,
                    Quantity = quantityToChange,
                    PPV = item.Ppv,
                    TVA = item.Tva,
                    Discount = item.Discount,
                };

                sale.SaleMedicaments.Add(saleItem);

                if (quantityToChange < 0)
                {
                    sale.Status = "Out of Stock";
                }
                else if (request.Status == "Paid" && isSufficient)
                {
                    await medicamentService.CreateMedicamentHistoryAsync(new StockHistoryCreateDto()
                    {
                        MedicamentId = item.MedicamentId,
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
            .Include(s => s.SaleMedicaments)
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken: cancellationToken);

        // It could be better if we create an endpoint for updating only sales item (/sales/{id}/items)
        if (sale is null) return false;

        sale.TotalQuantity = request.SaleMedicaments.Sum(sm=>sm.Quantity);
        sale.TotalPrice = request.TotalPrice;
        sale.Status = request.Status;
        sale.Discount = request.Discount;

        dbContext.SaleMedicaments.RemoveRange(sale.SaleMedicaments);
        foreach (var item in request.SaleMedicaments)
        {
            var saleItemDetail = new SaleMedicament
            {
                MedicamentId = item.MedicamentId,
                Quantity = item.Quantity,
                PPV = item.PPV,
                Discount = item.Discount,
                TotalPrice = item.TotalPrice,
                TVA = item.TVA,
            };

            sale.SaleMedicaments.Add(saleItemDetail);

            if (request.Status == "Paid")
            {
                await medicamentService.CreateMedicamentHistoryAsync(new StockHistoryCreateDto()
                {
                    MedicamentId = item.MedicamentId,
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