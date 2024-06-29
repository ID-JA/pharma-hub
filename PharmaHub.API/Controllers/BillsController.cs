

namespace PharmaHub.API.Controllers;
[Route("api/[Controller]")]
[ApiController]
[Authorize]
public class BillsController(IBillService billService) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult> CreateBill([FromBody] BillCreateDto request, CancellationToken cancellationToken)
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
    [HttpGet]

    public async Task<ActionResult> GetBillsAsync(CancellationToken cancellationToken, [FromQuery] int pageNumber, [FromQuery] int pageSize)
    {
        return Ok(await billService.GetBillsAsync(pageNumber, pageSize, cancellationToken));
    }
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteBill([FromRoute] int id, CancellationToken cancellationToken)
    {
        var result = await billService.DeleteBill(id, cancellationToken);
        return result ? Ok(result) : NotFound();
    }
    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateBill([FromRoute] int id, [FromBody] BillUpdateDto request, CancellationToken cancellationToken)
    {
        var result = await billService.UpdateBill(id, request, cancellationToken);
        return result ? Ok(result) : NotFound();
    }
}

