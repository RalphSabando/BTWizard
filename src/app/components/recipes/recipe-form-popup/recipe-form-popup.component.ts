import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, distinctUntilChanged, filter, map, take, tap } from 'rxjs';
import { PLACEHOLDER } from 'src/app/constants/img-placeholder.enum';
import { CustomDialog } from 'src/app/shared/model/dialog-config.model';
import { Recipe } from 'src/app/shared/model/recipe.model';
import { ConfirmationPopupService } from 'src/app/shared/service/confirmation-popup.service';
import { InventoryService } from 'src/app/shared/service/inventory.service';
import { RecipeService } from 'src/app/shared/service/recipe.service';
import { UnitService } from 'src/app/shared/service/unit.service';

@Component({
  selector: 'app-recipe-form-popup',
  templateUrl: './recipe-form-popup.component.html',
  styleUrls: ['./recipe-form-popup.component.scss']
})
export class RecipeFormPopupComponent implements OnInit {

  selectedIngredientsSubject = new BehaviorSubject<any>([]);
  selectedIngredients$ = this.selectedIngredientsSubject.asObservable();

  inventory$ = this.inventoryService.inventory$;
  units$ = this.unitService.units$;
  inventoryOptions$ = combineLatest(this.inventory$, this.units$,this.selectedIngredients$)
  .pipe(
    map( ([inventory, unit, selectedIngredients]) => {
      return inventory.map(x => ({...x, disabled: selectedIngredients.includes(x.id), unitName: unit.find( (u: any) => u.id === x.unitId).shortCode }))
    })
  );

  imgplaceholder = PLACEHOLDER.IMAGE;
  constructor(
    @Inject(MAT_DIALOG_DATA) public item: Recipe,
    private fb: FormBuilder, 
    private _ngZone: NgZone, 
    private inventoryService: InventoryService,
    private unitService: UnitService,
    private recipeService: RecipeService,
    private dialogRef: MatDialogRef<RecipeFormPopupComponent>,
    private confirmationService: ConfirmationPopupService
  ) {
  this.ingredients.valueChanges
  .pipe(
    map(x => x.filter((s: any) => s?.ingredientId).map((y:any) => y?.ingredientId))
  ).subscribe(
      result => {
        this.selectedIngredientsSubject.next(result);
      }
    )
   }

  recipeFormGroup = this.fb.group({
    name: ['', Validators.required],
    imgUrl: [''],
    instructions: ['',Validators.required],
    ingredients: this.fb.array(this.getDefaultValue())
  });

  @ViewChild('autosize') autosize: CdkTextareaAutosize | undefined;

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize?.resizeToFitContent(true));
  }

  getBackGroundImage() : string {
    return this.recipeFormGroup.get('imgUrl')?.value ? this.recipeFormGroup.get('imgUrl')?.value : this.imgplaceholder;
  }

  get ingredients() {
    return this.recipeFormGroup.controls["ingredients"] as FormArray;
  }

  addIngredientForm(value: any = '') {
    return this.fb.group({
        ingredientId: [ value ? value.ingredientId : '', Validators.required],
        quantity: [ value ? value.quantity : 1, [Validators.required, Validators.min(1)]]
    });
  }

  addIngredient(value: any = '') {
    this.ingredients.push(this.addIngredientForm(value));
  }

  getDefaultValue(): any {
    return this.item ? this.item?.ingredients.map(x => this.addIngredientForm(x)) : [''];
  }

  removeIngredient(ingredientIndex: number) {
    this.ingredients.removeAt(ingredientIndex,{ emitEvent: true});
    this.recipeFormGroup.markAsDirty();
  }

  saveChanges() {
    if(this.recipeFormGroup.valid) {
      const formValue = this.recipeFormGroup.value;
      this.recipeService.save({ 
        ...formValue,
        slag: formValue.name.toLowerCase().replace(/\s/g,"-"),
        ...(this.item && {id: this.item.id})
      }, this.item).then( response => {
        if(response) {
          this.dialogRef.close();
        }
      });
    };
  }

  deleteRecipe() {
    const dialogConfig: CustomDialog = {
      header: "Detete Recipe",
      content: `Are you sure you want to delete this recipe ?`,
      type: 'warning',
      buttons: [
        { name: "Cancel" },
        { name: "Delete", color: "warn", action: "main" }
      ]
    }

    this.confirmationService.warningWithConfirmation(dialogConfig, 
      (response: any) => {
        if(response) {
          this.recipeService.deleteRecipe(this.item.id!);
          this.dialogRef.close();
        }
      });
  }



  ngOnInit(): void {
    if(this.item) {
      this.recipeFormGroup.patchValue({
        name: this.item.name,
        imgUrl: this.item.imgUrl,
        instructions: this.item.instructions
      });

      this.recipeFormGroup.markAsPristine();

    }
  }

}
