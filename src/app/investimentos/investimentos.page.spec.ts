import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvestimentosPage } from './investimentos.page';

describe('InvestimentosPage', () => {
  let component: InvestimentosPage;
  let fixture: ComponentFixture<InvestimentosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestimentosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
