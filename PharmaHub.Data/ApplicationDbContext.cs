using System.Reflection;
using Microsoft.EntityFrameworkCore;
using PharmaHub.Data.Models;

namespace PharmaHub.Data;
public class ApplicationDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Sale> Sales { get; set; }
    public DbSet<Bill> Bills { get; set; }
    public DbSet<DCI> DCIs { get; set; }
    public DbSet<DeliveryNote> DeliveryNotes { get; set; }
    public DbSet<Drug> Drugs { get; set; }
    public DbSet<Form> Forms { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<SaleDrug> SaleDrugs { get; set; }
    public DbSet<StockHistory> StockHistories { get; set; }
    public DbSet<Supplier> Suppliers { get; set; }
    public ApplicationDbContext(DbContextOptions options)
       : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}
