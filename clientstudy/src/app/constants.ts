// export const BASE_URL: string = 'http://localhost:8080/api';
 export const BASE_URL: string = '/api';
 export const PDF_URL: string = '/PurchaseOrderPDF?poid=';
// export const PDF_URL: string = 'http://localhost:8080/PurchaseOrderPDF?poid=';

export const PRODUCT_DEFAULT = {
    id: '',
    vendorid:0,
    name:'',
    costprice:0,
    msrp:0,
    rop:0,
    eoq:0,
    qoh:0,
    qoo:0,
    qrcode:'',
    qrcodetxt:''
};

export const VENDOR_DEFAUlT = {
    id : 0,
    name: '',
    address1:'',
    city:'',
    province:'',
    postalcode:'',
    phone:'',
    type:'',
    email:''
};

export const PURCHASE_ORDER_DEFAULT = {
    id:0,
    vendorid:0,
    amount:0,
    podate:'',
    items:[]
}

export const LINE_ITEM_DEFAULT = {
    id:0,
    poid:0,
    productid:'',
    qty:0,
    price:0 //it will be the cost price
}
