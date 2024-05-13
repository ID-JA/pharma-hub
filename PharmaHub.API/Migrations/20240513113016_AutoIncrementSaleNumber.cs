using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PharmaHub.API.Migrations
{
    /// <inheritdoc />
    public partial class AutoIncrementSaleNumber : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateSequence<int>(
                name: "SaleNumbers",
                startValue: 100L);

            migrationBuilder.AlterColumn<int>(
                name: "SaleNumber",
                table: "Sales",
                type: "int",
                nullable: false,
                defaultValueSql: "NEXT VALUE FOR SaleNumbers",
                oldClrType: typeof(int),
                oldType: "int");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropSequence(
                name: "SaleNumbers");

            migrationBuilder.AlterColumn<int>(
                name: "SaleNumber",
                table: "Sales",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldDefaultValueSql: "NEXT VALUE FOR SaleNumbers");
        }
    }
}
