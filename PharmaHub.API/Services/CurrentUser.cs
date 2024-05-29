using System.Security.Claims;

namespace PharmaHub.API;

public class CurrentUser : ICurrentUser, ICurrentUserInitializer
{
    private ClaimsPrincipal? _user;
    private string _userId = null;

    public string? Name => _user?.Identity.Name;

    public IEnumerable<Claim>? GetUserClaims()
    {
        return _user?.Claims;
    }

    public string? GetUserEmail()
    {
        return IsAuthenticated() ? _user!.GetEmail() : string.Empty;
    }

    public int GetUserId()
    {
        return int.Parse(IsAuthenticated()
            ? _user!.GetUserId()
            : _userId);
    }

    public bool IsAuthenticated()
    {
        return _user?.Identity?.IsAuthenticated is true;
    }

    public bool IsInRole(string role)
    {
        return _user?.IsInRole(role) is true;
    }

    public void SetCurrentUser(ClaimsPrincipal currentUser)
    {
        if (currentUser is null)
        {
            throw new Exception("Method reserved for in-scope initialization");
        }

        _user = currentUser;
    }

    public void SetCurrentUserId(string currentUserId)
    {
        if (string.IsNullOrEmpty(_userId))
        {
            throw new Exception("Method reserved for in-scope initialization");
        }

        if (!string.IsNullOrEmpty(_userId))
        {
            _userId = currentUserId;
        }
    }
}
