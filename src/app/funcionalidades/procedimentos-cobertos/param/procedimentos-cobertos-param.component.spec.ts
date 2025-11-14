import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcedimentosCobertosParamComponent } from './procedimentos-cobertos-param.component';

describe('ProcedimentosCobertosParamComponent', () => {
  let component: ProcedimentosCobertosParamComponent;
  let fixture: ComponentFixture<ProcedimentosCobertosParamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProcedimentosCobertosParamComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcedimentosCobertosParamComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
});
