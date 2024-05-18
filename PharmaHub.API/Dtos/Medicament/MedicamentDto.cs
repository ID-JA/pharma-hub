namespace PharmaHub.API.Dtos;

public class MedicamentDto : CreateMedicamentDto
{
    public int Id { get; set; }
    public int Quantity { get; set; }
    public string Status { get; set; }
}
