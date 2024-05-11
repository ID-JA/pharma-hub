using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PharmaHub.API.Shared;

namespace PharmaHub.API;

public class ApplicationDbSeeder(UserManager<User> userManager, RoleManager<Role> roleManager)
{
    public async Task SeedDatabaseAsync(ApplicationDbContext dbContext, CancellationToken cancellationToken)
    {
        await SeedRolesAsync(dbContext);
        await SeedAdminUserAsync();
    }

    private async Task SeedRolesAsync(ApplicationDbContext dbContext)
    {
        var roles = new[] { "Admin", "Manager", "Member" };

        foreach (string roleName in roles)
        {
            if (await roleManager.Roles.SingleOrDefaultAsync(r => r.Name == roleName)
                is not Role role)
            {
                // Create the role
                role = new Role(roleName);
                await roleManager.CreateAsync(role);
            }

            // Assign permissions
            if (roleName == "User")
            {
                await AssignPermissionsToRoleAsync(dbContext, AppPermissions.Basic, role);
            }
            else if (roleName == "Admin")
            {
                await AssignPermissionsToRoleAsync(dbContext, AppPermissions.Admin, role);

            }
        }
    }

    private async Task AssignPermissionsToRoleAsync(ApplicationDbContext dbContext, IReadOnlyList<AppPermission> permissions, Role role)
    {
        var currentClaims = await roleManager.GetClaimsAsync(role);
        foreach (var permission in permissions)
        {
            if (!currentClaims.Any(c => c.Type == "permission" && c.Value == permission.Name))
            {
                dbContext.RoleClaims.Add(new IdentityRoleClaim<int>
                {
                    RoleId = role.Id,
                    ClaimType = "permission",
                    ClaimValue = permission.Name,
                });
                await dbContext.SaveChangesAsync();
            }
        }
    }

    private async Task SeedAdminUserAsync()
    {
        if (await userManager.Users.FirstOrDefaultAsync(u => u.Email == "jake@admin.com")
            is not User adminUser)
        {
            adminUser = new User
            {
                FirstName = "Jake",
                LastName = "Admin",
                Email = "jake@admin.com",
                UserName = "AdminJake91",
                EmailConfirmed = true,
                CNI = "AK47102F8",
                Address = "Main Street 123",
                Gender = 'M',
                Phone = "123456789",
                PhoneNumberConfirmed = true,
                NormalizedEmail = "jake@admin.com".ToUpperInvariant(),
                NormalizedUserName = "AdminJake91".ToUpperInvariant(),
            };

            var password = new PasswordHasher<User>();
            adminUser.PasswordHash = password.HashPassword(adminUser, "Admin@123");
            await userManager.CreateAsync(adminUser);
        }

        // Assign role to user
        if (!await userManager.IsInRoleAsync(adminUser, "Admin"))
        {
            await userManager.AddToRoleAsync(adminUser, "Admin");
        }
    }

}
