using Microsoft.AspNetCore.Mvc;

namespace PharmaHub.API.Controllers;

[Route("/api/[controller]")]
[ApiController]
public class MedicamentsController(IMedicamentService medicamentService) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult> CreateDrug([FromBody] CreateMedicamentRequest request, CancellationToken cancellationToken)
    {
        Medicament enity = new()
        {
            Name = request.Name,
            DCI = request.DCI,
            Form = request.Form,
            PPV = request.PPV,
            PPH = request.PPH,
            TVA = request.TVA,
            Discount = request.Discount,
            PBR = request.PBR,
            Type = request.Type,
            Marge = request.Marge,
            Codebar = request.Codebar,
            Family = request.Family,
            UsedBy = request.UsedBy,
            WithPrescription = request.WithPrescription,

        };
        await medicamentService.AddAsync(enity, cancellationToken);
        return Created();
    }

    [HttpGet]
    public async Task<ActionResult> GetAllMedicaments(CancellationToken cancellationToken)
    {
        return Ok(await medicamentService.GetAllAsync(cancellationToken));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult> GetMedicament([FromRoute] int id, CancellationToken cancellationToken)
    {
        return Ok(await medicamentService.GetByIdAsync(id, cancellationToken));
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

    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateMedicament([FromBody] CreateMedicamentRequest request, [FromRoute] int id, CancellationToken cancellationToken)
    {
        var medicament = await medicamentService.GetByIdAsync(id, cancellationToken);
        if (medicament is null)
        {
            return NotFound();
        }

        medicament.Name = request.Name;
        medicament.DCI = request.DCI;
        medicament.Form = request.Form;
        medicament.PPV = request.PPV;
        medicament.PPH = request.PPH;
        medicament.TVA = request.TVA;
        medicament.Discount = request.Discount;
        medicament.PBR = request.PBR;
        medicament.Type = request.Type;
        medicament.Marge = request.Marge;
        medicament.Codebar = request.Codebar;
        medicament.Family = request.Family;
        medicament.UsedBy = request.UsedBy;
        medicament.WithPrescription = request.WithPrescription;

        await medicamentService.UpdateAsync(medicament, cancellationToken);
        return NoContent();
    }
}
