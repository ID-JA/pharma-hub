using System.Collections.ObjectModel;

namespace PharmaHub.API.Shared;

public static class AppAction
{
    public const string View = nameof(View);
    public const string Search = nameof(Search);
    public const string Create = nameof(Create);
    public const string Update = nameof(Update);
    public const string Delete = nameof(Delete);
    public const string Export = nameof(Export);
    public const string Generate = nameof(Generate);
    public const string Clean = nameof(Clean);
}

public static class AppResource
{
    public const string Users = nameof(Users);
}

public static class AppPermissions
{
    private static readonly AppPermission[] _all =
    [
        new("View Users", AppAction.View, AppResource.Users),
        new("Search Users", AppAction.Search, AppResource.Users),
        new("Create Users", AppAction.Create, AppResource.Users),
        new("Update Users", AppAction.Update, AppResource.Users),
        new("Delete Users", AppAction.Delete, AppResource.Users),
        new("Export Users", AppAction.Export, AppResource.Users),
    ];

    public static IReadOnlyList<AppPermission> All { get; } = new ReadOnlyCollection<AppPermission>(_all);
    public static IReadOnlyList<AppPermission> Root { get; } = new ReadOnlyCollection<AppPermission>(_all.Where(p => p.IsRoot).ToArray());
    public static IReadOnlyList<AppPermission> Admin { get; } = new ReadOnlyCollection<AppPermission>(_all.Where(p => !p.IsRoot).ToArray());
    public static IReadOnlyList<AppPermission> Basic { get; } = new ReadOnlyCollection<AppPermission>(_all.Where(p => p.IsBasic).ToArray());
}

public record AppPermission(string Description, string Action, string Resource, bool IsBasic = false, bool IsRoot = false)
{
    public string Name => NameFor(Action, Resource);
    public static string NameFor(string action, string resource) => $"Permissions.{resource}.{action}";
}
