import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';
import { CustomDialog } from '../model/dialog-config.model';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationPopupService {

  constructor(private dialog: MatDialog) { }

  warningWithConfirmation(
    dialogConfig: CustomDialog, mainAction: any ): any {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      data: { ...dialogConfig },
      panelClass: 'confirmation-popup'
    });

    dialogRef.afterClosed().subscribe(
      (result: any) => { 
        if(result) mainAction(result);
      }
    )

  }

  confirmation(dialogConfig: CustomDialog ): any {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      data: { ...dialogConfig },
      panelClass: 'confirmation-popup'
  });
  }
}
