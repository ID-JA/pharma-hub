namespace PharmaHub.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class SectionsController(ISectionService sectionService) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult> CreateSectionAsync([FromBody] SectionDto request, CancellationToken cancellationToken)
    {
        await sectionService.CreateSectionAsync(request, cancellationToken);

        return NoContent();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult> GetSectionAsync([FromRoute] int id, CancellationToken cancellationToken)
    {
        var result = await sectionService.GetSectionAsync(id, cancellationToken);
        return result != null ? Ok(result) : NotFound();
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateSection([FromRoute] int id, [FromBody] SectionDto request, CancellationToken cancellationToken)
    {
        var result = await sectionService.UpdateSection(id, request, cancellationToken);
        return result ? Ok(result) : NotFound();
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteSection([FromRoute] int id, CancellationToken cancellationToken)
    {
        var result = await sectionService.DeleteSection(id, cancellationToken);
        return result ? Ok(result) : NotFound();
    }
    [HttpGet]
    public async Task<ActionResult> GetSections(CancellationToken cancellationToken, [FromQuery] string query = "")
    {
        return Ok(await sectionService.GetSections(query, cancellationToken));
    }
}
