using Microsoft.EntityFrameworkCore;
using PharmaHub.API.Services;
namespace PharmaHub.API.Controllers;

[Route("api/[controller]")]
[ApiController]

public class GenerateSalesController(ApplicationDbContext applicationDbContext, GenerateSaleService generateSaleService) : ControllerBase
{


  [HttpGet("{saleId}")]
  public IActionResult GeneratePdf(int saleId)
  {
    var sale = applicationDbContext.Sales
        .Include(s => s.User)
        .Include(s => s.SaleMedications)
            .ThenInclude(sm => sm.Inventory)
                .ThenInclude(i => i.Medication) // Assuming Inventory has a Medication with a Name property
        .FirstOrDefault(s => s.Id == saleId);

    if (sale == null)
    {
      return NotFound();
    }

    var pdf = generateSaleService.GenerateSalesReport(sale);

    return File(pdf, "application/pdf", $"SalesReport_{saleId}.pdf");
  }
}



