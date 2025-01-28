import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  template: `
    <button mat-button mat-dialog-close id="deleteCancel" class="row" style="margin-left:80%;font-size: xx-large;">
      X
    </button>
    <h2 mat-dialog-title>{{ title }}</h2>
    <mat-dialog-content>
      Do you wish to delete this {{ entityname }}?
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close id="deleteNo">No</button>
      <!-- The mat-dialog-close directive optionally accepts a value as a result for the dialog. -->
      <button mat-button [mat-dialog-close]="true" id="deleteYes">Yes</button>
    </mat-dialog-actions>
  `
})
export class DeleteDialogComponent {
  title: string = '';
  entityname: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = data.title;
    this.entityname = data.entityname
  }
}

