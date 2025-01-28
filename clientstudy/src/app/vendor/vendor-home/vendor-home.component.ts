import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Vendor } from '../vendor';
import { VendorService } from '../vendor.service';
@Component({
templateUrl: 'vendor-home.component.html',
})
export class VendorHomeComponent implements OnInit {
msg: string;
vendors$?: Observable<Vendor[]>;
vendor: Vendor;
hideEditForm: boolean;
constructor(public vendorService: VendorService) {
this.vendor = {
    id: 0,
    name:'',
    address1:'',
    city:'',
    province:'',
    postalcode:'',
    phone:'',
    type:'',
    email:'',
};
this.msg = '';
this.hideEditForm = true;
} // constructor
ngOnInit(): void {
    this.msg = `Loading...`;
    this.getAll();
    } // ngOnInit
    /**
    * getAll - retrieve everything
    */
    getAll(): void {
    this.vendors$ = this.vendorService.getAll();
    this.vendors$.subscribe({
    error: (e: Error) => this.msg = `Couldn't get Vendors - ${e.message}`,
    complete: () => this.msg = `Vendors loaded!`,
    });
} // getAll
select(vendor: Vendor): void {
this.vendor = vendor;
this.msg = `${vendor.name} selected`;
this.hideEditForm = !this.hideEditForm;
} // select
/**
* cancelled - event handler for cancel button
*/
cancel(msg?: string): void {
msg ? (this.msg = 'Operation cancelled') : null;
this.hideEditForm = !this.hideEditForm;
} // cancel
/**
* update - send changed update to service
*/
update(vendor: Vendor): void {
this.vendorService.update(vendor).subscribe({
// Create observer object
next: (emp: Vendor) => (this.msg = `Vendor ${emp.id} updated!`),
error: (err: Error) => (this.msg = `Update failed! - ${err.message}`),
complete: () => (this.hideEditForm = !this.hideEditForm),
});
} // update
/**
* save - determine whether we're doing and add or an update
*/
save(vendor: Vendor): void {
vendor.id ? this.update(vendor) : this.add(vendor);
} // save
/**
* add - send vendor to service, receive new vendor back
*/
add(vendor: Vendor): void {
vendor.id = 0;
this.vendorService.create(vendor).subscribe({
// Create observer object
next: (v: Vendor) => {
this.msg = `Vendor ${v.id} added!`;
},
error: (err: Error) =>
(this.msg = `Vendor not added! - ${err.message}`),
complete: () => (this.hideEditForm = !this.hideEditForm),
});
} // add
/**
* delete - send vendor id to service for deletion
*/
delete(vendor: Vendor): void {
this.vendorService.delete(vendor.id.toString()).subscribe({
// Create observer object
next: (numOfVendorsDeleted: number) => {
numOfVendorsDeleted === 1
? (this.msg = `Vendor ${vendor.name} deleted!`)
: (this.msg = `vendor not deleted`);
},
error: (err: Error) => (this.msg = `Delete failed! - ${err.message}`),
complete: () => (this.hideEditForm = !this.hideEditForm),
});
} // delete
/**
* newVendor - create new vendor instance
*/
newVendor(): void {
this.vendor = {
    id: 0,
    name:'',
    address1:'',
    city:'',
    province:'',
    postalcode:'',
    phone:'',
    type:'',
    email:'',
};
this.hideEditForm = !this.hideEditForm;
this.msg = 'New Vendor';
} // newVendor
} // VendorHomeComponent