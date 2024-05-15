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
    public const string Sales = nameof(Sales);
    public const string Orders = nameof(Orders);
    public const string Suppliers = nameof(Suppliers);

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

        new("View Sales", AppAction.View, AppResource.Sales),
        new("Search Sales", AppAction.Search, AppResource.Sales),
        new("Create Sales", AppAction.Create, AppResource.Sales),
        new("Update Sales", AppAction.Update, AppResource.Sales),
        new("Delete Sales", AppAction.Delete, AppResource.Sales),
        new("Export Sales", AppAction.Export, AppResource.Sales),

        new("View Orders", AppAction.View, AppResource.Orders),
        new("Search Orders", AppAction.Search, AppResource.Orders),
        new("Create Orders", AppAction.Create, AppResource.Orders),
        new("Update Orders", AppAction.Update, AppResource.Orders),
        new("Delete Orders", AppAction.Delete, AppResource.Orders),
        new("Export Orders", AppAction.Export, AppResource.Orders),

        new("View Suppliers", AppAction.View, AppResource.Suppliers),
        new("Search Suppliers", AppAction.Search, AppResource.Suppliers),
        new("Create Suppliers", AppAction.Create, AppResource.Suppliers),
        new("Update Suppliers", AppAction.Update, AppResource.Suppliers),
        new("Delete Suppliers", AppAction.Delete, AppResource.Suppliers),
        new("Export Suppliers", AppAction.Export, AppResource.Suppliers),
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
