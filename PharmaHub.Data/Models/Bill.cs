using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PharmaHub.Data.Models;
public class Bill:BaseModel
{
    public List<DeliveryNote> DeliveryNotes { get; set; }

}
