using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace PharmaHub.API;

public static class Extensions
{
    public static async Task InitializeDatabasesAsync(this IServiceProvider services, CancellationToken cancellationToken = default)
    {
        using var scope = services.CreateScope();
        await scope.ServiceProvider.GetRequiredService<ApplicationDbInitializer>()
            .InitializeAsync(cancellationToken);
    }

    internal static IServiceCollection AddAuth(this IServiceCollection services)
    {
        services
            .AddCurrentUser()
            .AddPermissions()
            .AddIdentity<User, Role>()
            .AddSignInManager<SignInManager<User>>()
            .AddRoles<Role>()
            .AddEntityFrameworkStores<ApplicationDbContext>();

        return services;

    }

    internal static IApplicationBuilder UseCurrentUser(this IApplicationBuilder app) =>
        app.UseMiddleware<CurrentUserMiddleware>();

    private static IServiceCollection AddCurrentUser(this IServiceCollection services) =>
        services
            .AddScoped<CurrentUserMiddleware>()
            .AddScoped<ICurrentUser, CurrentUser>()
            .AddScoped(sp => (ICurrentUserInitializer)sp.GetRequiredService<ICurrentUser>());

    private static IServiceCollection AddPermissions(this IServiceCollection services) =>
        services
            .AddSingleton<IAuthorizationPolicyProvider, PermissionPolicyProvider>()
            .AddScoped<IAuthorizationHandler, PermissionAuthorizationHandler>();
}
