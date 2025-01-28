import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatComponentsModule } from '@app/mat-components/mat-components.module';

import { Vendor } from '@app/vendor/vendor';
import { VendorService } from '@app/vendor/vendor.service';
import { LINE_ITEM_DEFAULT, PDF_URL, PRODUCT_DEFAULT, PURCHASE_ORDER_DEFAULT, VENDOR_DEFAUlT } from '@app/constants';
import { Product } from '@app/product/product';
import { ProductService } from '@app/product/product.service';
import { PurchaseOrderLineItem } from '@app/purchase-order/purchase-order-line-item';
import { PurchaseOrder } from '@app/purchase-order/purchase-order';
import { PurchaseOrderService } from '@app/purchase-order/purchase-order.service';
import { MatOptionSelectionChange } from '@angular/material/core';

@Component({
  selector: 'app-viewer',
  standalone: true,
  imports: [MatComponentsModule,CommonModule],
  templateUrl: './viewer.component.html',
  styles: ``
})
export class ViewerComponent implements OnInit{

  // Get all vendors

  msg: string = '';
  vendors: Vendor[] = [];
  selectedVendor: Vendor = VENDOR_DEFAUlT;
  vendorProducts: Product[] = [];//vendorProducts
  vendorPos: PurchaseOrder[] = [];//vendorPurchaseOrders
  selectedPo : PurchaseOrder = PURCHASE_ORDER_DEFAULT;
  poItem :PurchaseOrderLineItem = LINE_ITEM_DEFAULT;
  constructor(
    private vendorService: VendorService,
    private productService: ProductService,
    private poService: PurchaseOrderService
  ) {

    }//constructor

    ngOnInit(): void {
      this.msg = 'Loading vendors from server...';
      this.getAllVendors();
    }

    getAllVendors(verbose: boolean = true): void {
      this.vendorService.getAll().subscribe({
        next: (vendors: Vendor[]) => this.vendors = vendors,
        error: (e: Error) => this.msg = `Failed to load vendors - ${e.message}`,
        complete: ()=> this.msg = 'Vendors Loaded',
      });
    }

    onVendorPicked(selection:MatOptionSelectionChange): void{
      //calls it when an option is selected and deselected
      if(!selection.isUserInput) return;
      
      this.selectedPo = Object.assign({},PURCHASE_ORDER_DEFAULT);
      this.selectedVendor = selection.source.value;
      this.productService.getSome(this.selectedVendor.id).subscribe({
        next:(product:Product[]) => this.vendorProducts = product,//vendorProducts = product
        error: (e:Error) => this.msg = `Failed to load expenses from employee ${this.selectedVendor.name}`,
      });

      this.poService.getSome(this.selectedVendor.id).subscribe({
        next: (purchaseOrders: PurchaseOrder[]) => this.vendorPos = purchaseOrders,
        error: (e: Error) => this.msg = `Failed to load purchase orders from vendor -
         ${this.selectedVendor.name} - ${e.message}`,
        complete: ()=> this.msg = `Purchase Orders for ${this.selectedVendor.name} Loaded`,
      });

 
    }
    onPoPicked(selection:MatOptionSelectionChange): void{
      if(!selection.isUserInput) return;

      this.selectedPo = selection.source.value;
    }

    viewPdf(): void {
      window.open(`${PDF_URL}${this.selectedPo.id}`);
    }
    //purchaseOrderProducts
    poProducts() : Product[] {
      return this.vendorProducts.filter(product => this.selectedPo.
        items.some(item => item.productid === product.id));
    }

    getPOItem(productid:string): PurchaseOrderLineItem | undefined{
      this.selectedPo.items.forEach(item =>{
        if(item.productid == productid){
          this.poItem = item;
        }
      });
      return this.poItem;
    }

    subtotal():number{
      let sum: number = 0;
      this.selectedPo.items.forEach(item => sum += item.price * item.qty);
      return sum;
    }
    tax(): number{
      const TAX_RATIO = 0.13;
      return this.subtotal() * TAX_RATIO;
    }

    total():number {
      return this.subtotal() + this.tax();
    }
}//component
