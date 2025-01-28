package com.info5059.casestudy.purchaseorder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.info5059.casestudy.product.Product;
import com.info5059.casestudy.product.ProductRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
public class PurchaseOrderDAO {
@PersistenceContext
private EntityManager entityManager;
@Autowired
ProductRepository prodRepo;
@Transactional
public PurchaseOrder create(PurchaseOrder purchaseFromClient){
    PurchaseOrder realPurchase = new PurchaseOrder();
    BigDecimal totalCost = new BigDecimal(0);
    realPurchase.setPodate(LocalDateTime.now());
    realPurchase.setVendorid(purchaseFromClient.getVendorid());
    realPurchase.setAmount(purchaseFromClient.getAmount());
    entityManager.persist(realPurchase);

    for(PurchaseOrderLineItem item : purchaseFromClient.getItems()){
        PurchaseOrderLineItem realItem = new PurchaseOrderLineItem();
        Product prod = prodRepo.getReferenceById(item.getProductid());
        realItem.setProductid(item.getProductid());
        realItem.setPoid(realPurchase.getId());
        realItem.setPrice(prod.getCostprice());//changed this from item.getPrice() 
        realItem.setQty(item.getQty());
        //NEED TO ADD COST
        totalCost = totalCost.add(realItem.getPrice().multiply(new BigDecimal(item.getQty())));
        
        prod.setQoo(prod.getQoo() + item.getQty());
        prodRepo.saveAndFlush(prod);
        entityManager.persist(realItem);

    }
    totalCost = totalCost.multiply(new BigDecimal(1.13));
    realPurchase.setAmount(totalCost);
    entityManager.flush();
    entityManager.refresh(realPurchase);
    return realPurchase;

}
    
}
