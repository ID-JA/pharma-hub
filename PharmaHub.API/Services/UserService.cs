
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace PharmaHub.API;

public class UserService(ApplicationDbContext dbContext, UserManager<User> userManager, RoleManager<Role> roleManager) : Service<User>(dbContext), IUserService
{
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
