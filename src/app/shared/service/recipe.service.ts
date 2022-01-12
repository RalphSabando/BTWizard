import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, forkJoin, map, Observable, pipe, shareReplay } from 'rxjs';
import { API_ROUTES } from 'src/app/constants/api-routes.enum';
import { CustomDialog } from '../model/dialog-config.model';
import { Recipe, ToCook } from '../model/recipe.model';
import { ConfirmationPopupService } from './confirmation-popup.service';
import { RequestService } from './request.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  
  constructor( 
    private requestService: RequestService,
    private confirmationService: ConfirmationPopupService
  ) { }
  recipeSubject  = new BehaviorSubject<Recipe[]>([]);
  recipes$ = this.recipeSubject.asObservable();

  toCookSubject = new BehaviorSubject<ToCook[] | any[]>([]);
  toCook$ = this.toCookSubject.asObservable();

  filteredStringSubject = new BehaviorSubject('');
  filteredString$ = this.filteredStringSubject.asObservable();

  filteredRecipes$ = combineLatest(this.recipes$,this.filteredString$)
    .pipe(
      map( ([recipe, filterString]) => {
        return recipe.filter( x => filterString ? x.name.toLowerCase().includes(filterString.toLowerCase()) : true)
      })
    );

  filterByName(value: string = '') {
    this.filteredStringSubject.next(value);
  }

  getRecipes() {
    this.requestService.get(`${API_ROUTES.RECIPES}?_sort=id&_order=desc`)
    .pipe( shareReplay(1) )
    .subscribe( result => this.recipeSubject.next(result));
  }

  getToCook() {
    this.requestService.get(`${API_ROUTES.TO_COOK}`)
    .pipe( shareReplay(1) )
    .subscribe( result => this.toCookSubject.next(result));
  }

  saveToCook(data: ToCook, id:any = null) {
    let toCook = this.toCookSubject.getValue();
    if(id) {
      this.requestService.put(`${API_ROUTES.TO_COOK}/${id}`,data)
      .subscribe( (result: any) => {
        const toCookIndex = toCook.findIndex(t => t.id === id);
        toCook.splice(toCookIndex,1,result);
        this.toCookSubject.next(toCook);
      });
    } else {
      this.requestService.post(`${API_ROUTES.TO_COOK}`,data)
      .subscribe( (result: any) => {
        toCook.unshift(result);
        this.toCookSubject.next(toCook)
      });
    }

  }

  removeToCook(id: number) {
    this.requestService.delete(`${API_ROUTES.TO_COOK}/${id}`)
    .subscribe( (result: any) => {
      let toCook = this.toCookSubject.getValue();
      const toCookIndex = toCook.findIndex( t => t.id === id);
      toCook.splice(toCookIndex, 1);
      this.toCookSubject.next(toCook);
    });
  }



  save(value: any, edit: any = null) {
    return new Promise(resolve => {
      const initialRecipe = this.recipeSubject.getValue();
      const existingName = initialRecipe.find( r => r.slag === value.slag);
      
      if(edit) {
        if(existingName && existingName.id !== value.id) {
          this.nameExist();
          resolve(false);
        } else {
          this.requestService.put(`${API_ROUTES.RECIPES}/${value.id}`,value).subscribe(
            response => {
              const recipeIndex = initialRecipe.findIndex(r => r.id === response.id);
              initialRecipe.splice(recipeIndex,1, response);
              this.recipeSubject.next(initialRecipe);
              resolve(response);
            }
          )
        }

      } else if (existingName){
        this.nameExist();
        resolve(false);
      } else {
        this.requestService.post(`${API_ROUTES.RECIPES}`,value).subscribe(
          response => {
            initialRecipe.unshift(response);
            resolve(response);
          }
        )
      }
    });
  }

  nameExist() {
    const dialogConfig: CustomDialog = {
      header: "Warning",
      content: `Recipe already exists!`,
      type: 'warning',
      buttons: [
        { name: "Close" }
      ]
    }

    this.confirmationService.confirmation(dialogConfig);
  }
  

  deleteRecipe(id: number) {
    this.requestService.delete(`${API_ROUTES.RECIPES}/${id}`)
    .subscribe( (result: any) => {
      let recipes = this.recipeSubject.getValue();
      const recipe = recipes.findIndex( t => t.id === id);
      recipes.splice(recipe, 1);
      this.recipeSubject.next(recipes);
    });
  }


}
