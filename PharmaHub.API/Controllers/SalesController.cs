using PharmaHub.API.Dtos.Sale;
using QuestPDF.Fluent;

namespace PharmaHub.API.Controllers;

[Route("/api/[controller]")]
[ApiController]
[Authorize]
public class SalesController(ISaleService saleService) : ControllerBase
{

    [HttpPost]
    [MustHavePermission(AppAction.Create, AppResource.Sales)]
    public async Task<ActionResult> CreateSale([FromBody] SaleCreateDto request)
    {
        await saleService.CreateSale(request);
        return Ok();
    }

    [HttpGet]
    [MustHavePermission(AppAction.View, AppResource.Sales)]
    public async Task<ActionResult> GetSales(
       [FromQuery] DateTime? from,
       [FromQuery] DateTime? to,
       [FromQuery] int? saleNumber,
       CancellationToken cancellationToken)
    {
        var sales = await saleService.GetSalesAsync(from, to, saleNumber, cancellationToken);
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
    public async Task<FileStreamResult?> GetPDF(int id)
    {
        var sale = await saleService.GetSaleAsync(id, CancellationToken.None);
        if (sale is null) return null;
        var document = new SaleTicketDocment(sale.ToEntity());
        byte[] pdfBytes = document.GeneratePdf();
        MemoryStream ms = new MemoryStream(pdfBytes);
        return new FileStreamResult(ms, "application/pdf");
    }

}
