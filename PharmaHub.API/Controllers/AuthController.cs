using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace PharmaHub.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController(UserManager<User> userManager) : ControllerBase
{
    [HttpPost("/register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest registerRequest)
    {
        var user = await userManager.FindByEmailAsync(registerRequest.Email);
        if (user is not null)
        {
            return BadRequest(new { message = "Duplicated email" });
        }

        var newUser = new User()
        {
            Email = registerRequest.Email,
            FirstName = registerRequest.FirstName,
            LastName = registerRequest.LastName,
            Gender = registerRequest.Gender,
            CNI = registerRequest.CNI,
            Address = registerRequest.Address,
            UserName = $"{registerRequest.FirstName}{registerRequest.LastName}",
            Phone = registerRequest.Phone,
            EmailConfirmed = true //email is confirmed by default, we don't need to implement email confirmation feature YET
        };
        var result = await userManager.CreateAsync(newUser, registerRequest.Password);
        
        if(!result.Succeeded)
        {
            return BadRequest("Something went wrong while creating the user");
        }

        return Ok(new { message = "User created successfully" });
    }
}

public class RegisterRequest
{
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Password { get; set; }
    public string Address { get; set; }
    public char Gender { get; set; }
    public string Phone { get; set; }
    public string CNI { get; set; }
}
