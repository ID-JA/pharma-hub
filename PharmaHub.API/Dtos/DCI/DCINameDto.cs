namespace PharmaHub.API;

public class DciNameDto : BaseDto<DciDto, Dci>
{
    public int Id { get; set; }
    public string Name { get; set; }

}
