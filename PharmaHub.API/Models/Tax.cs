namespace PharmaHub.API.Models;
public class Tax : BaseModel
{
    public string Name { get; set; }
    public string Code { get; set; }
    public float Marge { get; set; }
    public float Tva { get; set; }
    public string TaxNature { get; set; }
    public float SalesDiscountRate { get; set; }
}
