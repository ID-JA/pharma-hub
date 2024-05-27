namespace PharmaHub.API.Controllers;

[Route("/api/[controller]")]
[ApiController]
public class MedicamentsController(IMedicamentService medicamentService, IService<DCI> dciService, IService<Form> formService) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult> CreateDrug([FromBody] CreateMedicamentDto request, CancellationToken cancellationToken)
    {
        await medicamentService.CreateMedicament(request);
        return Created();
    }

    [HttpGet("search")]
    public async Task<ActionResult> GetAllMedicaments(CancellationToken cancellationToken, [FromQuery] string? query = "", [FromQuery] string? field = "")
    {
        var searchQuery = new SearchQuery()
        {
            PageNumber = 1,
            PageSize = 1000,
            Query = query,
            Field = field,
        };

        return Ok(await medicamentService.SearchMedicamentsAsync(searchQuery, cancellationToken));
    }

    [HttpGet("search/names")]
    public async Task<ActionResult> GetAllMedicamentsNames(CancellationToken cancellationToken, [FromQuery] string query = "")
    {
        return Ok(await medicamentService.GetMedicamentsNames(query, cancellationToken));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult> GetMedicament([FromRoute] int id, CancellationToken cancellationToken)
    {
        return Ok(await medicamentService.GetByIdAsync(id, cancellationToken));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateMedicament([FromBody] CreateMedicamentRequest request, [FromRoute] int id, CancellationToken cancellationToken)
    {
        var medicament = await medicamentService.GetByIdAsync(id, cancellationToken);
        if (medicament is null)
        {
            return NotFound();
        }

        medicament.Name = request.Name;
        // medicament.DCI = request.DCI;
        medicament.Form = request.Form;
        medicament.TVA = request.TVA;
        medicament.DiscountRate = request.Discount;
        medicament.PBR = request.PBR;
        medicament.Type = request.Type;
        medicament.Marge = request.Marge;
        medicament.Barcode = request.Barcode;
        medicament.Family = request.Family;
        // medicament.UsedBy = request.UsedBy;
        medicament.WithPrescription = request.WithPrescription;

        await medicamentService.UpdateAsync(medicament, cancellationToken);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteMedicament([FromRoute] int id, CancellationToken cancellationToken)
    {
        var medicament = await medicamentService.GetByIdAsync(id, cancellationToken);
        if (medicament is null)
        {
            return NotFound();
        }
        await medicamentService.DeleteAsync(medicament, cancellationToken);
        return NoContent();
    }

    [HttpGet("{id:int}/inventories")]
    public async Task<ActionResult> GetMedicamentInventories([FromRoute] int id, CancellationToken cancellationToken)
    {
        return Ok(await medicamentService.GetMedicamentInventories(id, cancellationToken));
    }

    [HttpPost("{id:int}/inventories")]
    public async Task<ActionResult> CreateMedicamentInventory([FromRoute] int id, [FromBody] CreateInventoryDto request, CancellationToken cancellationToken)
    {
        return Ok(await medicamentService.CreateMedicamentInventory(id, request, cancellationToken));
    }

    [HttpDelete("{id:int}/inventories/{inventoryId:int}")]
    public async Task<ActionResult> DeleteMedicamentInventory(int id, [FromRoute] int inventoryId, CancellationToken cancellationToken)
    {
        return Ok(await medicamentService.DeleteMedicamentInventory(inventoryId, cancellationToken));
    }

    [HttpPut("{id:int}/inventories/{inventoryId:int}")]
    public async Task<ActionResult> UpdateMedicamentInventory(int id, [FromRoute] int inventoryId, [FromBody] CreateInventoryDto request, CancellationToken cancellationToken)
    {
        return Ok(await medicamentService.UpdateMedicamentInventory(inventoryId, request, cancellationToken));
    }
}
