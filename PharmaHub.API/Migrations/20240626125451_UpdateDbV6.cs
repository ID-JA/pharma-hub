using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PharmaHub.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDbV6 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InventoryHistories_Sales_SaleId",
                table: "InventoryHistories");

            migrationBuilder.RenameColumn(
                name: "SaleId",
                table: "InventoryHistories",
                newName: "SaleMedicationId");

            migrationBuilder.RenameIndex(
                name: "IX_InventoryHistories_SaleId",
                table: "InventoryHistories",
                newName: "IX_InventoryHistories_SaleMedicationId");

            migrationBuilder.AddForeignKey(
                name: "FK_InventoryHistories_SaleMedications_SaleMedicationId",
                table: "InventoryHistories",
                column: "SaleMedicationId",
                principalTable: "SaleMedications",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InventoryHistories_SaleMedications_SaleMedicationId",
                table: "InventoryHistories");

            migrationBuilder.RenameColumn(
                name: "SaleMedicationId",
                table: "InventoryHistories",
                newName: "SaleId");

            migrationBuilder.RenameIndex(
                name: "IX_InventoryHistories_SaleMedicationId",
                table: "InventoryHistories",
                newName: "IX_InventoryHistories_SaleId");

            migrationBuilder.AddForeignKey(
                name: "FK_InventoryHistories_Sales_SaleId",
                table: "InventoryHistories",
                column: "SaleId",
                principalTable: "Sales",
                principalColumn: "Id");
        }
    }
}
