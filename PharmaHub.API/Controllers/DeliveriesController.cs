using PharmaHub.API.Dtos.Delivery;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace PharmaHub.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class DeliveriesController(IDeliveryService deliveryService) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult> CreateDelivery([FromBody] DeliveryCreateDto request, CancellationToken cancellationToken)
    {
        await deliveryService.CreateDeliveryAsync(request, cancellationToken);

        return NoContent();
    }

    [HttpGet]
    [MustHavePermission(AppAction.View, AppResource.Orders)]
    public async Task<ActionResult> GetDeliveries(CancellationToken cancellationToken, [FromQuery] DateTime from, [FromQuery] DateTime to, [FromQuery] int supplier, [FromQuery] int pageNumber, [FromQuery] int pageSize)
    {
        return Ok(await deliveryService.GetDeliveriesAsync(from, to, supplier, pageNumber, pageSize, cancellationToken));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult> GetGetDeliveryById([FromRoute] int id, CancellationToken cancellationToken)
    {
        var result = await deliveryService.GetDeliveryByIdAsync(id, cancellationToken);
        return result != null ? Ok(result) : NotFound();
    }


    [HttpGet("search")]
    public async Task<ActionResult> GetGetDelivery([FromQuery] int deliveryNumber, CancellationToken cancellationToken)
    {
        var result = await deliveryService.GetDeliveryDetails(deliveryNumber, cancellationToken);
        return result != null ? Ok(result) : NotFound();
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateDelivery([FromRoute] int id, [FromBody] DeliveryUpdateDto request, CancellationToken cancellationToken)
    {
        var result = await deliveryService.UpdateDelivery(id, request, cancellationToken);
        return result ? Ok(result) : NotFound();
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteDelivery([FromRoute] int id, CancellationToken cancellationToken)
    {
        var result = await deliveryService.DeleteDelivery(id, cancellationToken);
        return result ? Ok(result) : NotFound();
    }

    [HttpPost("orders")]
    public async Task<ActionResult> CreateOrder([FromBody] OrderCreateDto request, CancellationToken cancellationToken)
    {
        await deliveryService.CreateOrder(request, cancellationToken);
        return NoContent();
    }

    [HttpGet("orders")]
    public async Task<ActionResult> GetOrders([FromQuery] string? status, [FromQuery] int supplier, [FromQuery] DateTime from, [FromQuery] DateTime to, CancellationToken cancellationToken)
    {
        OrderSearchQuery searchQuery = new()
        {
            Status = status,
            Supplier = supplier,
            From = from,
            To = to,
        };
        return Ok(await deliveryService.GetOrders(searchQuery, cancellationToken));
    }

    [HttpGet("orders/pdf")]
    public FileStreamResult GetPDF()
    {
        Document document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(20));
                page.Header()
                    .Text("Hello PDF!")
                    .SemiBold().FontSize(36).FontColor(Colors.Blue.Medium);

                page.Content()
                    .PaddingVertical(1, Unit.Centimetre)
                    .Column(x =>
                    {
                        x.Spacing(20);

                        x.Item().Text(Placeholders.LoremIpsum());
                        x.Item().Image(Placeholders.Image(200, 100));
                    });

                page.Footer()
                    .AlignCenter()
                    .Text(x =>
                    {
                        x.Span("Page ");
                        x.CurrentPageNumber();
                    });
            });
        });
        byte[] pdfBytes = document.GeneratePdf();
        MemoryStream ms = new MemoryStream(pdfBytes);
        return new FileStreamResult(ms, "application/pdf");

    }

}
