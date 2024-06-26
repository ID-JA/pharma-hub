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
        var result = await medicationService.GetMedicationDetails(id, cancellationToken);
        return result is not null ? Ok(result) : NotFound();
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateMedicament([FromBody] MedicationUpdateDto request, [FromRoute] int id, CancellationToken cancellationToken)
    {
        var medicament = await medicationService.GetByIdAsync(id, cancellationToken);
        if (medicament is null)
        {
            return NotFound();
        }

        medicament.Name = request.Details.Name;
        medicament.Dci = request.Details.Dci;
        medicament.Form = request.Details.Form;
        medicament.Tva = request.Details.Tva;
        medicament.DiscountRate = 0; // request.DiscountRate, this should be deleted because it belongs to inventory
        medicament.Pbr = request.Details.Pbr;
        medicament.Type = request.Details.Type;
        medicament.Marge = request.Details.Marge;
        medicament.Barcode = request.Details.Barcode;
        medicament.Family = request.Details.Family;
        medicament.UsedBy = request.Details.UsedBy;
        medicament.WithPrescription = request.Details.WithPrescription.Equals("yes") ? true : false;
        medicament.Laboratory = request.Details.Laboratory;
        medicament.Dosage = request.Details.Dosage;
        medicament.OrderSystem = request.Details.OrderSystem;

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

    [HttpPatch("{id:int}")]
    public async Task<ActionResult> SetupMedicationPartialSale([FromRoute] int id, [FromBody] PartialSaleMedicationConfig request, CancellationToken cancellationToken)
    {
        await medicationService.SetupMedicationPartialSale(id, request, cancellationToken);
        return Ok();
    }


}
