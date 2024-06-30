﻿using PharmaHub.API.Dtos.Delivery;
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
    public async Task<ActionResult> GetDeliveries([FromQuery] int? deliveryNumber, [FromQuery] DateTime? from, [FromQuery] DateTime? to, [FromQuery] int? supplierId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, [FromQuery] string status = "pending", CancellationToken cancellationToken = default)
    {
        return Ok(await deliveryService.GetDeliveriesAsync(deliveryNumber, from, to, supplierId, pageNumber, pageSize, status, cancellationToken));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult> GetDeliveryById([FromRoute] int id, CancellationToken cancellationToken)
    {
        var result = await deliveryService.GetDeliveryByIdAsync(id, cancellationToken);
        return result != null ? Ok(result) : NotFound();
    }


    [HttpGet("search")]
    public async Task<ActionResult> GetDelivery([FromQuery] int deliveryNumber, CancellationToken cancellationToken)
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
    [HttpGet("orders/search")]
    public async Task<ActionResult> SearchOrdersAsync(
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to,
        [FromQuery] int? supplierId,
        [FromQuery] string? status,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        OrderSearchQuery searchQuery = new()
        {
            Status = status,
            Supplier = supplierId,
            From = from,
            To = to,
        };
        return Ok(await deliveryService.SearchOrdersAsync(searchQuery, pageNumber, pageSize, cancellationToken));
    }
    [HttpGet("analytics")]
    public async Task<ActionResult> GetOrdersAndDeliveriesByDateRangeAsync([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, CancellationToken cancellationToken)
    {
        return Ok(await deliveryService.GetOrdersAndDeliveriesByDateRangeAsync(startDate, endDate));
    }

    [HttpGet("document")]
    public async Task<IActionResult> GetDeliveryDocument([FromQuery] int deliveryNumber, CancellationToken cancellationToken)
    {
        var delivery = await deliveryService.GetDeliveryDetails(deliveryNumber, cancellationToken);
        if (delivery is null) return NotFound();

        var document = new DeliveryDocument(delivery.ToEntity());
        var pdfBytes = document.GeneratePdf();
        var base64String = Convert.ToBase64String(pdfBytes);

        return Ok(new { Base64 = base64String });
    }

}
