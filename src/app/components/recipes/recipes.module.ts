import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { RecipesComponent } from './recipes.component';
import { RecipesRoutingModule } from './recipes-routing.module';
import { RecipeFormPopupComponent } from './recipe-form-popup/recipe-form-popup.component';
import { RecipeCardComponent } from './recipe-card/recipe-card.component';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';



@NgModule({
  declarations: [
    RecipesComponent,
    RecipeFormPopupComponent,
    RecipeCardComponent,
    RecipeDetailsComponent
  ],
  imports: [
    SharedModule,
    RecipesRoutingModule,
    CommonModule
  ]
})
export class RecipesModule { }
