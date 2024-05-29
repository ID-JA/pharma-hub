namespace PharmaHub.API.Dtos.Medicament;

public class MedicationUpdateDto : BaseDto<MedicationUpdateDto, Models.Medication>
{
    public int Id { get; set; }
    public MedicationCreateDto Detials { get; set; }

}
