
using Microsoft.EntityFrameworkCore;
using PharmaHub.API.Common.Models;

namespace PharmaHub.API.Services.Interfaces;

public class SectionDto : BaseDto<SectionDto, Section>
{
    public string Name { get; set; }
    public string Code { get; set; }
}

public interface ISectionService
{
    Task<bool> CreateSectionAsync(SectionDto request, CancellationToken cancellationToken = default);
    Task<SectionDto?> GetSectionAsync(int id, CancellationToken cancellationToken = default);
    Task<bool> DeleteSection(int id, CancellationToken cancellationToken = default);
    Task<bool> UpdateSection(int id, SectionDto request, CancellationToken cancellationToken = default);
    Task<PaginatedResponse<Section>> GetSections(string name, CancellationToken cancellationToken);
}
public class SectionService(ApplicationDbContext dbContext, ICurrentUser currentUser) : ISectionService
{
    public async Task<SectionDto?> GetSectionAsync(int id, CancellationToken cancellationToken = default) => await dbContext.Sections.Where(o => o.Id == id).ProjectToType<SectionDto>().FirstOrDefaultAsync(cancellationToken);
    public async Task<bool> CreateSectionAsync(SectionDto request, CancellationToken cancellationToken = default)
    {
        Section Section = new()
        {
            Name = request.Name,
            Code = request.Code,
        };

        dbContext.Sections.Add(Section);

        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
    public async Task<bool> DeleteSection(int id, CancellationToken cancellationToken = default)
    {
        var entity = await GetSectionAsync(id, cancellationToken);
        if (entity is not null)
        {
            dbContext.Sections.Remove(entity.ToEntity());
            await dbContext.SaveChangesAsync(cancellationToken);
            return true;
        }
        return false;
    }
    public async Task<bool> UpdateSection(int id, SectionDto request, CancellationToken cancellationToken = default)
    {
        var Section = await dbContext.Sections.FirstOrDefaultAsync(s => s.Id == id, cancellationToken: cancellationToken);

        if (Section is not null)
        {
            Section.Name = request.Name;
            Section.Code = request.Code;
            Section.UpdatedAt = DateTime.Now;
            dbContext.Sections.Update(Section);
            await dbContext.SaveChangesAsync(cancellationToken);
            return true;
        }
        return false;
    }

    public async Task<PaginatedResponse<Section>> GetSections(string? name, CancellationToken cancellationToken)
    {
        var query = dbContext.Sections.AsNoTracking();

        if (string.IsNullOrWhiteSpace(name))
        {
            return await query.PaginatedListAsync(1, 10000);
        }
        return await query.Where(x => x.Name.Contains(name)).PaginatedListAsync(1, 10000);
    }
}

