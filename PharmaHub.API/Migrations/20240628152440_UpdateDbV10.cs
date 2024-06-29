using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PharmaHub.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDbV10 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CreditNotes_Suppliers_SupplierId",
                table: "CreditNotes");

            migrationBuilder.AlterColumn<int>(
                name: "SupplierId",
                table: "CreditNotes",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "BillId",
                table: "CreditNotes",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_CreditNotes_BillId",
                table: "CreditNotes",
                column: "BillId");

            migrationBuilder.AddForeignKey(
                name: "FK_CreditNotes_Bills_BillId",
                table: "CreditNotes",
                column: "BillId",
                principalTable: "Bills",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CreditNotes_Suppliers_SupplierId",
                table: "CreditNotes",
                column: "SupplierId",
                principalTable: "Suppliers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CreditNotes_Bills_BillId",
                table: "CreditNotes");

            migrationBuilder.DropForeignKey(
                name: "FK_CreditNotes_Suppliers_SupplierId",
                table: "CreditNotes");

            migrationBuilder.DropIndex(
                name: "IX_CreditNotes_BillId",
                table: "CreditNotes");

            migrationBuilder.DropColumn(
                name: "BillId",
                table: "CreditNotes");

            migrationBuilder.AlterColumn<int>(
                name: "SupplierId",
                table: "CreditNotes",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_CreditNotes_Suppliers_SupplierId",
                table: "CreditNotes",
                column: "SupplierId",
                principalTable: "Suppliers",
                principalColumn: "Id");
        }
    }
}
