namespace PharmaHub.API;

public class DciDto : BaseDto<DciDto, Dci>
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
}
