using System.Security.Claims;

namespace PharmaHub.API;

public interface ICurrentUser
{
    string? Name { get; }
    int GetUserId();
    string? GetUserEmail();
    bool IsAuthenticated();
    bool IsInRole(string role);
    IEnumerable<Claim>? GetUserClaims();
}
