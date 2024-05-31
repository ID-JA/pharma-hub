namespace PharmaHub.API.Controllers;
[Route("api/[Controller]")]
[ApiController]
[Authorize]
public class BillsController(IBillService billService) : ControllerBase
{
  [HttpPost]
  public async Task<ActionResult> Bills([FromBody] CreateBillDto request, CancellationToken cancellationToken)
  {
    await billService.CreateBillAsync(request, cancellationToken);
    return NoContent();
  }
}
