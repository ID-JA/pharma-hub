using System.Security.Claims;

namespace PharmaHub.API;

public class CurrentUser : ICurrentUser, ICurrentUserInitializer
{
    private ClaimsPrincipal? user;
    private string userId = null;

    public string? Name => user?.Identity.Name;

    public IEnumerable<Claim>? GetUserClaims()
    {
        return user?.Claims;
    }

    public string? GetUserEmail()
    {
        return IsAuthenticated() ? user!.GetEmail() : string.Empty;
    }

    public int GetUserId()
    {
        return int.Parse(IsAuthenticated()
            ? user!.GetUserId()
            : userId);
    }

    public bool IsAuthenticated()
    {
        return user?.Identity?.IsAuthenticated is true;
    }

    public bool IsInRole(string role)
    {
        return user?.IsInRole(role) is true;
    }

    public void SetCurrentUser(ClaimsPrincipal currentUser)
    {
        if (currentUser is null)
        {
            throw new Exception("Method reserved for in-scope initialization");
        }

        user = currentUser;
    }

    public void SetCurrentUserId(string CurrentUserId)
    {
        if (string.IsNullOrEmpty(userId))
        {
            throw new Exception("Method reserved for in-scope initialization");
        }

        if (!string.IsNullOrEmpty(userId))
        {
            userId = CurrentUserId;
        }
    }
}
