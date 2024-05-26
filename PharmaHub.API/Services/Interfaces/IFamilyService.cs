﻿using Microsoft.EntityFrameworkCore;
using PharmaHub.API.Common.Models;

namespace PharmaHub.API;

public interface IFamilyService
{
  Task<bool> CreateFamilyAsync(FamilyDto request, CancellationToken cancellationToken = default);
  Task<FamilyDto?> GetFamilyAsync(int id, CancellationToken cancellationToken = default);
  Task<bool> DeleteFamily(int id, CancellationToken cancellationToken = default);
  Task<bool> UpdateFamily(int id, FamilyDto request, CancellationToken cancellationToken = default);
  Task<PaginatedResponse<Family>> GetFamilies(string name, CancellationToken cancellationToken);

}
public class FamilyService(ApplicationDbContext dbContext, ICurrentUser currentUser) : IFamilyService
{
  public async Task<FamilyDto?> GetFamilyAsync(int id, CancellationToken cancellationToken = default) => await dbContext.Families.Where(o => o.Id == id).ProjectToType<FamilyDto>().FirstOrDefaultAsync(cancellationToken);
  public async Task<bool> CreateFamilyAsync(FamilyDto request, CancellationToken cancellationToken = default)
  {
    Family family = new()
    {
      Name = request.Name,
      Code = request.Code
    };

    dbContext.Families.Add(family);


    await dbContext.SaveChangesAsync(cancellationToken);
    return true;
  }
  public async Task<bool> DeleteFamily(int id, CancellationToken cancellationToken = default)
  {
    var family = await dbContext.Families.FirstOrDefaultAsync(s => s.Id == id, cancellationToken: cancellationToken);

    if (family is not null)
    {
      dbContext.Families.Remove(family);
      await dbContext.SaveChangesAsync(cancellationToken);
      return true;
    }
    return false;
  }

  public async Task<bool> UpdateFamily(int id, FamilyDto request, CancellationToken cancellationToken = default)
  {
    var family = await dbContext.Families.FirstOrDefaultAsync(s => s.Id == id, cancellationToken: cancellationToken);

    if (family is not null)
    {
      family.Name = request.Name;
      family.Code = request.Code;

      dbContext.Families.Update(family);
      await dbContext.SaveChangesAsync(cancellationToken);
      return true;
    }
    return false;
  }

  public async Task<PaginatedResponse<Family>> GetFamilies(string? name, CancellationToken cancellationToken)
  {
    var query = dbContext.Families.AsNoTracking();

    if (string.IsNullOrWhiteSpace(name))
    {
      return await query.PaginatedListAsync(1,50);
    }

    return await query.Where(x => x.Name.Contains(name)).PaginatedListAsync(1,50);

  }
}
