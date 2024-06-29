namespace PharmaHub.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class FormsController(IFormService formService) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult> CreateFormAsync([FromBody] FormDto request, CancellationToken cancellationToken)
    {
        await formService.CreateFormAsync(request, cancellationToken);

        return NoContent();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult> GetFormAsync([FromRoute] int id, CancellationToken cancellationToken)
    {
        var result = await formService.GetFormAsync(id, cancellationToken);
        return result != null ? Ok(result) : NotFound();
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateForm([FromRoute] int id, [FromBody] FormDto request, CancellationToken cancellationToken)
    {
        var result = await formService.UpdateForm(id, request, cancellationToken);
        return result ? Ok(result) : NotFound();
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteForm([FromRoute] int id, CancellationToken cancellationToken)
    {
        var result = await formService.DeleteForm(id, cancellationToken);
        return result ? Ok(result) : NotFound();
    }
    [HttpGet]
    public async Task<ActionResult> GetForms(CancellationToken cancellationToken, [FromQuery] string query = "")
    {
        return Ok(await formService.GetForms(query, cancellationToken));
    }
}
