using PharmaHub.API.Dtos.Medicament;

namespace PharmaHub.API.Dtos.Sale;

public class SaleMedicationDto  : BaseDto<SaleMedicationDto, Models.Sale>
{
public int Id { get; set; }
public int MedicationId { get; set; }
public MedicationBasicDto Medication { get; set; }
public int Quantity { get; set; }
public double Ppv { get; set; }
public double TotalPrice { get; set; }
public float Tva { get; set; }
public float Discount { get; set; }
}