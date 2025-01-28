
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {
FormControl,
FormGroup,
FormBuilder,
Validators,
AbstractControl,
ReactiveFormsModule
} from '@angular/forms';
import { Product
 } from '../product';
import { CommonModule } from '@angular/common';
import { MatCommonModule } from '@angular/material/core';
import { MatComponentsModule } from '@app/mat-components/mat-components.module';
import { PRODUCT_DEFAULT } from '@app/constants';
import { Vendor } from '@app/vendor/vendor';
import { ValidateInt } from '@app/validators/int.validator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeleteDialogComponent } from '@app/delete-dialog/delete-dialog.component';
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule,MatComponentsModule],
  templateUrl: './product-detail.component.html',
  styles: ``
})
//remove selected product. it needs to just be product in those spots
//they're both doing small parts of the same job
export class ProductDetailComponent implements OnInit {
  @Input() product:Product = PRODUCT_DEFAULT;
  @Input()vendors:Vendor[] |null = null;
  @Input() products:Product[] | null = null;
  @Output() cancelled = new EventEmitter();
  @Output() saved = new EventEmitter();
  @Output() deleted = new EventEmitter();
  productForm:FormGroup;
  id:FormControl;
  vendorid:FormControl;
  name:FormControl;
  costprice:FormControl;
  msrp:FormControl;
  rop:FormControl;
  eoq:FormControl;
  qoh:FormControl;
  qoo:FormControl;
  qrcode:FormControl;
  qrcodetxt:FormControl;
  constructor(private builder:FormBuilder, private dialog:MatDialog){

    this.id = new FormControl('', Validators.compose([this.uniqueCodeValidator.bind(this), Validators.required]));
    this.vendorid = new FormControl('',Validators.compose([Validators.required]));
    this.name = new FormControl('',Validators.compose([Validators.required]));
    this.costprice = new FormControl('',Validators.compose([Validators.required]));
    this.msrp = new FormControl('',Validators.compose([Validators.required]));
    this.eoq= new FormControl('',Validators.compose([Validators.required,ValidateInt]));
    this.rop = new FormControl('',Validators.compose([Validators.required,ValidateInt]));
    this.qoh = new FormControl('',Validators.compose([Validators.required,ValidateInt]));
    this.qoo = new FormControl('',Validators.compose([Validators.required,ValidateInt]));
    this.qrcode = new FormControl('');//change later
    this.qrcodetxt = new FormControl('',Validators.compose([Validators.required]));
  
    this.productForm = this.builder.group({
      id:this.id,
      vendorid:this.vendorid,
      name:this.name,
      costprice:this.costprice,
      msrp:this.msrp,
      eoq:this.eoq,
      rop:this.rop,
      qoh:this.qoh,
      qoo:this.qoo,
      qrcode:this.qrcode,
      qrcodetxt:this.product.qrcodetxt,
    });
    }
  ngOnInit(): void {
    this.productForm.patchValue({
      id:this.product.id, //changing from selectedProduct
      vendorid:this.product.vendorid,
      name:this.product.name,
      costprice:this.product.costprice,
      msrp:this.product.msrp,
      rop:this.product.rop,
      eoq:this.product.eoq,
      qoh:this.product.qoh,
      qoo:this.product.qoo,
      qrcode:this.product.qrcode,
      qrcodetxt:this.product.qrcodetxt,
    });
    
  }// ngOnInit
  
  uniqueCodeValidator(control: AbstractControl): { idExists: boolean } | null {
    /**
    * uniqueCodeValidator - needed access to products property so not
    * with the rest of the validators
    */
    if (this.products && this.products?.length > 0) {
    if (
    this.products.find(
    (p) => p.id === control.value && !this.product.id
    ) !== undefined
    ) {
    return { idExists: true };
    }
    }
    return null; // if we make it here there are no product codes
    } // uniqueCodeValidator

    updateSelectedProduct():void{
      this.product.id = this.productForm.value.id;//might need not sure
      this.product.vendorid = this.productForm.value.vendorid;
      this.product.name = this.productForm.value.name;
      this.product.costprice = this.productForm.value.costprice;
      this.product.msrp = this.productForm.value.msrp;
      this.product.eoq = this.productForm.value.eoq;
      this.product.rop = this.productForm.value.rop;
      this.product.qoh = this.productForm.value.qoh;
      this.product.qoo = this.productForm.value.qoo;
      this.product.qrcode = this.productForm.value.qrcode;
      this.product.qrcodetxt = this.productForm.value.qrcodetxt;
      this.saved.emit(this.product);
    }

    openDeleteDialog(): void
    {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = false;
      dialogConfig.data = {
        title: `Delete product ${this.product.id}`,
        entityname: 'product'
      };
      dialogConfig.panelClass = 'customdialog';
      const dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.deleted.emit(this.product);
        }
      });

    }

}
