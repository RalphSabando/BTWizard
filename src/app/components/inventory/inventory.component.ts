import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { TableConfig } from 'src/app/shared/model/table-config.model';
import { InventoryService } from 'src/app/shared/service/inventory.service';
import { InventoryFormPopupComponent } from './inventory-form-popup/inventory-form-popup.component';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  inventory$ = this.inventoryService.filteredInventory$;

  tableConfig: TableConfig = {
    headers: [
      { name: "Item", sortable: true, key: "name" },
      { name: "Quantity", key: "quantity" }
    ],
    clickableRows: true
  }

  searchKey = new FormControl('');  
  
  constructor( 
    private inventoryService: InventoryService,
    private dialog: MatDialog
  
    ) { }
  
  ngOnInit(): void {
    this.inventoryService.getInventory();
    this.searchKey
    .valueChanges
    .pipe(
      distinctUntilChanged(),
      debounceTime(500)
    )
    .subscribe(x => this.inventoryService.filterByName(x));
  }

  changeQuantity(item: any) {
    const dialogRef = this.dialog.open(InventoryFormPopupComponent, {
      data: { ...item },
      disableClose: true
    });
  }

  addItem() {
    const dialogRef = this.dialog.open(InventoryFormPopupComponent);
  }

}
