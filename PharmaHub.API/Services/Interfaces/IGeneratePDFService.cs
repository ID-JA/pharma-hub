using PharmaHub.API.Services;
using QuestPDF.Drawing;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;



public class SaleTicketDocment(Sale sale) : IDocument
{

  public DocumentMetadata GetMetadata() => DocumentMetadata.Default;
  public DocumentSettings GetSettings() => DocumentSettings.Default;

  public void Compose(IDocumentContainer container)
  {
    container
              .Page(page =>
              {
                page.Margin(50);

                page.Header().Element(ComposeHeader);
                page.Content().Element(ComposeContent);


                page.Footer().AlignCenter().Text(x =>
              {
                x.CurrentPageNumber();
                x.Span(" / ");
                x.TotalPages();
              });
              });
  }

  void ComposeHeader(IContainer container)
  {
    
    var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "images/logo.png");

    byte[] imageData = System.IO.File.ReadAllBytes(imagePath);
    container.Row(row =>
    {
        row.RelativeItem().Column(column =>
        {
          column.Item().Height(69).Width(200).Image(imageData);
        });
      row.RelativeItem().Column(column =>
          {
            column.Item().Text($"Pharmacy Dr.Nazha").FontSize(18).Bold();
            column.Item().Text($"Ticket N°: 1").FontSize(12).SemiBold();
            var today = DateOnly.FromDateTime(DateTime.Now);
            var time = TimeOnly.FromDateTime(DateTime.Now);
            column.Item().Text(text =>
                {
                  text.Span($"VENTE DU: {today} à {time} ").SemiBold();
                });
          });
    });
  }

   void ComposeContent(IContainer container)
    {
        container.PaddingVertical(40).Column(column =>
        {
            column.Spacing(5);

            column.Item().Element(ComposeTable);
        });
    }

     void ComposeTable(IContainer container)
    {
        container.Table(table =>
        {
            // step 1
            table.ColumnsDefinition(columns =>
            {
                columns.ConstantColumn(25);
                columns.RelativeColumn(3);
                columns.RelativeColumn();
                columns.RelativeColumn();
                columns.RelativeColumn();
            });
            
            // step 2
            table.Header(header =>
            {
                 header.Cell().Element(CellStyle).Text("#");
                header.Cell().Element(CellStyle).Text("Nom Prduit");
                header.Cell().Element(CellStyle).AlignRight().Text("P.P.V");
                header.Cell().Element(CellStyle).AlignRight().Text("Quantitié");
                header.Cell().Element(CellStyle).AlignRight().Text("Total");
                
                static IContainer CellStyle(IContainer container)
                {
                    return container.DefaultTextStyle(x => x.SemiBold()).PaddingVertical(5).BorderBottom(1).BorderColor(Colors.Black);
                }
            });
            
            // step 3
            foreach (var item in sale.SaleMedications)
            {
                table.Cell().Element(CellStyle).Text(sale.SaleMedications.IndexOf(item) + 1);
                table.Cell().Element(CellStyle).Text(item.Inventory.Medication.Name);
                table.Cell().Element(CellStyle).AlignRight().Text($"{item.Inventory.Ppv}$");
                table.Cell().Element(CellStyle).AlignRight().Text(item.Quantity);
                table.Cell().Element(CellStyle).AlignRight().Text($"{item.Inventory.Ppv * item.Quantity}$");
                
                static IContainer CellStyle(IContainer container)
                {
                    return container.BorderBottom(1).BorderColor(Colors.Grey.Lighten2).PaddingVertical(5);
                }
            }
        });
    }
}