namespace PharmaHub.API.Dtos;

public class FamilyNameDto : BaseDto<FamilyNameDto, Family>
{
  public int Id { get; set; }
  public string Name { get; set; }

}