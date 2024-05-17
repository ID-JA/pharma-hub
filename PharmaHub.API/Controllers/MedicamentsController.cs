using Microsoft.AspNetCore.Mvc;

namespace PharmaHub.API.Controllers;

[Route("/api/[controller]")]
[ApiController]
public class MedicamentsController(IMedicamentService medicamentService, IService<DCI> dciService, IService<Form> formService) : ControllerBase
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
    public async Task<ActionResult> GetAllMedicaments([FromQuery] SearchQuery query, CancellationToken cancellationToken)
    {
        return Ok(await medicamentService.SearchMedicamentsAsync(query, cancellationToken));
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



    [HttpPost("dcis")]
    public async Task<ActionResult> CreateDCI([FromBody] DCI request, CancellationToken cancellationToken)
    {
        await dciService.AddAsync(request, cancellationToken);
        return NoContent();
    }

    [HttpGet("dcis")]
    public async Task<ActionResult> GetDCIs(CancellationToken cancellationToken) => Ok(await dciService.GetAllAsync(cancellationToken));

    [HttpGet("dcis/{id:int}")]
    public async Task<ActionResult> GetDCI([FromRoute] int id, CancellationToken cancellationToken)
    {
        var entity = await dciService.GetByIdAsync(id, cancellationToken);
        if (entity is null)
            return NotFound();

        return Ok(entity);
    }

    [HttpPut("dcis/{id:int}")]
    public async Task<ActionResult> UpdateDCI([FromRoute] int id, [FromBody] DCI request, CancellationToken cancellationToken)
    {
        var entity = await dciService.GetByIdAsync(id, cancellationToken);
        if (entity is null)
            return NotFound();

        entity.Name = request.Name;
        entity.Description = request.Description;

        await dciService.UpdateAsync(entity, cancellationToken);
        return Ok(entity);
    }

    [HttpDelete("dcis/{id:int}")]
    public async Task<ActionResult> DeleteDCI(int id, CancellationToken cancellationToken)
    {
        var dci = await dciService.GetByIdAsync(id, cancellationToken);

        if (dci is null)
            return NotFound();

        await dciService.DeleteAsync(dci, cancellationToken);
        return NoContent();
    }


    [HttpPost("forms")]
    public async Task<ActionResult> CreateForm([FromBody] Form request, CancellationToken cancellationToken)
    {
        await formService.AddAsync(request, cancellationToken);
        return NoContent();
    }

    [HttpGet("forms")]
    public async Task<ActionResult> GetFroms(CancellationToken cancellationToken) => Ok(await formService.GetAllAsync(cancellationToken));

    [HttpGet("forms/{id:int}")]
    public async Task<ActionResult> GetForm([FromRoute] int id, CancellationToken cancellationToken)
    {
        var entity = await formService.GetByIdAsync(id, cancellationToken);
        if (entity is null)
            return NotFound();

        return Ok(entity);
    }

    [HttpPut("forms/{id:int}")]
    public async Task<ActionResult> UpdateForm([FromRoute] int id, [FromBody] Form request, CancellationToken cancellationToken)
    {
        var entity = await formService.GetByIdAsync(id, cancellationToken);
        if (entity is null)
            return NotFound();

        entity.Name = request.Name;
        entity.Description = request.Description;

        await formService.UpdateAsync(entity, cancellationToken);
        return Ok(entity);
    }

    [HttpDelete("forms/{id:int}")]
    public async Task<ActionResult> DeleteForm(int id, CancellationToken cancellationToken)
    {
        var dci = await formService.GetByIdAsync(id, cancellationToken);

        if (dci is null)
            return NotFound();

        await formService.DeleteAsync(dci, cancellationToken);
        return NoContent();
    }


}
