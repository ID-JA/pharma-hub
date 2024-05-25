using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace PharmaHub.API.Database;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : IdentityDbContext<User, Role, int>(options)
{
    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<Medicament>()
                .Property(c => c.UsedBy)
                .HasConversion<int>();

        builder.HasSequence<int>("SaleNumbers")
            .StartsAt(100)
            .IncrementsBy(1);

        builder.Entity<Sale>()
            .Property(s => s.SaleNumber)
            .HasDefaultValueSql("NEXT VALUE FOR SaleNumbers");

        builder.Entity<OrderMedicament>()
            .HasKey(om => new { om.OrderId, om.MedicamentId });

        builder.Entity<OrderMedicament>()
            .HasOne(om => om.Order)
            .WithMany(o => o.OrderMedicaments)
            .HasForeignKey(om => om.OrderId);

        builder.Entity<OrderMedicament>()
            .HasOne(om => om.Medicament)
            .WithMany(m => m.OrderMedicaments)
            .HasForeignKey(om => om.MedicamentId);

        base.OnModelCreating(builder);
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Form> Forms { get; set; }
    public DbSet<Inventory> Inventories { get; set; }
    public DbSet<Section> Sections { get; set; }
    public DbSet<Family> Families { get; set; }
    public DbSet<DCI> DCIs { get; set; }
    public DbSet<Medicament> Medicaments { get; set; }
    public DbSet<Bill> Bills { get; set; }
    public DbSet<Sale> Sales { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<Supplier> Suppliers { get; set; }
    public DbSet<SaleMedicament> SaleMedicaments { get; set; }
    public DbSet<OrderMedicament> OrderMedicaments { get; set; }
    public DbSet<StockHistory> StockHistories { get; set; }
    public DbSet<DeliveryNote> DeliveryNotes { get; set; }
    public DbSet<Models.Type> Types { get; set; }
}
