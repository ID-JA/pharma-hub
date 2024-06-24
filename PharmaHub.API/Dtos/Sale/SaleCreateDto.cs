namespace PharmaHub.API.Dtos.Sale
{
    public class SaleCreateDto
    {
        public int TotalQuantities { get; set; }
        public string Status { get; set; }
        public decimal DiscountedAmount { get; set; }
        public decimal TotalNetPrices { get; set; }
        public decimal TotalBrutPrices { get; set; }
        public List<SaleMedicationCreateDto> SaleMedications { get; set; }
    }
}
