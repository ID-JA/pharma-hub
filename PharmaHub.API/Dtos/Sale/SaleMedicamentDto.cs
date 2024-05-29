using PharmaHub.API.Dtos.Medicament;

namespace PharmaHub.API.Dtos.Sale;

public class SaleMedicamentDto  : BaseDto<SaleMedicamentDto, Models.Sale>
{
public int Id { get; set; }
public int MedicamentId { get; set; }
public MedicationBasicDto Medication { get; set; }
public int Quantity { get; set; }
public double PPV { get; set; }
public double TotalPrice { get; set; }
public float TVA { get; set; }
public float Discount { get; set; }
}