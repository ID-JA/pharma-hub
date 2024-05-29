namespace PharmaHub.API.Dtos.Inventory;

public class InventoryUpdateDto : BaseDto<InventoryUpdateDto, Models.Inventory>
{
    public int Id { get; set; }

    public int Quantity { get; set; }

    public DateTime ExpirationDate { get; set; }

    public decimal Ppv { get; set; }

    public decimal Pph { get; set; }
}