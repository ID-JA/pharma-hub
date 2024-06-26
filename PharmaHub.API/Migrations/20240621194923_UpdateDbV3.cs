using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PharmaHub.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDbV3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BoxQuantity",
                table: "SaleMedications",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UnitQuantity",
                table: "SaleMedications",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsPartialSaleAllowed",
                table: "Medications",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "SaleUnits",
                table: "Medications",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "UnitPrice",
                table: "Medications",
                type: "decimal(10,2)",
                precision: 10,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "BoxQuantity",
                table: "Inventories",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UnitQuantity",
                table: "Inventories",
                type: "int",
                nullable: false,
                defaultValue: 0);

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BoxQuantity",
                table: "SaleMedications");

            migrationBuilder.DropColumn(
                name: "UnitQuantity",
                table: "SaleMedications");

            migrationBuilder.DropColumn(
                name: "IsPartialSaleAllowed",
                table: "Medications");

            migrationBuilder.DropColumn(
                name: "SaleUnits",
                table: "Medications");

            migrationBuilder.DropColumn(
                name: "UnitPrice",
                table: "Medications");

            migrationBuilder.DropColumn(
                name: "BoxQuantity",
                table: "Inventories");

            migrationBuilder.DropColumn(
                name: "UnitQuantity",
                table: "Inventories");
        }
    }
}
