import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalculoPage } from './calculo.page';

describe('CalculoPage', () => {
  let component: CalculoPage;
  let fixture: ComponentFixture<CalculoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
