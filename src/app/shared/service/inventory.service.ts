import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, of, shareReplay, tap } from 'rxjs';
import { API_ROUTES } from 'src/app/constants/api-routes.enum';
import { InventoryItem } from '../model/inventory.model';
import { RequestService } from './request.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  inventorySubject = new BehaviorSubject<InventoryItem[]>([]);
  inventory$ = this.inventorySubject.asObservable();

  filteredStringSubject = new BehaviorSubject('');
  filteredString$ = this.filteredStringSubject.asObservable();

  filteredInventory$ = combineLatest(this.inventory$,this.filteredString$)
    .pipe(
      map( ([inventory, filterString]) => {
        return inventory.filter( x => filterString ? x.name.toLowerCase().includes(filterString.toLowerCase()) : true)
      })
    );

  filterByName(value: string = '') {
    this.filteredStringSubject.next(value);
  }

  saveItem(item:InventoryItem, edit: any = null) {
    return new Promise(resolve => {
      let inventory = this.inventorySubject.getValue();
      let existingName = inventory.find(x => x.inventoryCode === item.inventoryCode && item?.id !== x.id);
      
      if(existingName) {
        resolve(false); 
      } else {
        const inv = this.inventorySubject.getValue();

        if(edit) {
          this.request.put(`${API_ROUTES.INVENTORY}/${item.id}`, item).subscribe(
          response => {
            let itemIndex = inv.findIndex(x => response.id === x.id);
            inv.splice(itemIndex,1,response);
            this.inventorySubject.next(inv);
            resolve(true);
          });
        } else {
          this.request.post(API_ROUTES.INVENTORY, item).subscribe(
            data => {
              inventory.unshift(data);
              this.inventorySubject.next(inventory);
              resolve(true);
            });
        };
      };
    })
  }

  deleteItem(id: number) {
    this.request.delete(`${API_ROUTES.INVENTORY}/${id}`).subscribe( () => {
      let inv = this.inventorySubject.getValue();
      const itemIndex = inv.findIndex(x => x.id === id);
      inv.splice(itemIndex,1);

      this.inventorySubject.next(inv);
    });
  }
 

  getInventory(): void {
    this.request.get(`${API_ROUTES.INVENTORY}?_sort=id&_order=desc`)
    .pipe( shareReplay(1) )
    .subscribe( (res: InventoryItem[]) => {
        this.inventorySubject.next(res);
      })
  }

  constructor(private request: RequestService) { }
}
