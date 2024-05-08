using Microsoft.EntityFrameworkCore;

namespace PharmaHub.API.Models;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{

}
