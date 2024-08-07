using Microsoft.EntityFrameworkCore;
using PharmaHub.API.Common.Models;


namespace PharmaHub.API.Services.Interfaces;

public interface ICreditNoteService
{
    Task<bool> CreateCreditNoteAsync(CreditNoteCreateDto request, CancellationToken cancellationToken = default);
    Task<CreditNoteBasicDto?> GetCreditNoteAsync(int id, CancellationToken cancellationToken = default);
    Task<bool> DeleteCreditNote(int id, CancellationToken cancellationToken = default);
    Task<bool> UpdateCreditNote(int id, CreditNoteUpdateDto request, CancellationToken cancellationToken = default);
    Task<CreditNoteDetailDto?> GetCreditNoteDetails(int creditNoteNumber, CancellationToken cancellationToken = default);
    Task<PaginatedResponse<CreditNoteDetailDto>> SearchCreditNoteDetailsAsync(int? creditNoteNumber = null, DateTime? from = null, DateTime? to = null, int? supplierId = null, int pageNumber = 1, int pageSize = 10, CancellationToken cancellationToken = default);

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

            CreditNoteMedication creditNoteMedication = new()
            {
                InventoryId = item.InventoryId,
                IssuedQuantity = item.IssuedQuantity,
                CreditNoteId = creditNote.Id,
                Motif = item.Motif
            };

            dbContext.CreditNoteMedications.Add(creditNoteMedication);

            if (inventory is not null)
            {
                inventory.BoxQuantity = inventory.BoxQuantity >= item.IssuedQuantity ? inventory.BoxQuantity - item.IssuedQuantity : 0;
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
        using var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);

