using Microsoft.EntityFrameworkCore;

namespace PharmaHub.API.Common.Models;

public class PaginatedResponse<T>(IReadOnlyCollection<T> data, int count, int page, int pageSize)
{
    public IReadOnlyCollection<T> Data { get; set; } = data;

    public int CurrentPage { get; set; } = page;

    public int TotalPages { get; set; } = (int)Math.Ceiling(count / (double)pageSize);

    public int TotalCount { get; set; } = count;

    public int PageSize { get; set; } = pageSize;

    public bool HasPreviousPage => CurrentPage > 1;

    public bool HasNextPage => CurrentPage < TotalPages;

    public static async Task<PaginatedResponse<T>> CreateAsync(IQueryable<T> source, int pageNumber, int pageSize)
    {
        var count = await source.CountAsync();
        var items = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

        return new PaginatedResponse<T>(items, count, pageNumber, pageSize);
    }
}
