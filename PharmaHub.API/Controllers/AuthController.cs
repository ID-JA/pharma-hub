﻿using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace PharmaHub.API.Controllers;

[Route("/api/[controller]")]
[ApiController]
public class AuthController(UserManager<User> userManager, SignInManager<User> signInManager, RoleManager<Role> roleManager, IUserService userService) : ControllerBase
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
            Cni = registerRequest.Cni,
            Address = registerRequest.Address,
            UserName = $"{registerRequest.FirstName}{registerRequest.LastName}",
            Phone = registerRequest.Phone,
            TwoFactorEnabled = false,
            EmailConfirmed = true //email is confirmed by default, we don't need to implement email confirmation feature YET
        };
        var result = await userManager.CreateAsync(newUser, registerRequest.Password);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        var role = roleManager.FindByNameAsync(registerRequest.Role).Result;

        if (role is not null)
        {
            var roleresult = await userManager.AddToRoleAsync(newUser, role.Name!);
        }

        return Ok(new { message = "User created successfully" });
    }

    [HttpPost("/login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
    {
        if (loginRequest.Email.IsNullOrEmpty() || loginRequest.Password.IsNullOrEmpty())
            return BadRequest("Email and Password are requierd");

        var result = await signInManager.PasswordSignInAsync(loginRequest.Email, loginRequest.Password, isPersistent: false, lockoutOnFailure: false);

        if (!result.Succeeded)
        {
            return BadRequest(result.ToString());
        }

        return Empty;
    }


    [HttpPost("forgot-password")]
    public Task<string> ForgotPasswordAsync(ForgetPasswordRequest request)
    {
        return userService.ForgotPasswordAsync(request.Email, $"{Request.Scheme}://{Request.Host.Value}{Request.PathBase.Value}");
    }

    [HttpPost("reset-password")]
    public Task<string> ResetPasswordAsync(ResetPasswordRequest request)
    {
        return userService.ResetPasswordAsync(request);
    }
}


public class ForgetPasswordRequest
{
    public string Email { get; set; }

}
public class ResetPasswordRequest
{
    public string? Email { get; set; }

    public string? Password { get; set; }

    public string? Token { get; set; }
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
    public string Cni { get; set; }
    public string Role { get; set; }
}


public class LoginRequest
{
    public string Email { get; set; }
    public string Password { get; set; }
}
