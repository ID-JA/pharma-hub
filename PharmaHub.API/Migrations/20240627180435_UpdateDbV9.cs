using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PharmaHub.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDbV9 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "DiscountedAmount",
                table: "Deliveries",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "TotalBrutPph",
                table: "Deliveries",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "TotalFreePpv",
                table: "Deliveries",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "TotalNetPph",
                table: "Deliveries",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "TotalPpv",
                table: "Deliveries",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DiscountedAmount",
                table: "Deliveries");

            migrationBuilder.DropColumn(
                name: "TotalBrutPph",
                table: "Deliveries");

            migrationBuilder.DropColumn(
                name: "TotalFreePpv",
                table: "Deliveries");

            migrationBuilder.DropColumn(
                name: "TotalNetPph",
                table: "Deliveries");

            migrationBuilder.DropColumn(
                name: "TotalPpv",
                table: "Deliveries");
        }
    }
}
