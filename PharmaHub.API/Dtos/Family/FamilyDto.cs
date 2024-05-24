namespace PharmaHub.API;

public class FamilyDto : BaseDto<FamilyDto, Family>
{
    public string Name { get; set; }
    public string Code { get; set; }
}
