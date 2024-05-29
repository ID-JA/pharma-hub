namespace PharmaHub.API.Dtos.Sale
{
    public class SaleBasicDto
    {
        public int Id { get; set; }
        public int TotalQuantity { get; set; }
        public double TotalPrice { get; set; }
        public string Status { get; set; }
        public float Discount { get; set; }
        public int SaleNumber { get; set; }
        public int UserId { get; set; }
    }
}
