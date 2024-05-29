namespace PharmaHub.API.Dtos.Medicament;

public class MedicationUpdateDto : BaseDto<MedicationUpdateDto, Models.Medicament>
{
    public int Id { get; set; }
    public MedicationCreateDto Detials { get; set; }

}
