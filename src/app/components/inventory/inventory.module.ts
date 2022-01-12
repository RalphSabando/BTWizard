import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryComponent } from './inventory.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryFormPopupComponent } from './inventory-form-popup/inventory-form-popup.component';



@NgModule({
  declarations: [
    InventoryComponent,
    InventoryFormPopupComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    InventoryRoutingModule
  ]
})
export class InventoryModule { }
