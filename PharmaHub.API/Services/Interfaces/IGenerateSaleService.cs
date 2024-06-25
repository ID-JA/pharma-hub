using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace PharmaHub.API.Services;

public interface IGenerateSaleService
{
  public byte[] GenerateSalesReport(Sale sale);

}

public class GenerateSaleService(ApplicationDbContext dbContext, ICurrentUser currentUser) : IGenerateSaleService
{
  public byte[] GenerateSalesReport(Sale sale)
  {
    var document = Document.Create(container =>
    {
      container.Page(page =>
            {
              page.Margin(2, Unit.Centimetre);
              page.Size(PageSizes.A4);

              page.Header()
                          .Text($"Sales Report for Sale Number: {sale.SaleNumber}")
                          .FontSize(20)
                          .Bold()
                          .AlignCenter();

              page.Content()
                          .Column(column =>
                          {
                            column.Spacing(10);

                            column.Item().Text($"Total Quantity: {sale.TotalQuantity}");
                            column.Item().Text($"Total Price: {sale.TotalPrice:C}");
                            column.Item().Text($"Status: {sale.Status}");
                            column.Item().Text($"Discount: {sale.Discount:P}");
                            column.Item().Text($"User: {sale.User.FirstName} {sale.User.LastName}");

                            column.Item().Table(table =>
                                    {
                                      table.ColumnsDefinition(columns =>
                                        {
                                          columns.RelativeColumn();
                                          columns.RelativeColumn();
                                          columns.RelativeColumn();
                                        });

                                      table.Header(header =>
                                        {
                                          header.Cell().Element(CellStyle).Text("Medication");
                                          header.Cell().Element(CellStyle).Text("Quantity");
                                          header.Cell().Element(CellStyle).Text("Total Price");
                                        });

                                      foreach (var saleMedication in sale.SaleMedications)
                                      {
                                        table.Cell().Element(CellStyle).Text(saleMedication.Inventory.Medication.Name); // Assuming Inventory has a Medication with a Name property
                                        table.Cell().Element(CellStyle).Text(saleMedication.Quantity.ToString());
                                        table.Cell().Element(CellStyle).Text(saleMedication.TotalPrice.ToString("C"));
                                      }

                                      static IContainer CellStyle(IContainer container)
                                      {
                                        return container.Border(1).Padding(5);
                                      }
                                    });
                          });

              page.Footer()
                          .AlignCenter()
                          .Text(x =>
                          {
                            x.Span("Page ");
                            x.CurrentPageNumber();
                            x.Span(" of ");
                            x.TotalPages();
                          });
            });
    });

    return document.GeneratePdf();
  }
}
