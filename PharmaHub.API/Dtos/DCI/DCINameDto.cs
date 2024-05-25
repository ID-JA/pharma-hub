namespace PharmaHub.API;

public class DCINameDto : BaseDto<DCIDto, DCI>
{
  public int Id { get; set; }
  public string Name { get; set; }

}