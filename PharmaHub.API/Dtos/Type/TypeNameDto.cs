namespace PharmaHub.API.Dtos;

public class TypeNameDto : BaseDto<TypeNameDto, Models.Type>
{
  public int Id { get; set; }
  public string Name { get; set; }


}