using PharmaHub.API.Dtos.Inventory;
using PharmaHub.API.Dtos.Medicament;
using PharmaHub.API.Dtos.Order;
using PharmaHub.API.Dtos.Sale;

namespace PharmaHub.API.Dtos.StockHistory
{
    public class StockHistoryDetailedDto
    {
        public int Id { get; set; }
        public int QuantityChanged { get; set; }
        public MedicationBasicDto Medication { get; set; }
        public InventoryBasicDto Inventory { get; set; }
        public SaleBasicDto? Sale { get; set; }
        public OrderBasicDto? Order { get; set; }
    }
}
