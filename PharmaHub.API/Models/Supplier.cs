namespace PharmaHub.API.Models;
public class Supplier : BaseModel
{
    public string Name { get; set; }
    public string Fax { get; set; }
    public string Phone { get; set; }
    public List<Delivery> Orders { get; set; } = [];
}
