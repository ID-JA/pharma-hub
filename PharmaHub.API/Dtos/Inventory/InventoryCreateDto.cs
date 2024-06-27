namespace PharmaHub.API.Dtos.Inventory;

public class InventoryCreateDto : BaseDto<InventoryCreateDto, Models.Inventory>
{
    public int Quantity { get; set; }

    public DateTime ExpirationDate { get; set; }

    public decimal Ppv { get; set; }

    public decimal Pph { get; set; }
}
