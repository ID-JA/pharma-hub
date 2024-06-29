namespace PharmaHub.API.Models;

public class ClientCreateDto : BaseDto<ClientCreateDto, Client>
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
