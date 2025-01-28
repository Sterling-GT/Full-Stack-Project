import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatComponentsModule } from '@app/mat-components/mat-components.module';
import { Product } from '@app/product/product';
import { ProductService } from '@app/product/product.service';
import { Sort } from '@angular/material/sort';
import { Vendor } from '@app/vendor/vendor';
import { VendorModule } from '@app/vendor/vendor.module';
import { VendorService } from '@app/vendor/vendor.service';
import { PRODUCT_DEFAULT } from '@app/constants';
import { ProductDetailComponent } from "../product-detail/product-detail.component";
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-product-home',
  standalone: true,
  imports: [CommonModule, MatComponentsModule, VendorModule,ProductDetailComponent],
  templateUrl: './product-home.component.html',
})
export class ProductHomeComponent implements OnInit {
  msg: string = ''; 
  displayedColumns: string[] = ['id', 'name', 'vendorid'];
  dataSource: MatTableDataSource<Product> = new MatTableDataSource<Product>();
  showDetails:boolean = false;
  vendors:Vendor[] = [];
  productInDetail:Product = PRODUCT_DEFAULT;
  pageSize = 5;
  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  constructor(public productService: ProductService, public vendorService:VendorService) {
  }

  ngOnInit(): void {
    this.getAllVendors();
    this.getAllProducts();
  }

  getAllProducts(verbose: boolean = true): void {
    this.productService.getAll().subscribe({
      next: (products: Product[]) => this.dataSource.data = products,
      error: (e: Error) => this.msg = `Failed to load products - ${e.message}`,
      complete: () => verbose ? this.msg = `Products loaded!` : null,
    });
  }//getAllProducts
  getAllVendors(verbose: boolean = true): void {
    this.vendorService.getAll().subscribe({
      next: (vendors: Vendor[]) => this.vendors = vendors,
      error: (e: Error) => this.msg = `Failed to load vendors - ${e.message}`,
      complete: () => verbose ? this.msg = `Vendors loaded!` : null,
    });
  }//getAllVendors
  select(selectedProduct:Product):void{
    this.productInDetail = selectedProduct;
    this.msg = `Product ${this.productInDetail.id} selected`;
    this.showDetails = true;
  }//select
  cancel() : void {
    this.msg = `Operation Cancelled`;
    this.showDetails = false;
  }//cancel
  create(product:Product):void{
    this.msg = `Creating Product...`;
    this.productService.create(product).subscribe({
    next:(p:Product)=>{
      this.msg = p.id !== '' 
      ?`Product ${p.id} created!`
      :`Product ${p.id} not created`
      this.getAllProducts(false);
    },
    error:(e:Error) => this.msg = `Create Failed - ${e.message}`,
    complete: () => this.showDetails = false,
    });
  }//create

  update(product:Product):void{
    this.msg = 'Updating Product...';
    this.productService.update(product).subscribe({
     next:(p:Product)=>{
      this.msg = `Product ${p.id} updated`;
      this.getAllProducts(false);
     },
     error:(e:Error) => this.msg = `Update Failed - ${e.message}`,
     complete: () => this.showDetails = false,
    });

  }//update
  delete(product:Product):void{
    this.productService.delete(product.id).subscribe({
      next:(rowsUpdated:number) => {
        this.msg = rowsUpdated === 1
        ?`Product ${product.id} deleted!`
        : `Product ${product.id} not deleted!`;
        this.getAllProducts(false);
      },
      error:(e:Error) => this.msg = `Delete Failed - ${e.message}`,
      complete: () => this.showDetails = false,
    });
  }
  save(product:Product):void{
    this.productAlreadyExists(product) ? this.update(product): this.create(product);
  }

  startNewProduct(): void{
    this.productInDetail = Object.assign({},PRODUCT_DEFAULT);
    this.msg = 'New Product';
    this.showDetails = true;
  }
  sortProductsWithObjectLiterals(sort: Sort): void {
    const literals = {

      id: () => 
        this.dataSource.data = this.dataSource.data.sort(
          (a: Product, b: Product) => sort.direction === 'asc'
          ? (a.id < b.id ? -1 :1 )
          : (b.id < a.id ? -1 :1)
        ),


      vendorid: () =>
        this.dataSource.data = this.dataSource.data.sort(
          (a: Product, b: Product) => sort.direction === 'asc'
            ? (a.vendorid - b.vendorid)
            : (b.vendorid - a.vendorid)
        ),

      name: () =>
        this.dataSource.data = this.dataSource.data.sort(
          (a: Product, b: Product) => sort.direction === 'asc'
            ? (a.name < b.name ? -1 : 1)
            : (b.name < a.name ? -1 : 1)
        ),
    };

    literals[sort.active as keyof typeof literals]();
  }

  productAlreadyExists(product:Product):boolean{
    let products: Product[] = this.dataSource.data;
    if(products?.length > 0){
      if(products.find(p => p.id === product.id) !== undefined){
        return true;
      }
    }
    return false;
  }

}
