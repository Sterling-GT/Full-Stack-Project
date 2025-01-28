package com.info5059.casestudy.purchaseorder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import com.info5059.casestudy.product.ProductRepository;
import com.info5059.casestudy.util.QRCodeGenerator;
import com.info5059.casestudy.vendor.VendorRepository;
import com.itextpdf.io.exceptions.IOException;

import jakarta.servlet.http.HttpServletRequest;

import java.io.ByteArrayInputStream;
@CrossOrigin
@RestController
public class PurchaseOrderController {
    @Autowired
    private PurchaseOrderDAO purchaseOrderDAO;

    @Autowired
    private PurchaseOrderRepository poRepository;

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private QRCodeGenerator qrGenerator;
    @PostMapping("/api/purchaseorders")
    public ResponseEntity<PurchaseOrder> addOne(@RequestBody PurchaseOrder purchaseOrder){
        return new ResponseEntity<>(purchaseOrderDAO.create(purchaseOrder),HttpStatus.OK);
    }

    @GetMapping("/api/purchaseorders")
    public ResponseEntity<Iterable<PurchaseOrder>> findAll() {
    Iterable<PurchaseOrder> pos = poRepository.findAll();
    return new ResponseEntity<Iterable<PurchaseOrder>>(pos, HttpStatus.OK);
}

   @RequestMapping(value = "/PurchaseOrderPDF", method=RequestMethod.GET, produces = MediaType.APPLICATION_PDF_VALUE)
   public ResponseEntity<InputStreamResource> getPdf(HttpServletRequest request) throws IOException{

    String poid = request.getParameter("poid");
    ByteArrayInputStream bis = PDFGenerator.generatePDF(
    poid, 
    vendorRepository, 
    productRepository, 
    poRepository,
    qrGenerator);
    HttpHeaders headers = new HttpHeaders();
    headers.add("Content-Disposition", "inline; filename=purchaseorder"+poid+".pdf");
    return ResponseEntity.ok().headers(headers)
    .contentType(MediaType.APPLICATION_PDF)
    .body(new InputStreamResource(bis));
   }
    
@GetMapping("/api/purchaseorders/{id}")
public ResponseEntity<Iterable<PurchaseOrder>> findByVendor(@PathVariable Long id) {
return new ResponseEntity<Iterable<PurchaseOrder>>(poRepository.findByVendorid(id), HttpStatus.OK);
}
    
}
