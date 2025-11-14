import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcedimentosCobertosResultComponent } from './procedimentos-cobertos-result.component';

describe('ProcedimentosCobertosResultComponent', () => {
  let component: ProcedimentosCobertosResultComponent;
  let fixture: ComponentFixture<ProcedimentosCobertosResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProcedimentosCobertosResultComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcedimentosCobertosResultComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
});
