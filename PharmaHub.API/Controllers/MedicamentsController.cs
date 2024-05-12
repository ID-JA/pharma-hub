using Microsoft.AspNetCore.Authorization;
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
            Family = request.Familly,
            UsedBy = request.UsedBy,
            WithPrescription = request.WithPrescription,

        };
        await medicamentService.AddAsync(enity, cancellationToken);
        return Created();
    }
}
