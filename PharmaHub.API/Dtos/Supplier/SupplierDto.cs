namespace PharmaHub.API;

public class SupplierDto : BaseDto<SupplierDto, Supplier>
{
    public int? Id { get; set; }
    public string Name { get; set; }
    public string Fax { get; set; }
    public string Phone { get; set; }
}
