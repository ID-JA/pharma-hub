namespace PharmaHub.API;
[Route("api/[Controller]")]
[ApiController]
[Authorize]
public class ClientController(IClientService clientService) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult> CreateClient([FromBody] ClientCreateDto request, CancellationToken cancellationToken)
    {
        await clientService.CreateClientAsync(request, cancellationToken);
        return NoContent();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult> GetClientAsync([FromRoute] int id, CancellationToken cancellationToken)
    {
        var result = await clientService.GetClientAsync(id, cancellationToken);
        return result != null ? Ok(result) : NotFound();

    }
    [HttpGet]

    public async Task<ActionResult> GetClientsAsync(CancellationToken cancellationToken, [FromQuery] int pageNumber, [FromQuery] int pageSize)
    {
        return Ok(await clientService.GetClientsAsync(pageNumber, pageSize, cancellationToken));
    }
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteClient([FromRoute] int id, CancellationToken cancellationToken)
    {
        var result = await clientService.DeleteClient(id, cancellationToken);
        return result ? Ok(result) : NotFound();
    }
    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateClient([FromRoute] int id, [FromBody] ClientUpdateDto request, CancellationToken cancellationToken)
    {
        var result = await clientService.UpdateClient(id, request, cancellationToken);
        return result ? Ok(result) : NotFound();
    }
}

