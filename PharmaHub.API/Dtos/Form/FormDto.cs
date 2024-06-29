namespace PharmaHub.API.Dtos;

public class FormDto : BaseDto<FormDto, Form>
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Code { get; set; }
    public string? Description { get; set; }

}
