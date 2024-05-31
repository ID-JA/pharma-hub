using PharmaHub.API.Dtos.Delivery;

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
    public async Task<ActionResult> GetGetDelivery([FromRoute] int id, CancellationToken cancellationToken)
    {
        var result = await deliveryService.GetDeliveryAsync(id, cancellationToken);
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
}
