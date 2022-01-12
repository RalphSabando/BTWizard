import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PLACEHOLDER } from 'src/app/constants/img-placeholder.enum';
import { NavRoutes } from 'src/app/constants/routes.const';
import { Recipe, ToCook } from 'src/app/shared/model/recipe.model';
import { RecipeService } from 'src/app/shared/service/recipe.service';
import { RecipeFormPopupComponent } from '../recipe-form-popup/recipe-form-popup.component';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss']
})
export class RecipeCardComponent implements OnInit {

  @Input() recipe!: Recipe;

  constructor(
    private dialog: MatDialog, 
    private recipeService: RecipeService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  getBackGroundImage() : string {
    return this.recipe.imgUrl ?? PLACEHOLDER.IMAGE;
  }

  editRecipe(event: any) {
    event.stopPropagation();
    this.dialog.open(RecipeFormPopupComponent,{
      panelClass: 'recipe-form',
      backdropClass: 'recipe-form-backdrop',
      data: { ...this.recipe }
    });
  }

  addToCook(event: any) {
    event.stopPropagation();
    this.recipeService.saveToCook({
      id: this.recipe.id,
      quantity: 1
    })
  }

  checkIfAdded(): boolean {
    let toCook = this.recipeService.toCookSubject.getValue();
    return toCook.find((tc: ToCook) => tc.id === this.recipe.id );
  }

  removeToCook(event: any) {
    event.stopPropagation();
    this.recipeService.removeToCook(this.recipe.id);
  }

  goToRecipeDetails(event: any) {
    event.stopPropagation();
    this.router.navigate([`${NavRoutes.RECIPE}/${this.recipe.id}`]);
  }

}
