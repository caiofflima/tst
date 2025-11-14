import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcedimentosListarAutorizacaoPreviaComponent } from './procedimentos-listar-autorizacao-previa.component';

describe('ProcedimentosListarAutorizacaoPreviaComponent', () => {
  let component: ProcedimentosListarAutorizacaoPreviaComponent;
  let fixture: ComponentFixture<ProcedimentosListarAutorizacaoPreviaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProcedimentosListarAutorizacaoPreviaComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcedimentosListarAutorizacaoPreviaComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
});
