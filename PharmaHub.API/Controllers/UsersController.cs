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
        return Ok(await userService.GetAllAsync());
    }

    [HttpPut]
    [MustHavePermission(AppAction.Update, AppResource.Users)]
    public async Task<ActionResult> UpdateUser([FromBody] UpdateUserRequest request, CancellationToken cancellationToken)
    {
        User user = new()
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Address = request.Address,
            CNI = request.CNI,
            Phone = request.Phone,
            Gender = request.Gender,
        };
        await userService.UpdateAsync(user, cancellationToken);
        return NoContent();
    }

    [HttpDelete("{userId:int}")]
    [MustHavePermission(AppAction.Delete, AppResource.Users)]
    public async Task<ActionResult> DeleteUser([FromRoute] int userId, CancellationToken cancellationToken)
    {
        var user = await userService.GetByIdAsync(userId);
        if (user is null)
        {
            return NotFound();
        }
        await userService.DeleteAsync(user, cancellationToken);
        return NoContent();
    }
}