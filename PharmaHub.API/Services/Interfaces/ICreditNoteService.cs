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
  public Task<bool> UpdateCreditNoteMedicationAsync(int creditNoteId, CreditNoteMedicationCreateDto request, CancellationToken cancellationToken = default);
  public Task<bool> DeleteCreditNoteMedicationAsync(int creditNoteId, int inventoryId, CancellationToken cancellationToken = default);

  // CreditNoteMedication methods
  Task<bool> CreateCreditNoteMedicationAsync(int creditNoteId, CreditNoteMedicationCreateDto request, CancellationToken cancellationToken = default);

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

  public async Task<bool> CreateCreditNoteMedicationAsync(int creditNoteId, CreditNoteMedicationCreateDto request, CancellationToken cancellationToken = default)
  {
    // var creditNoteMedication = await dbContext.CreditNoteMedications.FindAsync([request.InventoryId, creditNoteId]);
    // if(creditNoteMedication is null ) return false;
    var newCreditNoteMedication = new CreditNoteMedications
    {
      AcceptedQuantity = request.AcceptedQuantity,
      EmittedQuantity = request.EmittedQuantity,
      Motif = request.Motif,
      RefusedQuantity = request.RefusedQuantity,
      InventoryId = request.InventoryId,
      CreditNoteId = creditNoteId,
    };

    dbContext.CreditNoteMedications.Add(newCreditNoteMedication);
    await dbContext.SaveChangesAsync();


    var inventory = await dbContext.Inventories.FindAsync([request.InventoryId], cancellationToken);

    if (inventory is not null)
    {
      inventory.Quantity = inventory.Quantity >= request.EmittedQuantity ? inventory.Quantity - request.EmittedQuantity : 0;
      dbContext.Inventories.Update(inventory);
      await dbContext.SaveChangesAsync();
    }

    return true;
  }
  public async Task<bool> UpdateCreditNoteMedicationAsync(int creditNoteId, CreditNoteMedicationCreateDto request, CancellationToken cancellationToken = default)
  {
    // Check if the CreditNoteMedications already exists
    var creditNoteMedication = await dbContext.CreditNoteMedications
        .FirstOrDefaultAsync(cnm => cnm.InventoryId == request.InventoryId && cnm.CreditNoteId == creditNoteId, cancellationToken);

    if (creditNoteMedication != null)
    {
      // Update the existing CreditNoteMedications entity
      creditNoteMedication.AcceptedQuantity = request.AcceptedQuantity;
      creditNoteMedication.EmittedQuantity = request.EmittedQuantity;
      creditNoteMedication.Motif = request.Motif;
      creditNoteMedication.RefusedQuantity = request.RefusedQuantity;

      dbContext.CreditNoteMedications.Update(creditNoteMedication);
      await dbContext.SaveChangesAsync(cancellationToken);

    }
    return true;

  }


  public async Task<bool> DeleteCreditNoteMedicationAsync(int creditNoteId, int inventoryId, CancellationToken cancellationToken = default)
  {
    var creditNoteMedication = await dbContext.CreditNoteMedications
        .FirstOrDefaultAsync(cnm => cnm.CreditNoteId == creditNoteId && cnm.InventoryId == inventoryId, cancellationToken);

    if (creditNoteMedication == null)
    {
      return false;
    }
    var inventory = await dbContext.Inventories.FindAsync([inventoryId], cancellationToken);
    if (inventory != null)
    {
      inventory.Quantity += creditNoteMedication.EmittedQuantity;
      dbContext.Inventories.Update(inventory);
    }
    dbContext.CreditNoteMedications.Remove(creditNoteMedication);
    await dbContext.SaveChangesAsync(cancellationToken);
    return true;
  }





}


