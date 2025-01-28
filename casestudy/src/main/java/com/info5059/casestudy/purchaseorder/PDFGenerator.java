package com.info5059.casestudy.purchaseorder;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.util.Locale;
import java.util.Optional;
import java.net.URL;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

import com.info5059.casestudy.vendor.*;
import com.info5059.casestudy.product.*;
import com.info5059.casestudy.purchaseorder.*;
import com.info5059.casestudy.util.QRCodeGenerator;
// import com.info5059.serverexercises.employee.Employee;
// import com.info5059.serverexercises.employee.EmployeeRepository;
// import com.info5059.serverexercises.expense.Expense;
// import com.info5059.serverexercises.expense.ExpsenseRepository;
// import com.info5059.serverexercises.report.Report;
// import com.info5059.serverexercises.report.ReportItem;
// import com.info5059.serverexercises.report.ReportRepository;
import com.itextpdf.io.exceptions.IOException;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.layout.properties.HorizontalAlignment;

import org.springframework.web.servlet.view.document.AbstractPdfView;

public abstract class PDFGenerator extends AbstractPdfView {

    public static ByteArrayInputStream generatePDF(
        String poid,
        VendorRepository vendorRepository,
        ProductRepository productRepository,
        PurchaseOrderRepository purchaseOrderRepository,
        QRCodeGenerator qrCodeGenerator
    ) throws IOException {

        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {

            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);
            DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
            String purchaseOrderDateCreatedFormatted = "";
            PdfFont font = PdfFontFactory.createFont(StandardFonts.HELVETICA);
            Locale locale = Locale.of("en", "US");
            String poSummary = "";
            NumberFormat numberFormatter = NumberFormat.getCurrencyInstance(locale);
            URL imageUrl = PDFGenerator.class.getResource("/static/images/logo.png");
            Image img = new Image(ImageDataFactory.create(imageUrl)).setHorizontalAlignment(HorizontalAlignment.LEFT).setHeight(100).setWidth(100);
            document.add(img);
            document.add(new Paragraph(String.format("Purchase Order  \n#" + poid))
                    .setFont(font).setFontSize(24)
                    .setTextAlignment(TextAlignment.RIGHT).setBold());

            // Table created, but not added yet
            Table table = new Table(5);
            table.setWidth(new UnitValue(UnitValue.PERCENT, 100));

            // Headers
            Cell cell = new Cell().add(new Paragraph("Product Code")
                    .setFont(font).setFontSize(12).setBold()).setTextAlignment(TextAlignment.CENTER);
            table.addCell(cell);
            cell = new Cell().add(new Paragraph("Description")
                    .setFont(font).setFontSize(12).setBold()).setTextAlignment(TextAlignment.CENTER);
            table.addCell(cell);
            cell = new Cell().add(new Paragraph("Qty Sold")
                    .setFont(font).setFontSize(12).setBold()).setTextAlignment(TextAlignment.CENTER);
            table.addCell(cell);
            cell = new Cell().add(new Paragraph("Price")
                    .setFont(font).setFontSize(12).setBold()).setTextAlignment(TextAlignment.CENTER);
            table.addCell(cell);
            cell = new Cell().add(new Paragraph("Ext. Price")
                    .setFont(font).setFontSize(12).setBold()).setTextAlignment(TextAlignment.CENTER);
            table.addCell(cell);
            // Table Data
            Optional<PurchaseOrder> nullablePurchaseOrder = purchaseOrderRepository.findById(Long.parseLong(poid));
            if (nullablePurchaseOrder.isPresent()) {

                PurchaseOrder purchaseOrder = nullablePurchaseOrder.get();
                purchaseOrder.getVendorid();
                purchaseOrderDateCreatedFormatted = dateTimeFormatter.format(purchaseOrder.getPodate());
                Optional<Vendor> nullableVendor = vendorRepository.findById(purchaseOrder.getVendorid());
                if (nullableVendor.isPresent()) {

                    // Employee data
                    Vendor vendor = nullableVendor.get();
                    String vendorInfo = "Vendor: "
                        + vendor.getName()
                        + "\n"
                        + vendor.getAddress1()
                        + "\n"
                        + vendor.getCity()
                        + "\n"
                        + vendor.getProvince()
                        +"\n"
                        +vendor.getEmail()
                        ;

                    document.add(new Paragraph(vendorInfo)
                        .setFont(font).setFontSize(12).setTextAlignment(TextAlignment.LEFT).setBold());

                        //Po Summary
                        poSummary = "Summary for Purchase Order:" + purchaseOrder.getId() 
                        + "\nDate:" + dateTimeFormatter.format(purchaseOrder.getPodate())
                        + "\nVendor:" + vendor.getName()
                        + "\nTotal:" + numberFormatter.format(purchaseOrder.getAmount());

                }

                BigDecimal totalPurchase = new BigDecimal(0);
                for (PurchaseOrderLineItem item : purchaseOrder.getItems()) {
                    Optional<Product> nullableProduct = productRepository.findById(item.getProductid());
                    if (!nullableVendor.isPresent()) {
                        continue;
                    }
                    Product product = nullableProduct.get();
                    // Expense expense = nullableExpense.get();
                    // totalPurchase = totalPurchase.add(expense.getAmount(), new MathContext(8, RoundingMode.UP));

                    String productId = "" + item.getProductid();
                    String qtySold = "" + item.getQty();
                  
                    String productAmount = numberFormatter.format(product.getCostprice());
                    String extPrice = numberFormatter.format
                    (item.getPrice().multiply(new BigDecimal(item.getQty())));
                    totalPurchase = totalPurchase.add(item.getPrice().multiply(new BigDecimal(item.getQty())));
                    // totalCost = totalCost.add(item.getPrice().multiply(new BigDecimal(item.getQty())));
                    //use msrp to get real price
                    //use costPrice to have the values match up for now
                    // Rows
                    cell = new Cell().add(new Paragraph(productId)
                        .setFont(font).setFontSize(12).setTextAlignment(TextAlignment.CENTER));
                    table.addCell(cell);
                    cell = new Cell().add(new Paragraph(product.getName())
                        .setFont(font).setFontSize(12).setTextAlignment(TextAlignment.CENTER));
                    table.addCell(cell);
                    cell = new Cell().add(new Paragraph(qtySold)
                        .setFont(font).setFontSize(12).setTextAlignment(TextAlignment.CENTER));
                    table.addCell(cell);
                    cell = new Cell().add(new Paragraph(productAmount)
                        .setFont(font).setFontSize(12).setTextAlignment(TextAlignment.RIGHT));
                    table.addCell(cell);
                    cell = new Cell().add(new Paragraph(extPrice)
                    .setFont(font).setFontSize(12).setTextAlignment(TextAlignment.RIGHT));
                table.addCell(cell);
                }
                cell = new Cell(1, 4).add(new Paragraph("Sub Total:")
                    .setFont(font).setFontSize(12).setBold().setTextAlignment(TextAlignment.RIGHT).setBorder(Border.NO_BORDER));
                table.addCell(cell);
                cell = new Cell().add(new Paragraph(numberFormatter.format(totalPurchase))
                    .setFont(font).setFontSize(12)
                    .setBold().setTextAlignment(TextAlignment.RIGHT));
                table.addCell(cell);

                cell = new Cell(1, 4).add(new Paragraph("Tax:")
                .setFont(font).setFontSize(12).setBold().setTextAlignment(TextAlignment.RIGHT).setBorder(Border.NO_BORDER));
            table.addCell(cell);
            cell = new Cell().add(new Paragraph(numberFormatter.format
            (totalPurchase.multiply(new BigDecimal(0.13))))
                .setFont(font).setFontSize(12)
                .setBold().setTextAlignment(TextAlignment.RIGHT).setBorder(Border.NO_BORDER));
            table.addCell(cell);

            cell = new Cell(1, 4).add(new Paragraph("PO Total:")
            .setFont(font).setFontSize(12).setBold().setTextAlignment(TextAlignment.RIGHT));
            table.addCell(cell);
            cell = new Cell().add(new Paragraph(numberFormatter.format
            (totalPurchase.multiply(new BigDecimal(1.13))))
            .setFont(font).setFontSize(12)
            .setBold().setTextAlignment(TextAlignment.RIGHT)
            .setBackgroundColor(ColorConstants.YELLOW));
            table.addCell(cell);
            }

            document.add(new Paragraph("\n"));
            document.add(table);
            document.add(new Paragraph("\n"));

            
            document.add(new Paragraph(purchaseOrderDateCreatedFormatted)
                .setTextAlignment(TextAlignment.CENTER));
            // QR Code Summary
            Image poQRCode = new Image(ImageDataFactory.create(qrCodeGenerator.generateQRCode(poSummary)))
                .scaleAbsolute(100, 100)
                .setFixedPosition(460,60);
                    document.add(poQRCode);    
            document.close();

            
     

        }
        catch (Exception ex) {
            Logger.getLogger(PDFGenerator.class.getName()).log(Level.SEVERE, null, ex);
        }

        return new ByteArrayInputStream(baos.toByteArray());
    }
}
