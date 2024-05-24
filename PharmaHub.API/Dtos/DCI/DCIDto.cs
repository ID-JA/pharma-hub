namespace PharmaHub.API;

public class DCIDto: BaseDto<DCIDto, DCI>
{
   public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
}
