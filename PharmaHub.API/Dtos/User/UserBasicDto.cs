namespace PharmaHub.API.Dtos.User;
public class UserBasicDto : BaseDto<UserBasicDto, Models.User>
{
    public int Id { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }

    public override void AddCustomMappings()
    {
        SetCustomMappingsInverse()
            .Map(src => src.FullName, dest => $"{dest.FirstName} {dest.LastName}");
    }
}
