import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { combineLatest, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { InventoryService } from 'src/app/shared/service/inventory.service';
import { RecipeService } from 'src/app/shared/service/recipe.service';
import { RecipeFormPopupComponent } from './recipe-form-popup/recipe-form-popup.component';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {
  searchKey = new FormControl(''); 
  recipes$ = this.recipeService.filteredRecipes$;
  
  constructor(
    private dialog: MatDialog,
    private inventoryService: InventoryService,
    private recipeService: RecipeService
  ) { }


  ngOnInit(): void {
    this.searchKey.valueChanges
    .pipe(
      distinctUntilChanged(),
      debounceTime(500)
    )
    .subscribe( text => this.recipeService.filterByName(text));
  }

  addRecipe() {
    this.dialog.open(RecipeFormPopupComponent,{
      panelClass: 'recipe-form',
      backdropClass: 'recipe-form-backdrop'
    });
  }

  showDetails(recipe: any) {
    
  }

 


}
