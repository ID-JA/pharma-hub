using PharmaHub.API.Services.Interfaces;

namespace PharmaHub.API.Services;

public class MedicamentService(ApplicationDbContext dbContext) : Service<Medicament>(dbContext), IMedicamentService
{
}
