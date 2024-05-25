namespace PharmaHub.API.Dtos;

public class FormNameDto : BaseDto<FormNameDto, Form>
{
  public int Id { get; set; }
  public string Name { get; set; }

}