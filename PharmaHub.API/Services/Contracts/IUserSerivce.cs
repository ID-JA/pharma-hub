namespace PharmaHub.API;

public interface IUserSerivce
{
    public Task<List<User>> GetUsersAsync();
}
