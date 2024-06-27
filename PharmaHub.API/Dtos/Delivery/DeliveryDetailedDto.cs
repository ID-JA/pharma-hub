using PharmaHub.API.Dtos.Inventory;
using PharmaHub.API.Dtos.Supplier;
using PharmaHub.API.Dtos.User;

namespace PharmaHub.API.Dtos.Delivery;

public class DeliveryDetailedDto : BaseDto<DeliveryDetailedDto, Models.Delivery>
{
    public int Id { get; set; }
    public int TotalQuantity { get; set; }
    public int DeliveryNumber { get; set; }
    public decimal TotalPpv { get; set; }
    public decimal TotalFreePpv { get; set; }
    public decimal TotalNetPph { get; set; }
    public decimal TotalBrutPph { get; set; }
    public decimal DiscountedAmount { get; set; }
    public DateTime DeliveryDate { get; set; }
    public UserBasicDto User { get; set; }
    public SupplierBasicDto? Supplier { get; set; }
    public List<OrderDeliveryInventoryBasicDto> OrderDeliveryInventories { get; set; }

}

public class OrderDeliveryInventoryBasicDto : BaseDto<OrderDeliveryInventoryBasicDto, OrderDeliveryInventory>
{
    public int Id { get; set; }
    public OrderBasicDto Order { get; set; }
    public InventoryDetailedDto Inventory { get; set; }

    public int OrderedQuantity { get; set; }

    public int DeliveredQuantity { get; set; }

    public decimal Ppv { get; set; }

    public decimal Pph { get; set; }

    public decimal TotalPurchasePrice { get; set; }

    public decimal PurchasePriceUnit { get; set; }

    public double DiscountRate { get; set; }

    public string Status { get; set; }
    public int TotalFreeUnits { get; set; }
}

public class BillBasic : BaseDto<BillBasic, Models.Bill>
{
    public int Id { get; set; }
}
