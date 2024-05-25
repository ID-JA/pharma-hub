namespace PharmaHub.API;
[Route("api/[controller]")]
[ApiController]
[Authorize]
public class FamiliesController(IFamilyService familyService) : ControllerBase
{

  [HttpPost]
  public async Task<ActionResult> CreateFamilyAsync([FromBody] FamilyDto request, CancellationToken cancellationToken)
  {
    await familyService.CreateFamilyAsync(request, cancellationToken);

    return NoContent();
  }

  [HttpGet("{id:int}")]
  public async Task<ActionResult> GetFamilyAsync([FromRoute] int id, CancellationToken cancellationToken)
  {
    var result = await familyService.GetFamilyAsync(id, cancellationToken);
    return result != null ? Ok(result) : NotFound();
  }

  [HttpPut("{id:int}")]
  public async Task<ActionResult> UpdateFamily([FromRoute] int id, [FromBody] FamilyDto request, CancellationToken cancellationToken)
  {
    var result = await familyService.UpdateFamily(id, request, cancellationToken);
    return result ? Ok(result) : NotFound();
  }

  [HttpDelete("{id:int}")]
  public async Task<ActionResult> DeleteFamily([FromRoute] int id, CancellationToken cancellationToken)
  {
    var result = await familyService.DeleteFamily(id, cancellationToken);
    return result ? Ok(result) : NotFound();
  }
  [HttpGet("search/names")]
  public async Task<ActionResult> GetAllFamiliesNames(CancellationToken cancellationToken, [FromQuery] string query = "")
  {
    return Ok(await familyService.GetFamiliesNames(query, cancellationToken));
  }
}
