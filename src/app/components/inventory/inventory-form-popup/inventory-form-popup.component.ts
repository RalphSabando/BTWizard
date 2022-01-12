import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { shareReplay } from 'rxjs';
import { API_ROUTES } from 'src/app/constants/api-routes.enum';
import { CustomDialog } from 'src/app/shared/model/dialog-config.model';
import { InventoryItem, Unit } from 'src/app/shared/model/inventory.model';
import { ConfirmationPopupService } from 'src/app/shared/service/confirmation-popup.service';
import { InventoryService } from 'src/app/shared/service/inventory.service';
import { RequestService } from 'src/app/shared/service/request.service';

@Component({
  selector: 'app-inventory-form-popup',
  templateUrl: './inventory-form-popup.component.html',
  styleUrls: ['./inventory-form-popup.component.scss']
})
export class InventoryFormPopupComponent implements OnInit {
  units: Unit[] = []; 
  inventoryGroup = this.fb.group({
    "name": ['', Validators.required],
    "quantity": [1, [Validators.required, Validators.min(0)]],
    "itemUnit": [1, Validators.required],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public item: InventoryItem,
    private fb: FormBuilder,
    private request: RequestService,
    private inventoryService: InventoryService,
    private confirmationService: ConfirmationPopupService,
    private dialogRef: MatDialogRef<InventoryFormPopupComponent>
  ) { }

  ngOnInit(): void {
    this.getUnits();
    this.checkForm();
  }

  checkForm() {
    if(this.item) {
      this.inventoryGroup.setValue({
        name: this.item.name,
        quantity: this.item.quantity,
        itemUnit: this.item.unitId
      });
    }
  }

  saveChanges() {
    if(this.inventoryGroup.valid) {
      const item: InventoryItem = {
        name: this.inventoryGroup.get('name')?.value,
        inventoryCode: this.inventoryGroup.get('name')?.value.toLowerCase().replace(/\s/g,"-"),
        unitId: this.inventoryGroup.get('itemUnit')?.value,
        quantity: this.inventoryGroup.get('quantity')?.value,
        ...(this.item && {id: this.item.id})
      }

      this.inventoryService.saveItem(item, this.item)
      .then( result => {
        if(!result) {
          const dialogConfig: CustomDialog = {
            header: "Warning",
            content: `Item name already exist!`,
            type: 'warning',
            buttons: [
              { name: "Close" }
            ]
          }

          this.confirmationService.confirmation(dialogConfig);
          
        } else {
          this.dialogRef.close();
        }
      });
    }
  }

  getUnits() {
    this.request.get(API_ROUTES.UNITS)
    .pipe(shareReplay(1))
    .subscribe( units => this.units = units);
  }

  deleteItem() {
    const dialogConfig: CustomDialog = {
      header: "Detete item",
      content: `Are you sure you want to delete ${this.item.name} ?`,
      type: 'warning',
      buttons: [
        { name: "Cancel" },
        { name: "Delete", color: "warn", action: "main" }
      ]
    }

    this.confirmationService.warningWithConfirmation(dialogConfig, 
      (response: any) => {
        if(response) {
          this.inventoryService.deleteItem(this.item.id!);
          this.dialogRef.close();
        }
      });
  }



}
