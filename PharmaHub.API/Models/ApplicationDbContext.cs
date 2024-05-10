using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace PharmaHub.API.Models;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : IdentityDbContext<User, IdentityRole<int>, int>(options)
{
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
