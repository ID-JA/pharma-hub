using Microsoft.AspNetCore.Identity;

namespace PharmaHub.API.Models;

public class Role : IdentityRole<int>
{

    public Role(string name)
        : base(name)
    {
        NormalizedName = name.ToUpperInvariant();
    }
}
