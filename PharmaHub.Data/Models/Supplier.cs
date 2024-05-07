using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PharmaHub.Data.Models;
public class Supplier:BaseModel
{
    public string Name { get; set; }
    public string Fax { get; set; }
    public string Phone { get; set; }

}
