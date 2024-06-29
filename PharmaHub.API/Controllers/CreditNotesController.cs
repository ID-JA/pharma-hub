namespace PharmaHub.API;

[Route("api/credit-notes")]
[ApiController]
[Authorize]
public class CreditNotesController(ICreditNoteService creditNoteService) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult> CreateCreditNote([FromBody] CreditNoteCreateDto request, CancellationToken cancellationToken)
    {
        await creditNoteService.CreateCreditNoteAsync(request, cancellationToken);
        return NoContent();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult> GetCreditNoteAsync([FromRoute] int id, CancellationToken cancellationToken)
    {
        var result = await creditNoteService.GetCreditNoteAsync(id, cancellationToken);
        return result != null ? Ok(result) : NotFound();

    }

    [HttpGet]
    public async Task<ActionResult> GetCreditNotesAsync([FromQuery] int? creditNoteNumber, [FromQuery] DateTime? from, [FromQuery] DateTime? to, [FromQuery] int? supplierId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
    {
        var result = await creditNoteService.SearchCreditNoteDetailsAsync(creditNoteNumber, from, to, supplierId, pageNumber, pageSize, cancellationToken);

        return Ok(result);
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteCreditNote([FromRoute] int id, CancellationToken cancellationToken)
    {
        var result = await creditNoteService.DeleteCreditNote(id, cancellationToken);
        return result ? Ok(result) : NotFound();
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateCreditNote([FromRoute] int id, [FromBody] CreditNoteUpdateDto request, CancellationToken cancellationToken)
    {
        var result = await creditNoteService.UpdateCreditNote(id, request, cancellationToken);
        return result ? Ok(result) : NotFound();
    }

    [HttpGet("search")]
    public async Task<ActionResult> GetCreditNote([FromQuery] int creditNoteNumber, CancellationToken cancellationToken)
    {
        var result = await creditNoteService.GetCreditNoteDetails(creditNoteNumber, cancellationToken);
        return result != null ? Ok(result) : NotFound();
    }
}

