using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace PharmaHub.API.Database;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : IdentityDbContext<User, Role, int>(options)
{
    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.HasSequence<int>("SaleNumbers")
            .StartsAt(100)
            .IncrementsBy(1);

        builder.Entity<Sale>()
            .Property(s => s.SaleNumber)
            .HasDefaultValueSql("NEXT VALUE FOR SaleNumbers");

        base.OnModelCreating(builder);
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Form> Forms { get; set; }
    public DbSet<DCI> DCIs { get; set; }
    public DbSet<Medicament> Medicaments { get; set; }
    public DbSet<Bill> Bills { get; set; }
    public DbSet<Sale> Sales { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<Supplier> Suppliers { get; set; }
    public DbSet<SaleMedicament> SaleMedicaments { get; set; }
    public DbSet<StockHistory> StockHistories { get; set; }
    public DbSet<DeliveryNote> DeliveryNotes { get; set; }
}
