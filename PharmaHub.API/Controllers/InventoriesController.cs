using PharmaHub.API.Services;

namespace PharmaHub.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class InventoriesController(IInventoryService inventoryService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult> SearchInventories([FromQuery] string? medicament, CancellationToken cancellationToken)
    {
        return Ok(await inventoryService.SearchInventoryAsync(medicament, cancellationToken));
    }

    [HttpGet("search")]
    public async Task<ActionResult> InventoriesByType([FromQuery] string? type, CancellationToken cancellationToken)
    {
        return Ok(await inventoryService.InventoriesByType(type, cancellationToken));
    }
}
