using Microsoft.EntityFrameworkCore;

namespace PharmaHub.API.Common.Models;

public static class PaginatedResponseExtensions
{
    public static async Task<PaginatedResponse<TDestination>> PaginatedListAsync<TDestination>(this IQueryable<TDestination> query, int pageNumber, int pageSize) where TDestination : class
    {
        return await PaginatedResponse<TDestination>.CreateAsync(query.AsNoTracking(), pageNumber, pageSize);
    }
}