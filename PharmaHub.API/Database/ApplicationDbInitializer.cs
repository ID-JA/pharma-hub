using Microsoft.EntityFrameworkCore;

namespace PharmaHub.API.Database;

public class ApplicationDbInitializer(ApplicationDbSeeder dbSeeder, ApplicationDbContext dbContext)
{
    public async Task InitializeAsync(CancellationToken cancellationToken)
    {
        if (dbContext.Database.GetMigrations().Any())
        {
            if ((await dbContext.Database.GetPendingMigrationsAsync(cancellationToken)).Any())
            {
                await dbContext.Database.MigrateAsync(cancellationToken);
            }

            if (await dbContext.Database.CanConnectAsync(cancellationToken))
            {

                await dbSeeder.SeedDatabaseAsync(dbContext, cancellationToken);
            }
        }
    }
}
