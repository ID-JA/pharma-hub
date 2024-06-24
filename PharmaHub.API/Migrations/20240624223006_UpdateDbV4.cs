using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PharmaHub.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDbV4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Discount",
                table: "Sales");

            migrationBuilder.DropColumn(
                name: "TotalPrice",
                table: "Sales");

            migrationBuilder.DropColumn(
                name: "BoxQuantity",
                table: "SaleMedications");

            migrationBuilder.DropColumn(
                name: "Discount",
                table: "SaleMedications");

            migrationBuilder.DropColumn(
                name: "Ppv",
                table: "SaleMedications");

            migrationBuilder.DropColumn(
                name: "Tva",
                table: "SaleMedications");

            migrationBuilder.DropColumn(
                name: "UnitQuantity",
                table: "SaleMedications");

            migrationBuilder.RenameColumn(
                name: "TotalQuantity",
                table: "Sales",
                newName: "TotalQuantities");

            migrationBuilder.RenameColumn(
                name: "TotalPrice",
                table: "SaleMedications",
                newName: "DiscountRate");

            migrationBuilder.RenameColumn(
                name: "QuantityChanged",
                table: "InventoryHistories",
                newName: "PreviousUnitQuantity");

            migrationBuilder.AddColumn<decimal>(
                name: "DiscountedAmount",
                table: "Sales",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "TotalBrutPrices",
                table: "Sales",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "TotalNetPrices",
                table: "Sales",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "BrutPrice",
                table: "SaleMedications",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "NetPrice",
                table: "SaleMedications",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "SaleType",
                table: "SaleMedications",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "SaleMedications",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ChangeDate",
                table: "InventoryHistories",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "ChangeType",
                table: "InventoryHistories",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "NewBoxQuantity",
                table: "InventoryHistories",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "NewUnitQuantity",
                table: "InventoryHistories",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PreviousBoxQuantity",
                table: "InventoryHistories",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DiscountedAmount",
                table: "Sales");

            migrationBuilder.DropColumn(
                name: "TotalBrutPrices",
                table: "Sales");

            migrationBuilder.DropColumn(
                name: "TotalNetPrices",
                table: "Sales");

            migrationBuilder.DropColumn(
                name: "BrutPrice",
                table: "SaleMedications");

            migrationBuilder.DropColumn(
                name: "NetPrice",
                table: "SaleMedications");

            migrationBuilder.DropColumn(
                name: "SaleType",
                table: "SaleMedications");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "SaleMedications");

            migrationBuilder.DropColumn(
                name: "ChangeDate",
                table: "InventoryHistories");

            migrationBuilder.DropColumn(
                name: "ChangeType",
                table: "InventoryHistories");

            migrationBuilder.DropColumn(
                name: "NewBoxQuantity",
                table: "InventoryHistories");

            migrationBuilder.DropColumn(
                name: "NewUnitQuantity",
                table: "InventoryHistories");

            migrationBuilder.DropColumn(
                name: "PreviousBoxQuantity",
                table: "InventoryHistories");

            migrationBuilder.RenameColumn(
                name: "TotalQuantities",
                table: "Sales",
                newName: "TotalQuantity");

            migrationBuilder.RenameColumn(
                name: "DiscountRate",
                table: "SaleMedications",
                newName: "TotalPrice");

            migrationBuilder.RenameColumn(
                name: "PreviousUnitQuantity",
                table: "InventoryHistories",
                newName: "QuantityChanged");

            migrationBuilder.AddColumn<float>(
                name: "Discount",
                table: "Sales",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<double>(
                name: "TotalPrice",
                table: "Sales",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<int>(
                name: "BoxQuantity",
                table: "SaleMedications",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<float>(
                name: "Discount",
                table: "SaleMedications",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<double>(
                name: "Ppv",
                table: "SaleMedications",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<float>(
                name: "Tva",
                table: "SaleMedications",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<int>(
                name: "UnitQuantity",
                table: "SaleMedications",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
