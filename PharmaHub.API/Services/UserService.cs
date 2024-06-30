
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using PharmaHub.API.Controllers;

namespace PharmaHub.API;

public class UserService(ApplicationDbContext dbContext, UserManager<User> userManager, RoleManager<Role> roleManager, IMailService mailService) : Service<User>(dbContext), IUserService
{
    public async Task<string> ForgotPasswordAsync(string email, string origin)
    {

        var user = await userManager.FindByEmailAsync(email.Normalize());
        if (user is null || !await userManager.IsEmailConfirmedAsync(user))
        {
            throw new Exception("An Error has occurred!");
        }

        string code = await userManager.GeneratePasswordResetTokenAsync(user);
        const string route = "account/reset-password";
        var endpointUri = new Uri(string.Concat($"pharma-hub://", route));
        string passwordResetUrl = QueryHelpers.AddQueryString(endpointUri.ToString(), "token", code);

        var mailRequest = new MailRequest(
            [email],
            "Reset Password",
            $"'{code}' <a href='{passwordResetUrl}'>Réinitialiser votre mot de passe</a>.");
        await mailService.SendAsync(mailRequest, CancellationToken.None);
        return "Password Reset Mail has been sent to your authorized Email.";
    }

    public async Task<string> ResetPasswordAsync(ResetPasswordRequest request)
    {
        var user = await userManager.FindByEmailAsync(request.Email?.Normalize()!);

        _ = user ?? throw new Exception("An Error has occurred!");

        var result = await userManager.ResetPasswordAsync(user, request.Token!, request.Password!);

        return result.Succeeded
            ? "Password Reset Successful!"
            : throw new Exception("An Error has occurred!");
    }

    public async Task<List<string>> GetPermissionsAsync(string userId, CancellationToken cancellationToken)
    {
        var user = await userManager.FindByIdAsync(userId);

        _ = user ?? throw new UnauthorizedAccessException("Authentication Failed.");

        var userRoles = await userManager.GetRolesAsync(user);
        var permissions = new List<string>();
        foreach (var role in await roleManager.Roles
            .Where(r => userRoles.Contains(r.Name!))
            .ToListAsync(cancellationToken))
        {
            permissions.AddRange(await dbContext.RoleClaims
                .Where(rc => rc.RoleId == role.Id && rc.ClaimType == "Permission")
                .Select(rc => rc.ClaimValue!)
                .ToListAsync(cancellationToken));
        }

        return permissions.Distinct().ToList();
    }

    public async Task<bool> HasPermissionAsync(string userId, string permission, CancellationToken cancellationToken = default)
    {
        var permissions = await GetPermissionsAsync(userId, cancellationToken);

        return permissions?.Contains(permission) ?? false;
    }
}
