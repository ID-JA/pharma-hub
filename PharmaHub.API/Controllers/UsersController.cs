using Microsoft.AspNetCore.Mvc;

namespace PharmaHub.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UsersController(IUserSerivce userSerivce) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult> GetUsers()
    {
        return Ok(await userSerivce.GetUsersAsync());
    }

    [HttpPut]
    public async Task<ActionResult> UpdateUser([FromBody] UpdateUserRequest request, CancellationToken cancellationToken)
    {
        var result = await userSerivce.UpdateUserAsync(request, cancellationToken);
        return result ? Created() : NotFound("user not exists");
    }

    [HttpDelete("{userId:int}")]
    public async Task<ActionResult> DeleteUser([FromRoute] int userId, CancellationToken cancellationToken)
    {
        await userSerivce.DeleteUserAsync(userId, cancellationToken);
        return NoContent();
    }
}