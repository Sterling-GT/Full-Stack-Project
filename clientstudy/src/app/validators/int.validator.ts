import { AbstractControl } from '@angular/forms';
export function ValidateInt(control: AbstractControl): { invalidNum: boolean } | null {
const INT_REGEXP = /^\d+$/;
return !INT_REGEXP.test(control.value) ? { invalidNum: true } : null;
} // ValidateNum