using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PharmaHub.API.Migrations
{
    /// <inheritdoc />
    public partial class NewEntitiesUpdateV2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "InventoryId",
                table: "OrderMedicaments",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_OrderMedicaments_InventoryId",
                table: "OrderMedicaments",
                column: "InventoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderMedicaments_Inventories_InventoryId",
                table: "OrderMedicaments",
                column: "InventoryId",
                principalTable: "Inventories",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderMedicaments_Inventories_InventoryId",
                table: "OrderMedicaments");

            migrationBuilder.DropIndex(
                name: "IX_OrderMedicaments_InventoryId",
                table: "OrderMedicaments");

            migrationBuilder.DropColumn(
                name: "InventoryId",
                table: "OrderMedicaments");
        }
    }
}
