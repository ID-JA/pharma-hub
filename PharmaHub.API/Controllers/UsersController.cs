using Microsoft.AspNetCore.Mvc;

namespace PharmaHub.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UsersController(IUserService userService) : ControllerBase
{
    [HttpGet]
    [MustHavePermission(AppAction.View, AppResource.Users)]
    public async Task<ActionResult> GetUsers()
    {
        return Ok(await userService.GetUsersAsync());
    }

    [HttpPut]
    [MustHavePermission(AppAction.Update, AppResource.Users)]
    public async Task<ActionResult> UpdateUser([FromBody] UpdateUserRequest request, CancellationToken cancellationToken)
    {
        var result = await userService.UpdateUserAsync(request, cancellationToken);
        return result ? Created() : NotFound("user not exists");
    }

    [HttpDelete("{userId:int}")]
    [MustHavePermission(AppAction.Delete, AppResource.Users)]
    public async Task<ActionResult> DeleteUser([FromRoute] int userId, CancellationToken cancellationToken)
    {
        await userService.DeleteUserAsync(userId, cancellationToken);
        return NoContent();
    }
}