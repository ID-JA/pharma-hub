using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PharmaHub.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDbV7 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InventoryHistories_Deliveries_OrderId",
                table: "InventoryHistories");

            migrationBuilder.RenameColumn(
                name: "OrderId",
                table: "InventoryHistories",
                newName: "OrderDeliveryInventoryId");

            migrationBuilder.RenameIndex(
                name: "IX_InventoryHistories_OrderId",
                table: "InventoryHistories",
                newName: "IX_InventoryHistories_OrderDeliveryInventoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_InventoryHistories_OrderDeliveryInventories_OrderDeliveryInventoryId",
                table: "InventoryHistories",
                column: "OrderDeliveryInventoryId",
                principalTable: "OrderDeliveryInventories",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InventoryHistories_OrderDeliveryInventories_OrderDeliveryInventoryId",
                table: "InventoryHistories");

            migrationBuilder.RenameColumn(
                name: "OrderDeliveryInventoryId",
                table: "InventoryHistories",
                newName: "OrderId");

            migrationBuilder.RenameIndex(
                name: "IX_InventoryHistories_OrderDeliveryInventoryId",
                table: "InventoryHistories",
                newName: "IX_InventoryHistories_OrderId");

            migrationBuilder.AddForeignKey(
                name: "FK_InventoryHistories_Deliveries_OrderId",
                table: "InventoryHistories",
                column: "OrderId",
                principalTable: "Deliveries",
                principalColumn: "Id");
        }
    }
}
