package com.info5059.casestudy.product;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
@Entity
@Data
@RequiredArgsConstructor
public class Product {
@Id
private String id;
private int vendorid;
private String name;
private BigDecimal costprice;
private BigDecimal msrp;
private int rop;
private int eoq;
private int qoh;
private int qoo;
@Column(columnDefinition="varbinary(1000)")
private byte[] qrcode;
private String qrcodetxt;
}
