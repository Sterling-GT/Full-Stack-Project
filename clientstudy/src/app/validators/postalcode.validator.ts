import { AbstractControl } from '@angular/forms';
export function ValidatePostalCode(control: AbstractControl): { invalidPostalCode: boolean } | null {
const POSTAL_REGEXP = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
return !POSTAL_REGEXP.test(control.value) ? { invalidPostalCode: true } : null;
} // ValidatePhone