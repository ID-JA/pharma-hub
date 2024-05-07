namespace PharmaHub.Data.Models;
public class StockHistory : BaseModel
{
    public int QuantityChanged { get; set; }
    public int DrugId { get; set; }
    public Drug Drug { get; set; }
    // todo: add FK Sale and ORDER ids
    public List<Drug> Drugs { get; set; }
}
