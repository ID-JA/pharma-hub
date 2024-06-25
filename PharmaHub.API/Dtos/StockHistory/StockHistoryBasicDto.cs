namespace PharmaHub.API.Dtos.StockHistory
{
    public class StockHistoryBasicDto : BaseDto<StockHistoryBasicDto, InventoryHistory>
    {
        public int Id { get; set; }
        public int PreviousBoxQuantity { get; set; }
        public int PreviousUnitQuantity { get; set; }
        public int NewBoxQuantity { get; set; }
        public int NewUnitQuantity { get; set; }
        public DateTime ChangeDate { get; set; }
        public string ChangeType { get; set; }
        public int InventoryId { get; set; }
        public int? SaleId { get; set; }
        public int? OrderId { get; set; }
    }
}
