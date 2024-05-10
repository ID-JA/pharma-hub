using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace PharmaHub.API.Controllers;

[Route("/api/[controller]")]
[ApiController]
[Authorize]
public class DrugsController(IMedicamentService medicamentService) : ControllerBase
{

    [HttpPost]
    public async Task<ActionResult> CreateDrug([FromBody] CreateMedicamentRequest request, CancellationToken cancellationToken)
    {
        await medicamentService.CreateMedicamentAsync(request, cancellationToken);
        return Created();
    }
}
