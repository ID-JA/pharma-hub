using PharmaHub.API.Dtos.Order;

namespace PharmaHub.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class OrdersController(IOrderService orderService) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult> CreateOrder([FromBody] OrderCreateDto request, CancellationToken cancellationToken)
    {
        await orderService.CreateOrderAsync(request, cancellationToken);

        return NoContent();
    }

    [HttpGet]
    [MustHavePermission(AppAction.View, AppResource.Orders)]
    public async Task<ActionResult> GetOrders(CancellationToken cancellationToken, [FromQuery] DateTime from, [FromQuery] DateTime to, [FromQuery] int supplier, [FromQuery] int pageNumber, [FromQuery] int pageSize)
    {
        return Ok(await orderService.GetOrdersAsync(from, to, supplier, pageNumber, pageSize, cancellationToken));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult> GetOrders([FromRoute] int id, CancellationToken cancellationToken)
    {
        var result = await orderService.GetOrderAsync(id, cancellationToken);
        return result != null ? Ok(result) : NotFound();
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateOrder([FromRoute] int id, [FromBody] OrderUpdateDto request, CancellationToken cancellationToken)
    {
        var result = await orderService.UpdateOrder(id, request, cancellationToken);
        return result ? Ok(result) : NotFound();
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteOrder([FromRoute] int id, CancellationToken cancellationToken)
    {
        var result = await orderService.DeleteOrder(id, cancellationToken);
        return result ? Ok(result) : NotFound();
    }
}
