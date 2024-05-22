using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PharmaHub.API.Migrations
{
    /// <inheritdoc />
    public partial class NewColumnsForMedicament : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Discount",
                table: "Medicaments",
                newName: "ReimbursementRate");

            migrationBuilder.AlterColumn<float>(
                name: "TVA",
                table: "Medicaments",
                type: "real",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "float");

            migrationBuilder.AlterColumn<double>(
                name: "Marge",
                table: "Medicaments",
                type: "float",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<float>(
                name: "DiscountRate",
                table: "Medicaments",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<string>(
                name: "Dosage",
                table: "Medicaments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "MaxQuantity",
                table: "Medicaments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "MinQuantity",
                table: "Medicaments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "OrderSystem",
                table: "Medicaments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<double>(
                name: "PAMP",
                table: "Medicaments",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "PFHTActive",
                table: "Medicaments",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "PFHTNotActive",
                table: "Medicaments",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "Section",
                table: "Medicaments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "laboratory",
                table: "Medicaments",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DiscountRate",
                table: "Medicaments");

            migrationBuilder.DropColumn(
                name: "Dosage",
                table: "Medicaments");

            migrationBuilder.DropColumn(
                name: "MaxQuantity",
                table: "Medicaments");

            migrationBuilder.DropColumn(
                name: "MinQuantity",
                table: "Medicaments");

            migrationBuilder.DropColumn(
                name: "OrderSystem",
                table: "Medicaments");

            migrationBuilder.DropColumn(
                name: "PAMP",
                table: "Medicaments");

            migrationBuilder.DropColumn(
                name: "PFHTActive",
                table: "Medicaments");

            migrationBuilder.DropColumn(
                name: "PFHTNotActive",
                table: "Medicaments");

            migrationBuilder.DropColumn(
                name: "Section",
                table: "Medicaments");

            migrationBuilder.DropColumn(
                name: "laboratory",
                table: "Medicaments");

            migrationBuilder.RenameColumn(
                name: "ReimbursementRate",
                table: "Medicaments",
                newName: "Discount");

            migrationBuilder.AlterColumn<double>(
                name: "TVA",
                table: "Medicaments",
                type: "float",
                nullable: false,
                oldClrType: typeof(float),
                oldType: "real");

            migrationBuilder.AlterColumn<int>(
                name: "Marge",
                table: "Medicaments",
                type: "int",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "float");
        }
    }
}
