import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavRoutes } from 'src/app/constants/routes.const';
import { CustomDialog } from '../model/dialog-config.model';
import { Recipe, ToCook } from '../model/recipe.model';
import { ConfirmationPopupService } from '../service/confirmation-popup.service';
import { RecipeService } from '../service/recipe.service';

@Component({
  selector: 'app-to-cook',
  templateUrl: './to-cook.component.html',
  styleUrls: ['./to-cook.component.scss']
})
export class ToCookComponent implements OnInit {

  @Input() toCook: any = [];
  @Input() neededIngredients: any = [];
  

  constructor(
    private recipeService: RecipeService,
    private confirmationService: ConfirmationPopupService,
    private router: Router
  ) { }

  ngOnInit(): void {}


  updateQuantity(event: any, item: ToCook, add = false) {
    event.stopPropagation();
    item.quantity = add ? item.quantity + 1 : item.quantity == 1 ? 1 : item.quantity - 1;
    this.recipeService.saveToCook({ id: item.id, quantity:item.quantity }, item.id);
  }

  removeToCook(event: any, item: ToCook) {
    event.stopPropagation();
    const dialogConfig: CustomDialog = {
      header: "Remove Recipe",
      content: `Are you sure you want to remove this recipe from To Cook ?`,
      type: 'warning',
      buttons: [
        { name: "Cancel" },
        { name: "Remove", color: "warn", action: "main" }
      ]
    }

    this.confirmationService.warningWithConfirmation(dialogConfig, 
      (response: any) => {
        if(response) {
          this.recipeService.removeToCook(item.id!);
        }
      });
  }
  

  absoluteValue(num: number): number {
    return Math.abs(num);
  }

  goToRecipeDetails(item: Recipe) {
    this.router.navigate([`${NavRoutes.RECIPE}/${item.id}`]);
  }
}
