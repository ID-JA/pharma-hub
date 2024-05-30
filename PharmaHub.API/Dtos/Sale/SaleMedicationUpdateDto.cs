﻿namespace PharmaHub.API.Dtos.Sale;

public class SaleMedicationUpdateDto : BaseDto<SaleMedicationUpdateDto, Models.Sale>
{
    public int Id { get; set; }
    public int InventoryId { get; set; }
    public int Quantity { get; set; }
    public double Ppv { get; set; }
    public double TotalPrice { get; set; }
    public float Tva { get; set; }
    public float Discount { get; set; }
}