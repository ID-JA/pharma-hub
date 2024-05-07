using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PharmaHub.Data.Models;
public class SaleDrug:BaseModel
{
   
    public int Quantity { get; set; }
    public double PPV { get; set; }
    public float Discount { get; set; }
    public int SaleId { get; set; }
    public Sale Sale { get; set; }
    public int DrugId { get; set; }
    public Drug Drug { get; set; }

}
