namespace PharmaHub.API;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class TypesController(ITypeService typeService) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult> CreateTypeAsync([FromBody] TypeDto request, CancellationToken cancellationToken)
    {
        await typeService.CreateTypeAsync(request, cancellationToken);

        return NoContent();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult> GetTypeAsync([FromRoute] int id, CancellationToken cancellationToken)
    {
        var result = await typeService.GetTypeByIdAsync(id, cancellationToken);
        return result != null ? Ok(result) : NotFound();
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateType([FromRoute] int id, [FromBody] TypeDto request, CancellationToken cancellationToken)
    {
        var result = await typeService.UpdateType(id, request, cancellationToken);
        return result ? Ok(result) : NotFound();
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteType([FromRoute] int id, CancellationToken cancellationToken)
    {
        var result = await typeService.DeleteType(id, cancellationToken);
        return result ? Ok(result) : NotFound();
    }

    [HttpGet]
    public async Task<ActionResult> GetTaxes(CancellationToken cancellationToken, [FromQuery] string query = "", string field = "all")
    {
        if (field.Equals("name"))
        {
            return Ok(await typeService.GetTaxes<TypeNameDto>(query, cancellationToken));
        }
        return Ok(await typeService.GetTaxes<TypeDto>(query, cancellationToken));
    }
}
