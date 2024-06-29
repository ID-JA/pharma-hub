using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PharmaHub.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDbV8 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "EmittedQuantity",
                table: "CreditNoteMedications",
                newName: "IssuedQuantity");

            migrationBuilder.AddColumn<int>(
                name: "CreditNoteId",
                table: "InventoryHistories",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Motif",
                table: "CreditNoteMedications",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_InventoryHistories_CreditNoteId",
                table: "InventoryHistories",
                column: "CreditNoteId");

            migrationBuilder.AddForeignKey(
                name: "FK_InventoryHistories_CreditNotes_CreditNoteId",
                table: "InventoryHistories",
                column: "CreditNoteId",
                principalTable: "CreditNotes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InventoryHistories_CreditNotes_CreditNoteId",
                table: "InventoryHistories");

            migrationBuilder.DropIndex(
                name: "IX_InventoryHistories_CreditNoteId",
                table: "InventoryHistories");

            migrationBuilder.DropColumn(
                name: "CreditNoteId",
                table: "InventoryHistories");

            migrationBuilder.RenameColumn(
                name: "IssuedQuantity",
                table: "CreditNoteMedications",
                newName: "EmittedQuantity");

            migrationBuilder.AlterColumn<string>(
                name: "Motif",
                table: "CreditNoteMedications",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }
    }
}
