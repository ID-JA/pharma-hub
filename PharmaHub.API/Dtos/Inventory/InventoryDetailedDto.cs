﻿using PharmaHub.API.Dtos.Medicament;

namespace PharmaHub.API.Dtos.Inventory;

public class InventoryDetailedDto : BaseDto<InventoryDetailedDto, Models.Inventory>
{
    public int Id { get; set; }
    public int MedicationId { get; set; }
    public int UnitQuantity { get; set; }
    public int BoxQuantity { get; set; }
    public DateTime ExpirationDate { get; set; }
    public decimal Ppv { get; set; }
    public decimal Pph { get; set; }
    public MedicationBasicDto Medication { get; set; }
}
