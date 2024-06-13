namespace PharmaHub.API.Dtos;

public class TypeDto : BaseDto<TypeDto, Models.Tax>
{
  public int Id { get; set; }
  public string Name { get; set; }
  public string Code { get; set; }
  public float Marge { get; set; }
  public float Tva { get; set; }
  public string TaxNature { get; set; }
  public float SalesDiscountRate { get; set; }

}
