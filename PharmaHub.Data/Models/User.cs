namespace PharmaHub.Data.Models
{
    public class User : BaseModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string CNI { get; set; }
        public string Password { get; set; }
        public char Gender { get; set; }
        public string Phone { get; set; } 
        public string Email { get; set; }
        public string Adress { get; set; }
        public string Role { get; set; }
        public List<Sale> Sales { get; set; }
        public List<Order> Orders { get; set; }
        public List<Bill> Bills { get; set; }

    }
}
