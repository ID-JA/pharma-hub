namespace PharmaHub.API.Dtos.StockHistory
{
    public class StockHistoryBasicDto : BaseDto<StockHistoryBasicDto, Models.InventoryHistory>
    {
        public int Id { get; set; }
        public int QuantityChanged { get; set; }
        public int MedicationId { get; set; }
        public int InventoryId { get; set; }
        public int? SaleId { get; set; }
        public int? OrderId { get; set; }
    }
}
