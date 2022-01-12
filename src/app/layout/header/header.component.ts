import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { combineLatest, concat, distinctUntilChanged, filter, flatMap, forkJoin, from, groupBy, map, mergeAll, mergeMap, of, scan, tap, toArray, withLatestFrom } from 'rxjs';
import { NavRouteList } from 'src/app/constants/routes.const';
import { InventoryService } from 'src/app/shared/service/inventory.service';
import { RecipeService } from 'src/app/shared/service/recipe.service';
import { UnitService } from 'src/app/shared/service/unit.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  public routes = NavRouteList;
  recipes$ = this.recipeService.recipes$;
  toCook$ = this.recipeService.toCook$;
  units$ = this.unitService.units$;
  inventory$ = this.inventoryService.inventory$;

  toCookRecipe$ = combineLatest(this.recipes$, this.toCook$, this.inventory$)
  .pipe(
    map(([recipes, toCook, inventory]) => {
      return toCook.map(tc => { 
        const recipe = recipes.find(r => r.id === tc.id);
        return ({...tc, recipeName: recipe?.name, ingredients: recipe?.ingredients })
      });
    })
  );


  totalConsumedIngredients$ = this.toCookRecipe$
  .pipe(
    distinctUntilChanged(),
    map((x:any) => x.filter((y: any) => y.ingredients !== undefined)),
    map(x => x.map((y: any) => y.ingredients.map((i: any) => ({...i, quantity: i.quantity * y.quantity}))).flat())
  );

  neededIngredients$ = combineLatest(this.totalConsumedIngredients$, this.inventory$,this.units$)
  .pipe(
    map(([consumed, inventory, units]) => {
      let cloned = inventory.map(x => Object.assign({}, x));

      consumed.map( (c: any) => {
        const invId = cloned.findIndex( i=> i.id === c.ingredientId);
        if(invId >= 0) cloned[invId].quantity -= c.quantity;
      });

      return cloned.filter(x => x.quantity < 0).map(c => ({...c, shortCode: units.find((u: any) => u.id === c.unitId)['shortCode']}));
    })
  );

  constructor(
    private recipeService: RecipeService,
    private inventoryService: InventoryService,
    private unitService: UnitService
  ) { 
    this.recipeService.getToCook();
    this.recipeService.getRecipes();
    this.inventoryService.getInventory();
  }



  ngOnInit(): void {}

}
