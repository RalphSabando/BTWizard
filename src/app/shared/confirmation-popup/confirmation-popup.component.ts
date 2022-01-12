import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomDialog } from '../model/dialog-config.model';

@Component({
  selector: 'app-confirmation-popup',
  templateUrl: './confirmation-popup.component.html',
  styleUrls: ['./confirmation-popup.component.scss']
})
export class ConfirmationPopupComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogConfig: CustomDialog,
    public dialogRef: MatDialogRef<ConfirmationPopupComponent>
    
  ) { }


  ngOnInit(): void {
  }

  action(action: string = '') {
    this.dialogRef.close(action);
  }

}
