
using Microsoft.EntityFrameworkCore;

namespace PharmaHub.API;

public class UserSerivce(ApplicationDbContext dbContext) : IUserSerivce
{
    public async Task<List<User>> GetUsersAsync()
    {
        var users = await dbContext.Users.ToListAsync();
        return users;
    }
}
