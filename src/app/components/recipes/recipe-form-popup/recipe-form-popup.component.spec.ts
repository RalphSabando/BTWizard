import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeFormPopupComponent } from './recipe-form-popup.component';

describe('RecipeFormPopupComponent', () => {
  let component: RecipeFormPopupComponent;
  let fixture: ComponentFixture<RecipeFormPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipeFormPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeFormPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
