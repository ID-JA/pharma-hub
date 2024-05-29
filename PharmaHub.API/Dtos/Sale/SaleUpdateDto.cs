namespace PharmaHub.API.Dtos.Sale
{
    public class SaleUpdateDto
    {
        public int Id { get; set; }
        public int TotalQuantity { get; set; }
        public double TotalPrice { get; set; }
        public string? Status { get; set; }
        public float Discount { get; set; }
        public int SaleNumber { get; set; }
        public List<SaleMedicamentUpdateDto> SaleMedicaments { get; set; }
    }
}
