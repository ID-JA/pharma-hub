namespace PharmaHub.API.Dtos;

public class OrderMedicamentDto

{
    public int MedicamentId { get; set; }
    public int Quantity { get; set; } = 0;
    public decimal PPV { get; set; }
    public decimal PPH { get; set; }

    public int InventoryId { get; set; }
}
