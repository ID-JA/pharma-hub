
namespace PharmaHub.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class SalesController(ISaleService saleService) : ControllerBase
{

    [HttpPost]
    [MustHavePermission(AppAction.Create, AppResource.Sales)]
    public async Task<ActionResult> CreateSale([FromBody] CreateSaleRequest request)
    {
        await saleService.CreateSale(request);
        return Ok();
    }
}
