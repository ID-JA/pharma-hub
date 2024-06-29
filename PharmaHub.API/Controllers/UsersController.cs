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

    [HttpPut("{id:int}")]
    [MustHavePermission(AppAction.Update, AppResource.Users)]
    public async Task<ActionResult> UpdateUser([FromRoute] int id, [FromBody] UpdateUserRequest request, CancellationToken cancellationToken)
    {
        var user = await userService.GetByIdAsync(id, cancellationToken);
        if (user is null)
            return NotFound();

        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.Address = request.Address;
        user.Cni = request.Cni;
        user.Phone = request.Phone;
        user.Gender = request.Gender;

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
