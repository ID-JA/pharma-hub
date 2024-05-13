namespace PharmaHub.API.Dtos;

public class CreateMedicamentHistoryDto : BaseDto<CreateMedicamentHistoryDto, StockHistory>
{
    public int QuantityChanged { get; set; }
    public int MedicamentId { get; set; }
    public int? SaleId { get; set; }
    public int? OrderId { get; set; }
}
