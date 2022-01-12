import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { PLACEHOLDER } from 'src/app/constants/img-placeholder.enum';
import { InventoryService } from 'src/app/shared/service/inventory.service';
import { RecipeService } from 'src/app/shared/service/recipe.service';
import { UnitService } from 'src/app/shared/service/unit.service';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss']
})
export class RecipeDetailsComponent implements OnInit {

  params$ = this.activeRoute.paramMap.pipe(map((x: any) => x.params));
  recipe: any = null;
  needIngredients: any[] = [];

  inventory$ = this.inventoryService.inventory$;
  recipes$ = this.recipeService.recipes$;
  units$ = this.unitService.units$;
  recipe$ = combineLatest(this.params$,this.recipes$, this.units$,this.inventory$)
  .pipe(
    map(([param,recipes, units,inventory]):any => {
      if(recipes && param ) {
        return [recipes.filter( r => r.id === parseInt(param.id)).map( x => ({...x, ingredients: x.ingredients.map(y => ({...y, name: inventory ? inventory.find((u: any) => u.id === y.ingredientId)?.['name'] : '',shortCode: units ? units.find((u: any) => u.id === inventory.find((u: any) => u.id === y.ingredientId)?.['unitId'])?.['shortCode'] : ''}))})), inventory, units];
      } 
    }),
    
  ).subscribe(
    ([recipe, inventory, units]) => {
      
      if( recipe ) {
        this.recipe = recipe[0];
        let cloned = inventory.map((x: any) => Object.assign({}, x));

        recipe[0].ingredients.map( (c: any) => {
          const invId = cloned.findIndex( (i: any) => i.id === c.ingredientId);
          if(invId >= 0) cloned[invId].quantity -= c.quantity;
        });
        this.needIngredients = cloned.filter((x: any) => x.quantity < 0).map((c: any) => ({...c, shortCode: units.find((u: any) => u.id === c.unitId)['shortCode']}));
      } else {
        this.route.navigate(['']);
      }
    }
  );

  absoluteValue(num: number): number {
    return Math.abs(num);
  }

  convertLineBreak(content: string): string {
    return content ? content.replace(/\n/g,"<br>") : '';
  }

  constructor( 
    private activeRoute: ActivatedRoute,
    private recipeService: RecipeService,
    private inventoryService: InventoryService,
    private unitService: UnitService,
    private route: Router
  ) { }


  ngOnInit(): void {}
  
  getBackGroundImage(): string {
    return this.recipe?.imgUrl ?? PLACEHOLDER.IMAGE;
  }


}
