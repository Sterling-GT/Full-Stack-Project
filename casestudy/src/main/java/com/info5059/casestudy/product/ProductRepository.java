package com.info5059.casestudy.product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import jakarta.transaction.Transactional;
import java.util.List;

@CrossOrigin
@RepositoryRestResource(collectionResourceRel = "products", path = "products")
// public interface ProductRepository extends CrudRepository<Product,String> {
public interface ProductRepository extends JpaRepository<Product,String> {

  @Modifying
    @Transactional
    @Query("delete from Product where id = ?1")
    int deleteOne(String productId);

    List<Product> findByVendorid(Long vendorid);
    
    
} 
