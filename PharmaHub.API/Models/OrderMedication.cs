﻿using Microsoft.EntityFrameworkCore;

namespace PharmaHub.API.Models;

public class DeliveryMedication
{
    public int DeliveryId { get; set; }
    public Delivery Delivery { get; set; } = null!;
    public int Quantity { get; set; } = 0;
    [Precision(10, 2)]
    public decimal Ppv { get; set; }
    [Precision(10, 2)]
    public decimal Pph { get; set; }
    public int InventoryId { get; set; }
    public Inventory Inventory { get; set; } = null!;
}
