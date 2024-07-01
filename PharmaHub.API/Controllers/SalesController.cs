using PharmaHub.API.Dtos.Sale;
using QuestPDF.Fluent;

namespace PharmaHub.API.Controllers;

[Route("/api/[controller]")]
[ApiController]
[Authorize]
public class SalesController(ISaleService saleService, IAppSettingService settingService) : ControllerBase
{

    [HttpPost]
    [MustHavePermission(AppAction.Create, AppResource.Sales)]
    public async Task<ActionResult> CreateSale([FromBody] SaleCreateDto request)
    {
        var saleId = await saleService.CreateSale(request);
        return Ok(new { saleId });
    }

    [HttpGet]
    [MustHavePermission(AppAction.View, AppResource.Sales)]
    public async Task<ActionResult> GetSales(
       [FromQuery] DateTime? from,
       [FromQuery] DateTime? to,
       [FromQuery] int? saleNumber,
       [FromQuery] string? status,
       CancellationToken cancellationToken)
    {
        var sales = await saleService.GetSalesAsync(from, to, saleNumber, status, cancellationToken);
        return Ok(sales);
    }

    [HttpDelete("cancel")]
    [MustHavePermission(AppAction.View, AppResource.Sales)]
    public async Task<ActionResult> GetSales(
       [FromQuery] int saleId,
       [FromQuery] int? saleItemId,
       CancellationToken cancellationToken)
    {
        await saleService.CancelSale(saleId, saleItemId, cancellationToken);
        return Ok();
    }

    [HttpGet("{id:int}")]
    [MustHavePermission(AppAction.View, AppResource.Sales)]
    public async Task<ActionResult> GetSale(int id, CancellationToken cancellationToken)
    {
        var result = await saleService.GetSaleAsync(id, cancellationToken);
        return result is not null ? Ok(result) : NotFound();
    }

    [HttpDelete("{id:int}")]
    [MustHavePermission(AppAction.View, AppResource.Sales)]
    public async Task<ActionResult> DeleteSale(int id, CancellationToken cancellationToken)
    {
        await saleService.DeleteSale(id, cancellationToken);
        return NoContent();
    }

    [HttpPut("{id:int}")]
    [MustHavePermission(AppAction.View, AppResource.Sales)]
    public async Task<ActionResult> UpdateSale([FromRoute] int id, [FromBody] SaleUpdateDto request, CancellationToken cancellationToken)
    {
        var result = await saleService.UpdateSale(id, request, cancellationToken);
        return !result ? NotFound() : NoContent();
    }
    [HttpGet("next")]
    [MustHavePermission(AppAction.View, AppResource.Sales)]
    public async Task<ActionResult> GetNextSaleNumberAsync(CancellationToken cancellationToken)
    {
        return Ok(await saleService.GetNextSaleNumberAsync(cancellationToken));
    }

    [HttpGet("count")]
    [MustHavePermission(AppAction.View, AppResource.Sales)]
    public async Task<ActionResult> GetSalesCountByDateRange([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, CancellationToken cancellationToken)
    {
        var salesCountByDateRange = await saleService.GetSalesCountByDateRangeAsync(startDate, endDate, cancellationToken);
        return Ok(salesCountByDateRange);
    }


    [HttpGet("{id:int}/ticket")]
    public async Task<IActionResult> GetPDF(int id)
    {
        var sale = await saleService.GetSaleAsync(id, CancellationToken.None);
        if (sale is null) return NotFound();

        var settings = await settingService.GetAllSettings();
        var settingsDictionary = settings.ToDictionary(s => s.SettingKey, s => s.SettingValue);

        var document = new SaleTicketDocument(sale.ToEntity(), settingsDictionary);
        var pdfBytes = document.GeneratePdf();

        var base64String = Convert.ToBase64String(pdfBytes);

        return Ok(new { Base64 = base64String });
    }
}
