using Microsoft.EntityFrameworkCore;

namespace PharmaHub.API.Models;
public class Client : BaseModel
{

  public string FullName { get; set; }
  public string Type { get; set; }
  [Precision(10, 2)]
  public decimal Limit { get; set; }
  public string Email { get; set; }
  public string Photo { get; set; }
  public string Address { get; set; }
  public string Notes { get; set; }
  [Precision(10, 2)]
  public decimal AffiliationNumber { get; set; }
  [Precision(10, 2)]
  public decimal InscriptionNumber { get; set; }
}