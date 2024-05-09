using Microsoft.AspNetCore.Mvc;

namespace PharmaHub.API;

[Route("api/[controller]")]
[ApiController]
public class UsersController(IUserSerivce userSerivce) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult> GetUsers()
    {
        return Ok(await userSerivce.GetUsersAsync());
    }
}
