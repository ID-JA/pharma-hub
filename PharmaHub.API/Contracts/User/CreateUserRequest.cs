namespace PharmaHub.API.Contracts;

public class UpdateUserRequest
{
    public int Id { get; set; }
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
    public string Cni { get; set; } = default!;
    public char Gender { get; set; }
    public string Phone { get; set; } = default!;
    public string Address { get; set; }= default!;
}