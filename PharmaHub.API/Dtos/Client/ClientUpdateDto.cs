namespace PharmaHub.API;

public class ClientUpdateDto : BaseDto<ClientUpdateDto, Client>
{
    public string FullName { get; set; }
    public string Type { get; set; }
    public decimal Limit { get; set; }
    public string Email { get; set; }
    public string Photo { get; set; }
    public string Address { get; set; }
    public string Notes { get; set; }
    public decimal AffiliationNumber { get; set; }
    public decimal InscriptionNumber { get; set; }
}
