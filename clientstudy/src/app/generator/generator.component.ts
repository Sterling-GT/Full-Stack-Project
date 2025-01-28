import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatComponentsModule } from '@app/mat-components/mat-components.module';

import { Vendor } from '@app/vendor/vendor';
import { VendorService } from '@app/vendor/vendor.service';
import { PDF_URL, PRODUCT_DEFAULT, VENDOR_DEFAUlT } from '@app/constants';
import { Product } from '@app/product/product';
import { ProductService } from '@app/product/product.service';
import { PurchaseOrderLineItem } from '@app/purchase-order/purchase-order-line-item';
import { PurchaseOrder } from '@app/purchase-order/purchase-order';
import { PurchaseOrderService } from '@app/purchase-order/purchase-order.service';

@Component({
  selector: 'app-generator',
  standalone: true,
  imports: [CommonModule, MatComponentsModule, ReactiveFormsModule],
  templateUrl: './generator.component.html',
})
export class GeneratorComponent implements OnInit, OnDestroy {

  // To prevent memory leaks
  formSubscription?: Subscription;

  msg: string = '';
  vendors:Vendor[] = [];
  selectedVendor: Vendor = VENDOR_DEFAUlT;
  vendorProducts: Product[] = [];
  selectedProduct: Product = PRODUCT_DEFAULT;
 poItems: PurchaseOrderLineItem[] = [];
 generatedPurchaseOrderId:number = 0;
  

  vendorForm: FormControl;
  productForm: FormControl;
  quantityForm:FormControl;
  generatorFormGroup: FormGroup;

  constructor(
    private builder: FormBuilder,
    private vendorService:VendorService,
    private productService:ProductService,
    private purchaseOrderService: PurchaseOrderService
  ) {

    this.vendorForm = new FormControl('');
    this.productForm = new FormControl('');
    this.quantityForm = new FormControl('');
    this.generatorFormGroup = this.builder.group({
      vendor: this.vendorForm,
      product: this.productForm,
      quantity:this.quantityForm,
    });
  }

  ngOnInit(): void {
    this.msg = 'Loading vendors from server...';
    this.setupOnVendorPickedEvent();
    this.setupOnProductPickedEvent();
    this.setupOnQuantityPickedEvent();
    this.getAllVendors();
  }

  ngOnDestroy(): void {
    if (this.formSubscription !== undefined) {
      this.formSubscription.unsubscribe();
    }
  }
  getAllVendors(verbose: boolean = true): void {
    this.vendorService.getAll().subscribe({
      next: (vendors: Vendor[]) => this.vendors = vendors,
      error: (e: Error) => this.msg = `Failed to load Vendors - ${e.message}`,
      complete: () => verbose ? this.msg = `Vendors loaded!` : null,
    });
    }

    setupOnVendorPickedEvent(): void {
      this.formSubscription = this.generatorFormGroup.get('vendor')?.valueChanges.subscribe((vendor) => {
        
        // if (vendor===null) return;
        if(!vendor)return; //old one
        this.selectedVendor = vendor;
        console.log("Vendor\n" +vendor)
        
        this.loadVendorProducts();
        this.selectedProduct = Object.assign({},PRODUCT_DEFAULT);
        this.productForm.reset();
        this.quantityForm.reset();
        this.poItems = [];
        this.generatedPurchaseOrderId =0;
        
        this.msg = 'Choose Products from Vendor';
      });
  }
  loadVendorProducts(): void {
    this.vendorProducts = [];
    console.log(this.selectedVendor.id)
    this.productService.getSome(this.selectedVendor.id).subscribe({
      next: (payload: Product[]) => this.vendorProducts = payload,
      error: (err: Error) => this.msg = `products fetch failed! - ${err.message}`,
      complete: () => console.log(this.vendorProducts)
    });
  }
  setupOnProductPickedEvent(): void {
    const productSubscription = this.generatorFormGroup.get('product')?.valueChanges.subscribe(product => {
      if (!product) return;

      console.log(product)
      this.selectedProduct = product;
    });

    this.formSubscription?.add(productSubscription);
  }

  setupOnQuantityPickedEvent(): void {
    const quantitySubscription = this.generatorFormGroup.get('quantity')?.valueChanges.subscribe(quantity => {
      if (quantity===null) 
        return;

  

      if(this.isProductAlreadySelected(this.selectedProduct.id))
      {
        let item = this.getPOItem(this.selectedProduct.id)
        if(item){
          item.qty = quantity
          //more logic to come
        }else{
          console.log("This should not really happen if everything is good")
        }
        //we just want to update the quantity
        console.log("Updating the quantity")
      }
      else
      {
        const poItem:PurchaseOrderLineItem = {
          id:0,
          poid:0,
          productid: this.selectedProduct.id,
          qty:quantity,
          price:this.selectedProduct.costprice
        };
        this.poItems.push(poItem);
      }
      
      //remove items with 0 quantity
      this.poItems = this.poItems.filter(item => item.qty > 0);
      
    });
    // console.log("Po Items:" + this.poItems)
    // this.poItems.forEach((item) => console.log("item:\n" + item))
    this.formSubscription?.add(quantitySubscription);
  }
  isProductAlreadySelected(productid:string):boolean{
    return this.poItems.find(item=> item.productid === productid)!== undefined;
  }
  getPOItem(productid:string): PurchaseOrderLineItem | undefined{
    
    return this.poItems.find(item=> item.productid === productid);
  }

  subtotal(): number{
    let result = 0;
    this.poItems.forEach(item=> result+= item.price * item.qty)
    return result;
return 0
  }
  tax(): number{
    const TAX_RATIO = 0.13;
    return this.subtotal() * TAX_RATIO;
  }
  total(): number{
    return this.subtotal() + this.tax();
  }

  createReport(): void {
    const po:PurchaseOrder = {
      id:0,
      vendorid:this.selectedVendor.id,
      amount:this.total(), //this will be calculated by the server
      podate:'',
      items:this.poItems
    };
    this.purchaseOrderService.create(po).subscribe({
      next: (po: PurchaseOrder) => {
        po.id > 0
          ? (this.msg = `Purchase Order ${po.id} added!`)
          : (this.msg = 'Purchase Order not added not added! - server error');
          this.generatedPurchaseOrderId = po.id;
      },
      error: (err: Error) => (this.msg = `Purchase order not not added! - ${err.message}`),
      complete: () => this.resetGenerator(),
    });
  }

  resetGenerator(): void {
    this.vendorForm.reset();
    this.productForm.reset();
    this.quantityForm.reset();
    this.selectedProduct = Object.assign({},PRODUCT_DEFAULT);
    this.selectedVendor = Object.assign({}, VENDOR_DEFAUlT);
    this.vendorProducts = [];
    this.poItems = [];
  }
  viewPdf(): void {
    window.open(`${PDF_URL}${this.generatedPurchaseOrderId}`);
  }
}

