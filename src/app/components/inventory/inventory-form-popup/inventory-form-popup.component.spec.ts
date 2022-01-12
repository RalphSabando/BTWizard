import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryFormPopupComponent } from './inventory-form-popup.component';

describe('InventoryFormPopupComponent', () => {
  let component: InventoryFormPopupComponent;
  let fixture: ComponentFixture<InventoryFormPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryFormPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryFormPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
