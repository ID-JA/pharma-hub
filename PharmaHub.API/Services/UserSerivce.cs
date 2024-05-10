
using Microsoft.EntityFrameworkCore;

namespace PharmaHub.API;

public class UserSerivce(ApplicationDbContext dbContext) : IUserSerivce
{
    public async Task DeleteUserAsync(int userId, CancellationToken cancellationToken)
    {
        var user = await dbContext.Users
                    .FindAsync([userId], cancellationToken);

        dbContext.Users.Remove(user);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<List<User>> GetUsersAsync()
    {
        var users = await dbContext.Users.ToListAsync();
        return users;
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
