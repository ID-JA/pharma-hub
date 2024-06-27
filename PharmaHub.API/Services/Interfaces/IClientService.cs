using Microsoft.EntityFrameworkCore;
using PharmaHub.API.Common.Models;

namespace PharmaHub.API.Services.Interfaces;

public interface IClientService
{
    Task<bool> CreateClientAsync(ClientCreateDto request, CancellationToken cancellationToken = default);
    Task<ClientBasicDto?> GetClientAsync(int id, CancellationToken cancellationToken = default);
    Task<PaginatedResponse<ClientBasicDto>> GetClientsAsync(int pageNumber, int pageSize, CancellationToken cancellationToken = default);
    public Task<bool> DeleteClient(int id, CancellationToken cancellationToken = default);
    public Task<bool> UpdateClient(int id, ClientUpdateDto request, CancellationToken cancellationToken = default);
}
public class ClientService(ApplicationDbContext dbContext, ICurrentUser currentUser) : IClientService
{
    public async Task<bool> CreateClientAsync(ClientCreateDto request, CancellationToken cancellationToken = default)
    {
        Client client = new()
        {

            FullName = request.FullName,
            Type = request.Type,
            Limit = request.Limit,
            Email = request.Email,
            Photo = request.Photo,
            Address = request.Address,
            Notes = request.Notes,
            AffiliationNumber = request.AffiliationNumber,
            InscriptionNumber = request.InscriptionNumber

        };
        dbContext.Clients.Add(client);
        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
    public async Task<ClientBasicDto?> GetClientAsync(int id, CancellationToken cancellationToken = default)
    {
        return await dbContext.Clients
                .Where(b => b.Id == id)
                .ProjectToType<ClientBasicDto>()
                .FirstOrDefaultAsync(cancellationToken);
    }
    public async Task<PaginatedResponse<ClientBasicDto>> GetClientsAsync(int pageNumber, int pageSize, CancellationToken cancellationToken = default)
    {
        return await dbContext.Clients.ProjectToType<ClientBasicDto>().PaginatedListAsync(pageNumber, pageSize);
    }
    public async Task<bool> DeleteClient(int id, CancellationToken cancellationToken = default)
    {
        var client = await dbContext.Clients.FirstOrDefaultAsync(c => c.Id == id, cancellationToken: cancellationToken);

        if (client is not null)
        {
            dbContext.Clients.Remove(client);
            await dbContext.SaveChangesAsync(cancellationToken);
            return true;
        }
        return false;
    }

    public async Task<bool> UpdateClient(int id, ClientUpdateDto request, CancellationToken cancellationToken = default)
    {
        var client = await dbContext.Clients.FirstOrDefaultAsync(c => c.Id == id, cancellationToken: cancellationToken);

        if (client is not null)
        {
            client.FullName = request.FullName;
            client.Type = request.Type;
            client.Limit = request.Limit;
            client.Email = request.Email;
            client.Photo = request.Photo;
            client.Address = request.Address;
            client.Notes = request.Notes;
            client.AffiliationNumber = request.AffiliationNumber;
            client.InscriptionNumber = request.InscriptionNumber;
            dbContext.Clients.Update(client);
            await dbContext.SaveChangesAsync(cancellationToken);
            return true;
        }
        return false;
    }
}
