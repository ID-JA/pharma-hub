using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PharmaHub.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateMedicamentEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StockHistories_Drugs_DrugId",
                table: "StockHistories");

            migrationBuilder.DropTable(
                name: "SaleDrugs");

            migrationBuilder.DropTable(
                name: "Drugs");

            migrationBuilder.RenameColumn(
                name: "DrugId",
                table: "StockHistories",
                newName: "MedicamentId");

            migrationBuilder.RenameIndex(
                name: "IX_StockHistories_DrugId",
                table: "StockHistories",
                newName: "IX_StockHistories_MedicamentId");

            migrationBuilder.CreateTable(
                name: "Medicaments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DCI = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Form = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PPV = table.Column<double>(type: "float", nullable: false),
                    PPH = table.Column<double>(type: "float", nullable: false),
                    TVA = table.Column<double>(type: "float", nullable: false),
                    Discount = table.Column<float>(type: "real", nullable: false),
                    PBR = table.Column<double>(type: "float", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Marge = table.Column<int>(type: "int", nullable: false),
                    Codebar = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Family = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UsedBy = table.Column<int>(type: "int", nullable: false),
                    WithPrescription = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Medicaments", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SaleMedicaments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    PPV = table.Column<double>(type: "float", nullable: false),
                    Discount = table.Column<float>(type: "real", nullable: false),
                    SaleId = table.Column<int>(type: "int", nullable: false),
                    MedicamentId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SaleMedicaments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SaleMedicaments_Medicaments_MedicamentId",
                        column: x => x.MedicamentId,
                        principalTable: "Medicaments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SaleMedicaments_Sales_SaleId",
                        column: x => x.SaleId,
                        principalTable: "Sales",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SaleMedicaments_MedicamentId",
                table: "SaleMedicaments",
                column: "MedicamentId");

            migrationBuilder.CreateIndex(
                name: "IX_SaleMedicaments_SaleId",
                table: "SaleMedicaments",
                column: "SaleId");

            migrationBuilder.AddForeignKey(
                name: "FK_StockHistories_Medicaments_MedicamentId",
                table: "StockHistories",
                column: "MedicamentId",
                principalTable: "Medicaments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StockHistories_Medicaments_MedicamentId",
                table: "StockHistories");

            migrationBuilder.DropTable(
                name: "SaleMedicaments");

            migrationBuilder.DropTable(
                name: "Medicaments");

            migrationBuilder.RenameColumn(
                name: "MedicamentId",
                table: "StockHistories",
                newName: "DrugId");

            migrationBuilder.RenameIndex(
                name: "IX_StockHistories_MedicamentId",
                table: "StockHistories",
                newName: "IX_StockHistories_DrugId");

            migrationBuilder.CreateTable(
                name: "Drugs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Codebar = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DCI = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Discount = table.Column<float>(type: "real", nullable: false),
                    Familly = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Form = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Marge = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PBR = table.Column<double>(type: "float", nullable: false),
                    PPH = table.Column<double>(type: "float", nullable: false),
                    PPV = table.Column<double>(type: "float", nullable: false),
                    TVA = table.Column<double>(type: "float", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UsedBy = table.Column<int>(type: "int", nullable: false),
                    WithPrescription = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Drugs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SaleDrugs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DrugId = table.Column<int>(type: "int", nullable: false),
                    SaleId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Discount = table.Column<float>(type: "real", nullable: false),
                    PPV = table.Column<double>(type: "float", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SaleDrugs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SaleDrugs_Drugs_DrugId",
                        column: x => x.DrugId,
                        principalTable: "Drugs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SaleDrugs_Sales_SaleId",
                        column: x => x.SaleId,
                        principalTable: "Sales",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SaleDrugs_DrugId",
                table: "SaleDrugs",
                column: "DrugId");

            migrationBuilder.CreateIndex(
                name: "IX_SaleDrugs_SaleId",
                table: "SaleDrugs",
                column: "SaleId");

            migrationBuilder.AddForeignKey(
                name: "FK_StockHistories_Drugs_DrugId",
                table: "StockHistories",
                column: "DrugId",
                principalTable: "Drugs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
