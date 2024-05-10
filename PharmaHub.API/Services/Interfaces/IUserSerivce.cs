﻿namespace PharmaHub.API.Interfaces;

public interface IUserSerivce
{
    public Task<List<User>> GetUsersAsync();
    public Task<bool> UpdateUserAsync(UpdateUserRequest request, CancellationToken cancellationToken);
    public Task DeleteUserAsync(int userId, CancellationToken cancellationToken);
}