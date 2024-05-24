namespace PharmaHub.API.Models;
public class Type : BaseModel
{
  public string Name { get; set; }
  public string Code { get; set; }
  public float Marge { get; set; }
  public float TVA { get; set; }
  public string TaxNature { get; set; }
  public float SalesDiscountRate { get; set; }

}