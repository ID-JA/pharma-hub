
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace PharmaHub.API;

public class UserService(ApplicationDbContext dbContext, UserManager<User> userManager, RoleManager<Role> roleManager) : IUserService
{
    public async Task DeleteUserAsync(int userId, CancellationToken cancellationToken)
    {
        var user = await dbContext.Users
                    .FindAsync([userId], cancellationToken);

        dbContext.Users.Remove(user);
        await dbContext.SaveChangesAsync(cancellationToken);
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


    public async Task<List<User>> GetUsersAsync()
    {
        var users = await dbContext.Users.ToListAsync();
        return users;
    }

    public async Task<bool> HasPermissionAsync(string userId, string permission, CancellationToken cancellationToken = default)
    {
        var permissions = await GetPermissionsAsync(userId, cancellationToken);

        return permissions?.Contains(permission) ?? false;
    }

    public async Task<bool> UpdateUserAsync(UpdateUserRequest request, CancellationToken cancellationToken)
    {
        var user = await dbContext.Users.FindAsync([request.Id], cancellationToken);
        if (user == null)
        {
            return false;
        }

        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.Address = request.Address;
        user.CNI = request.CNI;
        user.Phone = request.Phone;
        user.Gender = request.Gender;

        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}
