namespace PharmaHub.API.Dtos.StockHistory
{
    public class StockHistoryCreateDto : BaseDto<StockHistoryCreateDto, Models.StockHistory>
    {
        public int QuantityChanged { get; set; }
        public int MedicamentId { get; set; }
        public int InventoryId { get; set; }
        public int? SaleId { get; set; }
        public int? OrderId { get; set; }
    }
}
