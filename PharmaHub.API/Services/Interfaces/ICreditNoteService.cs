using Microsoft.EntityFrameworkCore;
using PharmaHub.API.Common.Models;


namespace PharmaHub.API.Services.Interfaces;

public interface ICreditNoteService
{
  Task<bool> CreateCreditNoteAsync(CreditNoteCreateDto request, CancellationToken cancellationToken = default);
  Task<CreditNoteBasicDto?> GetCreditNoteAsync(int id, CancellationToken cancellationToken = default);
  Task<PaginatedResponse<CreditNoteBasicDto>> GetCreditNotesAsync(int pageNumber, int pageSize, CancellationToken cancellationToken = default);
  public Task<bool> DeleteCreditNote(int id, CancellationToken cancellationToken = default);
  public Task<bool> UpdateCreditNote(int id, CreditNoteUpdateDto request, CancellationToken cancellationToken = default);
}
public class CreditNoteService(ApplicationDbContext dbContext, ICurrentUser currentUser) : ICreditNoteService
{
  public async Task<bool> CreateCreditNoteAsync(CreditNoteCreateDto request, CancellationToken cancellationToken = default)
  {
    var userId = currentUser.GetUserId();
    CreditNote creditNote = new()
    {
      UserId = userId,
      CreditNoteNumber = request.CreditNoteNumber,
      SupplierId = request.SupplierId
    };
    dbContext.CreditNotes.Add(creditNote);
    await dbContext.SaveChangesAsync(cancellationToken);

    foreach (var item in request.CreditNoteMedications)
    {
      var inventory = await dbContext.Inventories.FindAsync([item.InventoryId], cancellationToken);

      CreditNoteMedications creditNoteMedication = new()
      {
        InventoryId = item.InventoryId,
        EmittedQuantity = item.EmittedQuantity,
        AcceptedQuantity = item.AcceptedQuantity,
        RefusedQuantity = item.RefusedQuantity,
        CreditNoteId = creditNote.Id,
        Motif = item.Motif
      };

      dbContext.CreditNoteMedications.Add(creditNoteMedication);

      if (inventory is not null)
      {
        inventory.Quantity = inventory.Quantity >= item.EmittedQuantity ? inventory.Quantity - item.EmittedQuantity : 0;
      }
    }

    await dbContext.SaveChangesAsync(cancellationToken);
    return true;
  }
  public async Task<CreditNoteBasicDto?> GetCreditNoteAsync(int id, CancellationToken cancellationToken = default)
  {
    return await dbContext.CreditNotes
            .Where(c => c.Id == id)
            .ProjectToType<CreditNoteBasicDto>()
            .FirstOrDefaultAsync(cancellationToken);
  }
  public async Task<PaginatedResponse<CreditNoteBasicDto>> GetCreditNotesAsync(int pageNumber, int pageSize, CancellationToken cancellationToken = default)
  {
    return await dbContext.CreditNotes.ProjectToType<CreditNoteBasicDto>().PaginatedListAsync(pageNumber, pageSize);
  }
  public async Task<bool> DeleteCreditNote(int id, CancellationToken cancellationToken = default)
  {
    var creditNote = await dbContext.CreditNotes.FirstOrDefaultAsync(c => c.Id == id, cancellationToken: cancellationToken);

    if (creditNote is not null)
    {
      dbContext.CreditNotes.Remove(creditNote);
      await dbContext.SaveChangesAsync(cancellationToken);
      return true;
    }
    return false;
  }

  public async Task<bool> UpdateCreditNote(int id, CreditNoteUpdateDto request, CancellationToken cancellationToken = default)
  {
    var creditNote = await dbContext.CreditNotes.FirstOrDefaultAsync(c => c.Id == id, cancellationToken: cancellationToken);

    if (creditNote is not null)
    {
      creditNote.CreditNoteNumber = request.CreditNoteNumber;
      creditNote.SupplierId = request.SupplierId;
      dbContext.CreditNoteMedications.RemoveRange(creditNote.CreditNoteMedications);

      foreach (var item in request.CreditNoteMedications)
      {
        var inventory = await dbContext.Inventories.FindAsync([item.InventoryId], cancellationToken);

        CreditNoteMedications creditNoteMedication = new()
        {
          InventoryId = item.InventoryId,
          EmittedQuantity = item.EmittedQuantity,
          AcceptedQuantity = item.AcceptedQuantity,
          RefusedQuantity = item.RefusedQuantity,
          CreditNoteId = creditNote.Id,
          Motif = item.Motif
        };

        dbContext.CreditNoteMedications.Add(creditNoteMedication);

        if (inventory is not null)
        {
          inventory.Quantity -= item.AcceptedQuantity;
        }
      }

      await dbContext.SaveChangesAsync(cancellationToken);
      return true;
    }
    return false;
  }
}