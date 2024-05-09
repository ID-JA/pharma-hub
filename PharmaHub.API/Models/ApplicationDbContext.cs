using Microsoft.EntityFrameworkCore;

namespace PharmaHub.API.Models;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<Form> Forms { get; set; }
    public DbSet<DCI> DCIs { get; set; }
    public DbSet<Drug> Drugs { get; set; }
    public DbSet<Bill> Bills { get; set; }
    public DbSet<Sale> Sales { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<Supplier> Suppliers { get; set; }
    public DbSet<SaleDrug> SaleDrugs { get; set; }
    public DbSet<StockHistory> StockHistories { get; set; }
    public DbSet<DeliveryNote> DeliveryNotes { get; set; }
}
