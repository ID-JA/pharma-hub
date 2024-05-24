using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;

namespace PharmaHub.API.Common.Models;

public static class PaginatedResponseExtensions
{
    public static async Task<PaginatedResponse<TDestination>> PaginatedListAsync<TDestination>(this IQueryable<TDestination> query, int pageNumber, int pageSize) where TDestination : class
    {
        return await PaginatedResponse<TDestination>.CreateAsync(query.AsNoTracking(), pageNumber, pageSize);
    }

    public static IQueryable<T> SelectColumns<T>(this IQueryable<T> query, List<string> columns) where T : class
    {
        if (columns.Count == 0) return query;

        var parameter = Expression.Parameter(typeof(T), "e");
        var bindings = columns
            .Select(name => Expression.PropertyOrField(parameter, name))
            .Select(member => Expression.Bind(member.Member, member));
        var body = Expression.MemberInit(Expression.New(typeof(T)), bindings);

        var selector = Expression.Lambda<Func<T, T>>(body, parameter);
        return query.Select(selector);
    }
}