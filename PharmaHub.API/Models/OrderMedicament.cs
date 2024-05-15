namespace PharmaHub.API;

public class OrderMedicament
{
    public int OrderId { get; set; }
    public Order Order { get; set; } = null!;
    public int MedicamentId { get; set; }
    public Medicament Medicament { get; set; } = null!;
    public int Quantity { get; set; } = 0;
}
