namespace PharmaHub.API.Services.Interfaces;

public interface ISaleService
{
    Task CreateSale(CreateSaleRequest request);
}


public class SaleService(IService<Sale> saleRepository, IService<SaleMedicament> saleMedicamentRepository, ICurrentUser currentUserService) : ISaleService
{
    public async Task CreateSale(CreateSaleRequest request)
    {
        var userId = currentUserService.GetUserId();
        Sale sale = new()
        {
            TotalQuantity = request.TotalQuantity,
            TotalPrice = request.TotalPrice,
            Status = request.Status,
            Discount = request.Discount,
            UserId = userId
        };
        var result = await saleRepository.AddAsync(sale);

        if (result is not null)
        {
            foreach (var item in request.SaleItems)
            {
                var saleMedicament = new SaleMedicament
                {
                    SaleId = result.Id,
                    MedicamentId = item.MedicamentId,
                    Quantity = item.Quantity,
                    PPV = item.PPV,
                    Discount = item.Discount
                };
                await saleMedicamentRepository.AddAsync(saleMedicament);
            }
        }

    }
}