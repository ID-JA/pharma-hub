namespace PharmaHub.API.Dtos;

public class SaleDto : BaseDto<SaleDto, Sale>
{
    public int Id { get; set; }
    public int TotalQuantity { get; set; }
    public int TotalPrice { get; set; }
    public string Status { get; set; } = "Pending";
    public float Discount { get; set; }
    public List<SaleMedicamentDto> SaleMedicaments { get; set; } = [];
}

public class SaleMedicamentDto : BaseDto<SaleMedicamentDto, SaleMedicament>
{
    public int MedicamentId { get; set; }
    public int Quantity { get; set; }
    public int PPV { get; set; }
    public float Discount { get; set; }
    public double TotalPrice { get; set; }
    public int TVA { get; set; }
}
