
using PharmaHub.API.Controllers;

namespace PharmaHub.API.Interfaces;

public interface IUserService : IService<User>
{
    Task<List<string>> GetPermissionsAsync(string userId, CancellationToken cancellationToken);
    Task<bool> HasPermissionAsync(string userId, string permission, CancellationToken cancellationToken = default);
    Task<string> ForgotPasswordAsync(string email, string origin);
    Task<string> ResetPasswordAsync(ResetPasswordRequest request);

}

