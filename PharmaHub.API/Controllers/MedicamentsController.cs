using PharmaHub.API.Dtos.Inventory;
using PharmaHub.API.Dtos.Medicament;

namespace PharmaHub.API.Controllers;

[Route("/api/[controller]")]
[ApiController]
public class MedicamentsController(IMedicationService medicationService, IService<Dci> dciService, IService<Form> formService) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult> CreateDrug([FromBody] MedicationCreateDto request, CancellationToken cancellationToken)
    {
        await medicationService.CreateMedicament(request);
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

        return Ok(await medicationService.SearchMedicationsAsync(searchQuery, cancellationToken));
    }

    [HttpGet("search/names")]
    public async Task<ActionResult> GetAllMedicamentsNames(CancellationToken cancellationToken, [FromQuery] string query = "")
    {
        return Ok(await medicationService.GetMedicationsBasicInfo(query, cancellationToken));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult> GetMedicament([FromRoute] int id, CancellationToken cancellationToken)
    {
        return Ok(await medicationService.GetByIdAsync(id, cancellationToken));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateMedicament([FromBody] MedicationUpdateDto request, [FromRoute] int id, CancellationToken cancellationToken)
    {
        var medicament = await medicationService.GetByIdAsync(id, cancellationToken);
        if (medicament is null)
        {
            return NotFound();
        }

        medicament.Name = request.Detials.Name;
        medicament.Dci = request.Detials.Dci;
        medicament.Form = request.Detials.Form;
        medicament.Tva = request.Detials.Tva;
        medicament.DiscountRate = 0; // request.DiscountRate, this should be deleted because it belongs to inventory
        medicament.Pbr = request.Detials.Pbr;
        medicament.Type = request.Detials.Type;
        medicament.Marge = request.Detials.Marge;
        medicament.Barcode = request.Detials.Barcode;
        medicament.Family = request.Detials.Family;
        medicament.UsedBy = request.Detials.UsedBy;
        medicament.WithPrescription = request.Detials.WithPrescription;

        await medicationService.UpdateAsync(medicament, cancellationToken);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteMedicament([FromRoute] int id, CancellationToken cancellationToken)
    {
        var medicament = await medicationService.GetByIdAsync(id, cancellationToken);
        if (medicament is null)
        {
            return NotFound();
        }
        await medicationService.DeleteAsync(medicament, cancellationToken);
        return NoContent();
    }

    [HttpGet("{id:int}/inventories")]
    public async Task<ActionResult> GetMedicamentInventories([FromRoute] int id, CancellationToken cancellationToken)
    {
        return Ok(await medicationService.GetMedicamentInventories(id, cancellationToken));
    }

    [HttpPost("{id:int}/inventories")]
    public async Task<ActionResult> CreateMedicamentInventory([FromRoute] int id, [FromBody] InventoryCreateDto request, CancellationToken cancellationToken)
    {
        return Ok(await medicationService.CreateMedicamentInventory(id, request, cancellationToken));
    }

    [HttpDelete("{id:int}/inventories/{inventoryId:int}")]
    public async Task<ActionResult> DeleteMedicamentInventory(int id, [FromRoute] int inventoryId, CancellationToken cancellationToken)
    {
        return Ok(await medicationService.DeleteMedicamentInventory(inventoryId, cancellationToken));
    }

    [HttpPut("{id:int}/inventories/{inventoryId:int}")]
    public async Task<ActionResult> UpdateMedicamentInventory(int id, [FromRoute] int inventoryId, [FromBody] InventoryUpdateDto request, CancellationToken cancellationToken)
    {
        return Ok(await medicationService.UpdateMedicamentInventory(inventoryId, request, cancellationToken));
    }
}
