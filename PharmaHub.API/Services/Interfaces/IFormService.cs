
using Microsoft.EntityFrameworkCore;

namespace PharmaHub.API.Services.Interfaces;

public interface IFormService
{
  Task<bool> CreateFormAsync(FormDto request, CancellationToken cancellationToken = default);
  Task<FormDto?> GetFormAsync(int id, CancellationToken cancellationToken = default);
  Task<bool> DeleteForm(int id, CancellationToken cancellationToken = default);
  Task<bool> UpdateForm(int id, FormDto request, CancellationToken cancellationToken = default);

}
public class FormService(ApplicationDbContext dbContext, ICurrentUser currentUser) : IFormService
{
  public async Task<FormDto?> GetFormAsync(int id, CancellationToken cancellationToken = default) => await dbContext.Forms.Where(o => o.Id == id).ProjectToType<FormDto>().FirstOrDefaultAsync(cancellationToken);
  public async Task<bool> CreateFormAsync(FormDto request, CancellationToken cancellationToken = default)
  {
    Form form = new()
    {
      Name = request.Name,
      Code = request.Code,
      Description = request.Description
    };

    dbContext.Forms.Add(form);


    await dbContext.SaveChangesAsync(cancellationToken);
    return true;
  }
  public async Task<bool> DeleteForm(int id, CancellationToken cancellationToken = default)
  {
    var entity = await GetFormAsync(id, cancellationToken);
    if (entity is not null)
    {
      dbContext.Forms.Remove(entity.ToEntity());
      await dbContext.SaveChangesAsync(cancellationToken);
      return true;
    }
    return false;
  }
  public async Task<bool> UpdateForm(int id, FormDto request, CancellationToken cancellationToken = default)
  {
    var form = await dbContext.Forms.FirstOrDefaultAsync(s => s.Id == id, cancellationToken: cancellationToken);

    if (form is not null)
    {
      form.Name = request.Name;
      form.Code = request.Code;
      form.Description = request.Description;
      form.UpdatedAt = DateTime.Now;
      dbContext.Forms.Update(form);
      await dbContext.SaveChangesAsync(cancellationToken);
      return true;
    }
    return false;
  }
}

