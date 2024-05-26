using Microsoft.EntityFrameworkCore;

namespace PharmaHub.API.Models;

public class Inventory : BaseModel
{
    public int MedicamentId { get; set; }
    public Medicament Medicament { get; set; } = null!;

    public int Quantity { get; set; }

    public DateTime ExpirationDate { get; set; }

    [Precision(10, 2)]
    public decimal PPV { get; set; } //maybe we will need to move prices propreties to new table (StockMedicament)

    [Precision(10, 2)]
    public decimal PPH { get; set; }
}