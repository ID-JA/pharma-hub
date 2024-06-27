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

        // builder.Entity<InventoryHistory>(entity =>
        // {
        //     entity.HasOne(e => e.Inventory)
        //         .WithMany(i => i.InventoryHistories)
        //         .HasForeignKey(e => e.InventoryId)
        //         .OnDelete(DeleteBehavior.Cascade);
        // });
        builder.Entity<CreditNoteMedications>(entity =>
           {
               entity.HasKey(e => new { e.CreditNoteId, e.InventoryId });

               entity.HasOne(e => e.CreditNote)
                   .WithMany(o => o.CreditNoteMedications)
                   .HasForeignKey(e => e.CreditNoteId)
                   .OnDelete(DeleteBehavior.Cascade);

               entity.HasOne(e => e.Inventory)
                   .WithMany(i => i.CreditNoteMedications)
                   .HasForeignKey(e => e.InventoryId)
                   .OnDelete(DeleteBehavior.Restrict);
           });







        // builder.Entity<OrderItem>(entity =>
        // {
        //     entity.HasKey(e => new { e.OrderId, e.InventoryId });

        //     entity.HasOne(e => e.Order)
        //         .WithMany(o => o.OrderItems)
        //         .HasForeignKey(e => e.OrderId)
        //         .OnDelete(DeleteBehavior.Cascade);

        //     entity.HasOne(e => e.Inventory)
        //         .WithMany(i => i.OrderItems)
        //         .HasForeignKey(e => e.InventoryId)
        //         .OnDelete(DeleteBehavior.Restrict);
        // });

        // builder.Entity<DeliveryMedication>(entity =>
        // {
        //     entity.HasKey(e => new { e.DeliveryId, e.InventoryId });

        //     entity.HasOne(e => e.Delivery)
        //         .WithMany(o => o.DeliveryMedications)
        //         .HasForeignKey(e => e.DeliveryId)
        //         .OnDelete(DeleteBehavior.Cascade);

        //     entity.HasOne(e => e.Inventory)
        //         .WithMany(i => i.OrderDeliveryInventor)
        //         .HasForeignKey(e => e.InventoryId)
        //         .OnDelete(DeleteBehavior.Restrict);

        //     entity.Property(e => e.Ppv).HasPrecision(10, 2);
        //     entity.Property(e => e.Pph).HasPrecision(10, 2);
        // });

        base.OnModelCreating(builder);
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Form> Forms { get; set; }
    public DbSet<Inventory> Inventories { get; set; }
    public DbSet<Section> Sections { get; set; }
    public DbSet<Family> Families { get; set; }
    public DbSet<Dci> MedicationNames { get; set; }
    public DbSet<Medication> Medications { get; set; }
    public DbSet<Bill> Bills { get; set; }
    public DbSet<Sale> Sales { get; set; }
    public DbSet<Delivery> Deliveries { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderDeliveryInventory> OrderDeliveryInventories { get; set; }
    // public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Supplier> Suppliers { get; set; }
    public DbSet<SaleMedication> SaleMedications { get; set; }
    // public DbSet<DeliveryMedication> DeliveryMedications { get; set; }
    public DbSet<InventoryHistory> InventoryHistories { get; set; }
    public DbSet<Tax> Taxes { get; set; }
    public DbSet<Client> Clients { get; set; }
    public DbSet<CreditNote> CreditNotes { get; set; }
    public DbSet<CreditNoteMedications> CreditNoteMedications { get; set; }


}
