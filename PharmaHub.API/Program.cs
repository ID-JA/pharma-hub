using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PharmaHub.API;

var builder = WebApplication.CreateBuilder(args);

{
    // Add services to the container.
    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

    builder.Services.AddAuthorizationBuilder();

    builder.Services.AddDbContext<ApplicationDbContext>(options =>
    {
        options.UseSqlServer(builder.Configuration["ConnectionStrings:DefaultConnection"]);
    }).AddTransient<ApplicationDbInitializer>()
        .AddTransient<ApplicationDbSeeder>();

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



    // register custom services
    builder.Services.AddScoped<IUserService, UserService>();
    builder.Services.AddScoped<IMedicamentService, MedicamentService>();

    builder.Services.AddAuth();

}

var app = builder.Build();

{
    await app.Services.InitializeDatabasesAsync();
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

    app.Run();
}

