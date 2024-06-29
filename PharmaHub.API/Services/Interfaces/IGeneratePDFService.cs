using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;



public class SaleTicketDocument(Sale sale) : IDocument
{
    public DocumentMetadata GetMetadata() => DocumentMetadata.Default;
    public DocumentSettings GetSettings() => DocumentSettings.Default;

    public void Compose(IDocumentContainer container)
    {
        container
            .Page(page =>
            {
                page.Margin(20);
                page.Size(PageSizes.A6);
                page.Header().Element(ComposeHeader);
                page.Content().Element(ComposeContent);
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
                column.Spacing(2);
                column.Item().Height(30).Width(80).Image(imageData);
                column.Item().Text("Pharmacy Dr.Nazha").FontSize(10).Bold();
            });
            row.RelativeItem().Column(column =>
            {
                column.Spacing(2);
                column.Item().Text($"Vente Ticket N°: {sale.SaleNumber}").FontSize(10).Bold();
                var today = DateOnly.FromDateTime(DateTime.Now);
                var time = TimeOnly.FromDateTime(DateTime.Now).ToString("HH:mm");
                column.Item().Text(text =>
                {
                    text.Span($"Du: {today} à {time} ").FontSize(10).Bold();
                });
            });
        });
    }

    void ComposeContent(IContainer container)
    {
        container.PaddingVertical(10).Column(column =>
        {
            column.Spacing(2);
            column.Item().Element(ComposeTable);
            var totalPrice = sale.SaleMedications.Sum(x => x.Quantity * x.Inventory.Ppv);
            column.Item().AlignRight().Text($"Total Vente: {totalPrice}").FontSize(12).Bold();
        });
    }

    void ComposeTable(IContainer container)
    {
        container.Table(table =>
        {
            // step 1
            table.ColumnsDefinition(columns =>
            {
                columns.ConstantColumn(15); // Further reduced column size
                columns.RelativeColumn(2);
                columns.RelativeColumn();
                columns.RelativeColumn();
                columns.RelativeColumn();
            });

            // step 2
            table.Header(header =>
            {
                header.Cell().Element(CellStyle).Text("#");
                header.Cell().Element(CellStyle).Text("Nom Produit").Bold().FontSize(10);
                header.Cell().Element(CellStyle).AlignRight().Text("P.P.V").Bold().FontSize(10);
                header.Cell().Element(CellStyle).AlignRight().Text("Quantité").Bold().FontSize(10);
                header.Cell().Element(CellStyle).AlignRight().Text("Total").Bold().FontSize(10);

                static IContainer CellStyle(IContainer container)
                {
                    return container.DefaultTextStyle(x => x.SemiBold()).PaddingVertical(2).BorderBottom(1).BorderColor(Colors.Black); // Further reduced padding
                }
            });

            foreach (var item in sale.SaleMedications)
            {
                table.Cell().Element(CellStyle).Text($"{sale.SaleMedications.IndexOf(item) + 1}").FontSize(10);
                table.Cell().Element(CellStyle).Text(item.Inventory.Medication.Name).FontSize(10);
                table.Cell().Element(CellStyle).AlignRight().Text($"{item.Inventory.Ppv}").FontSize(10);
                table.Cell().Element(CellStyle).AlignRight().Text($"{item.Quantity}").FontSize(10);
                table.Cell().Element(CellStyle).AlignRight().Text($"{item.Inventory.Ppv * item.Quantity}").FontSize(10);

                static IContainer CellStyle(IContainer container)
                {
                    return container.BorderBottom(1).BorderColor(Colors.Grey.Lighten2).PaddingVertical(2); // Further reduced padding
                }
            }
        });
    }
}

