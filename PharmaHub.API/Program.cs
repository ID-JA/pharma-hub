using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PharmaHub.API;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// builder.Services.AddAuthentication(IdentityConstants.ApplicationScheme)
//     .AddIdentityCookies();
builder.Services.AddAuthorizationBuilder();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration["ConnectionStrings:DefaultConnection"]);
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("CUSTOM_POLICY", p =>
    {
        p.AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .WithOrigins("https://localhost:3000", "http://localhost:3000");

    });
});

builder.Services.AddIdentity<User, Role>()
  .AddSignInManager<SignInManager<User>>()
  .AddRoles<Role>()
  .AddEntityFrameworkStores<ApplicationDbContext>();


// register custom services
builder.Services.AddScoped<IUserSerivce, UserSerivce>();
builder.Services.AddScoped<IMedicamentService, MedicamentService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("CUSTOM_POLICY");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// TODO: Move this code to seed roles with database migration
using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<Role>>();
    var roles = new[] { "Admin", "Manager", "Member" };

    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new Role()
            {
                Name = role
            });
        }
    }
}

app.Run();
