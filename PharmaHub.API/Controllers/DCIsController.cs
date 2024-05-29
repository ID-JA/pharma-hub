namespace PharmaHub.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class DcIsController(IDciService dCiService) : ControllerBase
{

  [HttpPost]
  public async Task<ActionResult> CreateDciAsync([FromBody] DciDto request, CancellationToken cancellationToken)
  {
    await dCiService.CreateDciAsync(request, cancellationToken);

    return NoContent();
  }

  [HttpGet("{id:int}")]
  public async Task<ActionResult> GetDciAsync([FromRoute] int id, CancellationToken cancellationToken)
  {
    var result = await dCiService.GetDciAsync(id, cancellationToken);
    return result != null ? Ok(result) : NotFound();
  }

  [HttpPut("{id:int}")]
  public async Task<ActionResult> UpdateDci([FromRoute] int id, [FromBody] DciDto request, CancellationToken cancellationToken)
  {
    var result = await dCiService.UpdateDci(id, request, cancellationToken);
    return result ? Ok(result) : NotFound();
  }

  [HttpDelete("{id:int}")]
  public async Task<ActionResult> DeleteDci([FromRoute] int id, CancellationToken cancellationToken)
  {
    var result = await dCiService.DeleteDci(id, cancellationToken);
    return result ? Ok(result) : NotFound();
  }
  [HttpGet]
  public async Task<ActionResult> GetAllDcIsNames(CancellationToken cancellationToken, [FromQuery] string query = "")
  {
    return Ok(await dCiService.GetDcIs(query, cancellationToken));
  }
}
