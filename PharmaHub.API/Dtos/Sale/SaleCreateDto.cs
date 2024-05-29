namespace PharmaHub.API.Dtos.Sale
{
    public class SaleCreateDto
    {
        public int TotalQuantity { get; set; }
        public double TotalPrice { get; set; }
        public string Status { get; set; }
        public float Discount { get; set; }
        public int SaleNumber { get; set; }
        public int UserId { get; set; }
        public List<SaleMedicationCreateDto> SaleMedications { get; set; }
    }
}
