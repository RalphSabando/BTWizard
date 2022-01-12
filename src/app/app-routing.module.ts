import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryComponent } from './components/inventory/inventory.component';
import { RecipesComponent } from './components/recipes/recipes.component';

const routes: Routes = [
  { 
    path:'recipes', 
    loadChildren: () => import('./components/recipes/recipes.module').then(m => m.RecipesModule)
  },
  { 
    path:'inventory',
    loadChildren: () => import('./components/inventory/inventory.module').then(m => m.InventoryModule)
  },
  { path: '**', pathMatch: 'full', redirectTo: 'recipes' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }