namespace PharmaHub.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class DCIsController(IDCIService dCIService) : ControllerBase
{

  [HttpPost]
  public async Task<ActionResult> CreateDCIAsync([FromBody] DCIDto request, CancellationToken cancellationToken)
  {
    await dCIService.CreateDCIAsync(request, cancellationToken);

    return NoContent();
  }

  [HttpGet("{id:int}")]
  public async Task<ActionResult> GetDCIAsync([FromRoute] int id, CancellationToken cancellationToken)
  {
    var result = await dCIService.GetDCIAsync(id, cancellationToken);
    return result != null ? Ok(result) : NotFound();
  }

  [HttpPut("{id:int}")]
  public async Task<ActionResult> UpdateDCI([FromRoute] int id, [FromBody] DCIDto request, CancellationToken cancellationToken)
  {
    var result = await dCIService.UpdateDCI(id, request, cancellationToken);
    return result ? Ok(result) : NotFound();
  }

  [HttpDelete("{id:int}")]
  public async Task<ActionResult> DeleteDCI([FromRoute] int id, CancellationToken cancellationToken)
  {
    var result = await dCIService.DeleteDCI(id, cancellationToken);
    return result ? Ok(result) : NotFound();
  }

}
