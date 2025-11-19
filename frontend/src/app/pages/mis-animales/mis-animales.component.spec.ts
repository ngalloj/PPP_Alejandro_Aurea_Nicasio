// frontend/src/app/pages/mis-animales/mis-animales.component.spec.ts
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MisAnimalesComponent } from './mis-animales.component';

describe('MisAnimalesComponent', () => {
  let component: MisAnimalesComponent;
  let fixture: ComponentFixture<MisAnimalesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MisAnimalesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MisAnimalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
