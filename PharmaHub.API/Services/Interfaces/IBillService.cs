﻿using Microsoft.EntityFrameworkCore;
using PharmaHub.API.Common.Models;

namespace PharmaHub.API.Services.Interfaces;

public interface IBillService
{
    Task<bool> CreateBillAsync(BillCreateDto request, CancellationToken cancellationToken = default);
    Task<BillBasicDto?> GetBillAsync(int id, CancellationToken cancellationToken = default);
    Task<PaginatedResponse<BillBasicDto>> GetBillsAsync(int pageNumber, int pageSize, CancellationToken cancellationToken = default);
    public Task<bool> DeleteBill(int id, CancellationToken cancellationToken = default);
    public Task<bool> UpdateBill(int id, BillUpdateDto request, CancellationToken cancellationToken = default);

}
public class BillService(ApplicationDbContext dbContext, ICurrentUser currentUser) : IBillService
{

    public async Task<bool> CreateBillAsync(BillCreateDto request, CancellationToken cancellationToken = default)
    {
        using var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);
        try
        {
            var userId = currentUser.GetUserId();
            Bill bill = new()
            {
                UserId = userId,
                BillNumber = request.BillNumber,
                BillDate = request.BillDate,
                PaymentType = request.PaymentType,
                CheckNumber = request.CheckNumber,
                EffectNumber = request.EffectNumber,
                DueDate = request.DueDate,
                DisbursementDate = request.DisbursementDate,
                BankName = request.BankName,
                TotalPayment = request.TotalPayment,
                Status = "Paid"
            };

            dbContext.Bills.Add(bill);
            await dbContext.SaveChangesAsync(cancellationToken);

            if (request.DeliveriesIds?.Any() == true)
            {
                var deliveries = await dbContext.Deliveries
                    .Where(d => request.DeliveriesIds.Contains(d.Id))
                    .ToListAsync(cancellationToken);

                foreach (var delivery in deliveries)
                {
                    delivery.BillId = bill.Id;
                }

                dbContext.Deliveries.UpdateRange(deliveries);
            }

            if (request.CreditNotesIds?.Any() == true)
            {
                var creditNotes = await dbContext.CreditNotes
                    .Where(cn => request.CreditNotesIds.Contains(cn.Id))
                    .ToListAsync(cancellationToken);

                foreach (var creditNote in creditNotes)
                {
                    creditNote.BillId = bill.Id;
                }

                dbContext.CreditNotes.UpdateRange(creditNotes);
            }

            await dbContext.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);

            return true;
        }
        catch
        {
            await transaction.RollbackAsync(cancellationToken);
            throw;
        }
    }

    public async Task<BillBasicDto?> GetBillAsync(int id, CancellationToken cancellationToken = default)
    {
        return await dbContext.Bills
                .Where(b => b.Id == id)
                .ProjectToType<BillBasicDto>()
                .FirstOrDefaultAsync(cancellationToken);
    }
    public async Task<PaginatedResponse<BillBasicDto>> GetBillsAsync(int pageNumber, int pageSize, CancellationToken cancellationToken = default)
    {
        return await dbContext.Bills.ProjectToType<BillBasicDto>().PaginatedListAsync(pageNumber, pageSize);
    }
    public async Task<bool> DeleteBill(int id, CancellationToken cancellationToken = default)
    {
        var bill = await dbContext.Bills.FirstOrDefaultAsync(b => b.Id == id, cancellationToken: cancellationToken);
        if (bill is not null)
        {
            var deliveries = await dbContext.Deliveries.Where(d => d.Id == id).ToListAsync(cancellationToken);
            foreach (var item in deliveries)
            {
                item.BillId = null;
                dbContext.Deliveries.Update(item);
            }
            dbContext.Bills.Remove(bill);
            await dbContext.SaveChangesAsync(cancellationToken);
        }

        return true;

    }
    public async Task<bool> UpdateBill(int id, BillUpdateDto request, CancellationToken cancellationToken = default)
    {
        var bill = await dbContext.Bills.FirstOrDefaultAsync(b => b.Id == id, cancellationToken: cancellationToken);

        if (bill is not null)
        {
            bill.BillNumber = request.BillNumber;
            bill.BillDate = request.BillDate;
            bill.PaymentType = request.PaymentType;
            bill.CheckNumber = request.CheckNumber;
            bill.EffectNumber = request.EffectNumber;
            bill.DueDate = request.DueDate;
            bill.DisbursementDate = request.DisbursementDate;
            bill.BankName = request.BankName;
            bill.TotalPayment = request.TotalPayment;

            dbContext.Bills.Update(bill);
            await dbContext.SaveChangesAsync(cancellationToken);
            return true;
        }
        return false;
    }

}
