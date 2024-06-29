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
            table.ColumnsDefinition(columns =>
            {
                columns.ConstantColumn(15);
                columns.RelativeColumn(2);
                columns.RelativeColumn();
                columns.RelativeColumn();
                columns.RelativeColumn();
            });


            table.Header(header =>
            {
                header.Cell().Element(CellStyle).Text("#");
                header.Cell().Element(CellStyle).Text("Nom Produit").Bold().FontSize(10);
                header.Cell().Element(CellStyle).AlignRight().Text("P.P.V").Bold().FontSize(10);
                header.Cell().Element(CellStyle).AlignRight().Text("Quantité").Bold().FontSize(10);
                header.Cell().Element(CellStyle).AlignRight().Text("Total").Bold().FontSize(10);

                static IContainer CellStyle(IContainer container)
                {
                    return container.DefaultTextStyle(x => x.SemiBold()).PaddingVertical(2).BorderBottom(1).BorderColor(Colors.Black);
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
                    return container.BorderBottom(1).BorderColor(Colors.Grey.Lighten2).PaddingVertical(2);
                }
            }
        });
    }
}

public class DeliveryDocument(Delivery delivery) : IDocument
{
    public DocumentMetadata GetMetadata() => DocumentMetadata.Default;
    public DocumentSettings GetSettings() => DocumentSettings.Default;

    public void Compose(IDocumentContainer container)
    {
        container
            .Page(page =>
            {
                page.Margin(20);
                page.Size(PageSizes.A4);
                page.Header().Element(ComposeHeader);
                page.Content().Element(ComposeContent);
            });
    }

    void ComposeHeader(IContainer container)
    {
        container.Row(row =>
        {
            row.RelativeItem().Column(column =>
            {
                column.Item().Text($"Fournisseur: {delivery.Supplier.Name}").FontSize(12).Bold();
                column.Item().Text($"Téléphone: {delivery.Supplier.Phone}").FontSize(12).Bold();
                column.Item().Text($"Faxe: {delivery.Supplier.Fax}").FontSize(12).Bold();
            });
            row.RelativeItem().Column(column =>
            {
                column.Spacing(2);
                column.Item().Text($"N° de BL: {delivery.DeliveryNumber}").AlignRight().FontSize(12).Bold();
                var today = DateOnly.FromDateTime(delivery.CreatedAt);
                var time = TimeOnly.FromDateTime(delivery.CreatedAt).ToString("HH:mm");
                column.Item().AlignRight().Text(text =>
                {
                    text.Span($"Date: {today} à {time} ").FontSize(12).Bold();
                });
            });
        });
    }

    void ComposeContent(IContainer container)
    {
        container.PaddingVertical(10).Column(column =>
        {
            column.Item().Element(ComposeTable);
        });
    }

    void ComposeTable(IContainer container)
    {
        container.Table(table =>
        {
            table.ColumnsDefinition(columns =>
            {
                columns.RelativeColumn(4);
                columns.RelativeColumn(2);
                columns.RelativeColumn();
                columns.RelativeColumn();
                columns.RelativeColumn();
                columns.RelativeColumn();
                columns.RelativeColumn();
            });

            table.Header(header =>
            {
                header.Cell().Element(CellStyle).Text("Nom Produit").Bold().FontSize(10);
                header.Cell().Element(CellStyle).AlignRight().Text("Quantité Livrée").Bold().FontSize(10);
                header.Cell().Element(CellStyle).AlignRight().Text("PPV Unit").Bold().FontSize(10);
                header.Cell().Element(CellStyle).AlignRight().Text("PPH Unit").Bold().FontSize(10);
                header.Cell().Element(CellStyle).AlignRight().Text("Remise").Bold().FontSize(10);
                header.Cell().Element(CellStyle).AlignRight().Text("Total PPH").Bold().FontSize(10);
                header.Cell().Element(CellStyle).AlignRight().Text("U.G").Bold().FontSize(10);

                static IContainer CellStyle(IContainer container)
                {
                    return container.DefaultTextStyle(x => x.SemiBold()).PaddingVertical(2).BorderBottom(1).BorderColor(Colors.Black);
                }
            });

            decimal totalQuantity = 0;
            decimal totalPpv = 0;
            decimal totalPph = 0;
            double totalDiscount = 0;
            decimal totalPphSum = 0;
            decimal totalFreeUnits = 0;

            foreach (var item in delivery.OrderDeliveryInventories)
            {
                table.Cell().Element(CellStyle).Text(item.Inventory.Medication.Name).FontSize(10);
                table.Cell().Element(CellStyle).AlignRight().Text($"{item.DeliveredQuantity}").FontSize(10);
                table.Cell().Element(CellStyle).AlignRight().Text($"{item.Inventory.Ppv}").FontSize(10);
                table.Cell().Element(CellStyle).AlignRight().Text($"{item.Inventory.Pph}").FontSize(10);
                table.Cell().Element(CellStyle).AlignRight().Text($"{item.DiscountRate}").FontSize(10);
                table.Cell().Element(CellStyle).AlignRight().Text($"{item.TotalPurchasePrice}").FontSize(10);
                table.Cell().Element(CellStyle).AlignRight().Text($"{item.TotalFreeUnits}").FontSize(10);

                totalQuantity += item.DeliveredQuantity;
                totalPpv += item.Inventory.Ppv;
                totalPph += item.Inventory.Pph;
                totalDiscount += item.DiscountRate;
                totalPphSum += item.TotalPurchasePrice;
                totalFreeUnits += item.TotalFreeUnits;

                static IContainer CellStyle(IContainer container)
                {
                    return container.BorderBottom(1).BorderColor(Colors.Grey.Lighten2).PaddingVertical(8);
                }
            }

            table.Footer(footer =>
            {
                footer.Cell().Element(CellStyle).Text("Totaux").Bold().FontSize(10);
                footer.Cell().Element(CellStyle).AlignRight().Text($"{totalQuantity}").Bold().FontSize(10);
                footer.Cell().Element(CellStyle).AlignRight().Text($"{totalPpv}").Bold().FontSize(10);
                footer.Cell().Element(CellStyle).AlignRight().Text($"{totalPph}").Bold().FontSize(10);
                footer.Cell().Element(CellStyle).AlignRight().Text($"{totalDiscount}").Bold().FontSize(10);
                footer.Cell().Element(CellStyle).AlignRight().Text($"{totalPphSum}").Bold().FontSize(10);
                footer.Cell().Element(CellStyle).AlignRight().Text($"{totalFreeUnits}").Bold().FontSize(10);

                static IContainer CellStyle(IContainer container)
                {
                    return container.DefaultTextStyle(x => x.SemiBold()).PaddingVertical(2).BorderTop(1).BorderColor(Colors.Black);
                }
            });
        });
    }


}