        try
        {
            var existingCreditNote = await dbContext.CreditNotes
               .Include(cn => cn.CreditNoteMedications)
               .ThenInclude(cnm => cnm.Inventory)
               .FirstOrDefaultAsync(cn => cn.Id == id, cancellationToken);

            if (existingCreditNote is null) return false;

            var requestItemIds = request.CreditNoteMedications.Select(cnm => cnm.InventoryId).ToList();

            var deletedItems = existingCreditNote.CreditNoteMedications
                .Where(oldItem => !requestItemIds.Contains(oldItem.InventoryId))
                .ToList();

            var inventoryUpdates = new Dictionary<int, int>();

            foreach (var item in deletedItems)
            {
                if (!inventoryUpdates.ContainsKey(item.InventoryId))
                {
                    inventoryUpdates[item.InventoryId] = 0;
                }
                inventoryUpdates[item.InventoryId] += item.AcceptedQuantity;
                dbContext.CreditNoteMedications.Remove(item);
            }

            foreach (var item in request.CreditNoteMedications)
            {
                var creditNoteMedication = existingCreditNote.CreditNoteMedications
                    .FirstOrDefault(cnm => cnm.InventoryId == item.InventoryId);

                if (creditNoteMedication == null)
                {
                    creditNoteMedication = new CreditNoteMedication
                    {
                        InventoryId = item.InventoryId,
                        IssuedQuantity = item.IssuedQuantity,
                        AcceptedQuantity = item.AcceptedQuantity,
                        RefusedQuantity = item.RefusedQuantity,
                        CreditNoteId = existingCreditNote.Id,
                        Motif = item.Motif
                    };
                    dbContext.CreditNoteMedications.Add(creditNoteMedication);
                }
                else
                {
                    if (!inventoryUpdates.ContainsKey(creditNoteMedication.InventoryId))
                    {
                        inventoryUpdates[creditNoteMedication.InventoryId] = 0;
                    }
                    inventoryUpdates[creditNoteMedication.InventoryId] += creditNoteMedication.AcceptedQuantity;

                    creditNoteMedication.IssuedQuantity = item.IssuedQuantity;
                    creditNoteMedication.AcceptedQuantity = item.AcceptedQuantity;
                    creditNoteMedication.RefusedQuantity = item.RefusedQuantity;
                    creditNoteMedication.Motif = item.Motif;

                    dbContext.CreditNoteMedications.Update(creditNoteMedication);
                }

                if (!inventoryUpdates.ContainsKey(item.InventoryId))
                {
                    inventoryUpdates[item.InventoryId] = 0;
                }
                inventoryUpdates[item.InventoryId] -= item.AcceptedQuantity;
            }

            var inventoryIds = inventoryUpdates.Keys.ToList();
            var inventories = await dbContext.Inventories
                .Where(inv => inventoryIds.Contains(inv.Id))
                .ToListAsync(cancellationToken);

            foreach (var inventory in inventories)
            {
                inventory.BoxQuantity += inventoryUpdates[inventory.Id];
                dbContext.Inventories.Update(inventory);
            }

            existingCreditNote.CreditNoteNumber = request.CreditNoteNumber;
            existingCreditNote.SupplierId = request.SupplierId;
            dbContext.CreditNotes.Update(existingCreditNote);

            await dbContext.SaveChangesAsync(cancellationToken);

            return true;
        }
        catch (Exception)
        {
            await transaction.RollbackAsync(cancellationToken);
            return false;
        }
    }

    public async Task<PaginatedResponse<CreditNoteDetailDto>> SearchCreditNoteDetailsAsync(int? creditNoteNumber = null, DateTime? from = null, DateTime? to = null, int? supplierId = null, int pageNumber = 1, int pageSize = 10, CancellationToken cancellationToken = default)
    {
        if (!from.HasValue && !to.HasValue)
        {
            to = DateTime.UtcNow.Date;
            from = to.Value.AddDays(-6);
        }

        if (from.HasValue && to.HasValue && from > to)
        {
            (from, to) = (to, from);
        }

        if (to.HasValue)
        {
            to = to.Value.Date.AddDays(1).AddTicks(-1);
        }

        var query = dbContext.CreditNotes
            .Where(s => (!from.HasValue || s.CreatedAt >= from) && (!to.HasValue || s.CreatedAt <= to) && s.BillId == null)
            .Include(d => d.CreditNoteMedications)
            .AsNoTracking();

        if (creditNoteNumber.HasValue)
        {
            query = query.Where(d => d.CreditNoteNumber == creditNoteNumber.Value);
        }


        if (supplierId.HasValue && supplierId.Value > 0)
        {
            query = query.Where(d => d.SupplierId == supplierId.Value);
        }

        var result = await query
            .OrderBy(d => d.CreatedAt)
            .ProjectToType<CreditNoteDetailDto>()
            .PaginatedListAsync(pageNumber, pageSize);

        return result;
    }

    public async Task<CreditNoteDetailDto?> GetCreditNoteDetails(int creditNoteNumber, CancellationToken cancellationToken = default)
    {
        var result = await dbContext.CreditNotes.Where(d => d.CreditNoteNumber == creditNoteNumber)
            .Include(d => d.CreditNoteMedications)
            .ProjectToType<CreditNoteDetailDto>().AsNoTracking().FirstOrDefaultAsync(cancellationToken: cancellationToken);
        return result;
    }


    public async Task<bool> UpdateCreditNoteMedicationAsync(int creditNoteId, CreditNoteMedicationCreateDto request, CancellationToken cancellationToken = default)
    {
        // Check if the CreditNoteMedications already exists
        var creditNoteMedication = await dbContext.CreditNoteMedications
            .FirstOrDefaultAsync(cnm => cnm.InventoryId == request.InventoryId && cnm.CreditNoteId == creditNoteId, cancellationToken);
        var inventory = await dbContext.Inventories
            .AsNoTracking()
            .FirstOrDefaultAsync(i => i.Id == request.InventoryId);

        if (creditNoteMedication != null && inventory != null)
        {
            creditNoteMedication.AcceptedQuantity = request.AcceptedQuantity;
            creditNoteMedication.IssuedQuantity = request.IssuedQuantity;
            creditNoteMedication.Motif = request.Motif;
            creditNoteMedication.RefusedQuantity = request.RefusedQuantity;
            inventory.BoxQuantity -= request.AcceptedQuantity + request.RefusedQuantity;
            dbContext.Inventories.Update(inventory);
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
            inventory.BoxQuantity += creditNoteMedication.IssuedQuantity;
            dbContext.Inventories.Update(inventory);
        }
        dbContext.CreditNoteMedications.Remove(creditNoteMedication);
        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }

    public Task<bool> CreateCreditNoteMedicationAsync(int creditNoteId, CreditNoteMedicationCreateDto request, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }
}


