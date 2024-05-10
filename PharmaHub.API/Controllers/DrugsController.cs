using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace PharmaHub.API.Controllers;

[Route("/api/[controller]")]
[ApiController]
[Authorize]
public class DrugsController(IDrugService drugService) : ControllerBase
{

    [HttpPost]
    public async Task<ActionResult> CreateDrug([FromBody] CreateDrugRequest request, CancellationToken cancellationToken)
    {
        await drugService.CreateDrugAsync(request, cancellationToken);
        return Created();
    }
}
