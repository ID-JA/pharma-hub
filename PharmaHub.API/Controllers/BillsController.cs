

namespace PharmaHub.API.Controllers;
[Route("api/[Controller]")]
[ApiController]
[Authorize]
public class BillsController(IBillService billService) : ControllerBase
{
  [HttpPost]
  public async Task<ActionResult> CreateBill([FromBody] CreateBillDto request, CancellationToken cancellationToken)
  {
    await billService.CreateBillAsync(request, cancellationToken);
    return NoContent();
  }
  [HttpGet("{id:int}")]
  public async Task<ActionResult> GetBillAsync([FromRoute] int id, CancellationToken cancellationToken)
  {
    var result = await billService.GetBillAsync(id, cancellationToken);
    return result != null ? Ok(result) : NotFound();
  }

}

