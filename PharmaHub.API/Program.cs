using Microsoft.EntityFrameworkCore;
using PharmaHub.API;
using PharmaHub.API.Services;
using QuestPDF.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

{
    QuestPDF.Settings.License = LicenseType.Community;
    // Add services to the container.
    builder.Services.AddMapster();
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
                .WithOrigins("https://localhost:3000", "http://localhost:3000", "https://localhost:5173", "http://localhost:5173");

        });
    });

    builder.Services.Configure<MailSettings>(builder.Configuration.GetSection(nameof(MailSettings)));
    // register custom services
    builder.Services.AddScoped(typeof(IService<>), typeof(Service<>));
    builder.Services.AddScoped<IUserService, UserService>();
    builder.Services.AddScoped<IMedicationService, MedicationService>();
    builder.Services.AddScoped<ISaleService, SaleService>();
    builder.Services.AddScoped<IDeliveryService, DeliveryService>();
    builder.Services.AddScoped<ISupplierService, SupplierService>();
    builder.Services.AddScoped<IFormService, FormService>();
    builder.Services.AddScoped<IFamilyService, FamilyService>();
    builder.Services.AddScoped<IDciService, DciService>();
    builder.Services.AddScoped<ITypeService, TypeService>();
    builder.Services.AddScoped<IInventoryService, InventoryService>();
    builder.Services.AddScoped<IBillService, BillService>();
    builder.Services.AddScoped<IClientService, ClientService>();
    builder.Services.AddScoped<ICreditNoteService, CreditNoteService>();
    builder.Services.AddScoped<IMailService, SmtpMailService>();
    builder.Services.AddScoped<IAppSettingService, AppSettingService>();
    builder.Services.AddScoped<ISectionService, SectionService>();


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

    app.UseAuthentication();
    app.UseCurrentUser();
    app.UseAuthorization();

    app.MapControllers();

    app.Run();
}

