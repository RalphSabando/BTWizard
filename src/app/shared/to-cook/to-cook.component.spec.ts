import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToCookComponent } from './to-cook.component';

describe('ToCookComponent', () => {
  let component: ToCookComponent;
  let fixture: ComponentFixture<ToCookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToCookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToCookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
