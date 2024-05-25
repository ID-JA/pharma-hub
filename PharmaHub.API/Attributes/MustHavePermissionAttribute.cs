namespace PharmaHub.API.Attributes;

public class MustHavePermissionAttribute : AuthorizeAttribute
{
    public MustHavePermissionAttribute(string action, string resource)
    {
        Policy = AppPermission.NameFor(action, resource);
    }
}
