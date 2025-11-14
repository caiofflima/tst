import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { ProcedimentosListarAutorizacaoPreviaComponent } from './procedimentos-listar-autorizacao-previa.component';
import { ProcedimentoService, MessageService } from 'app/shared/services/services';
import { DuvidasService } from 'app/shared/services/comum/duvidas.service';
import { of } from 'rxjs';

describe('ProcedimentosListarAutorizacaoPreviaComponent', () => {
  let component: ProcedimentosListarAutorizacaoPreviaComponent;
  let fixture: ComponentFixture<ProcedimentosListarAutorizacaoPreviaComponent>;

  const procedimentoServiceSpy = { getProcedimento: jest.fn(), consultarTodos: jest.fn() };
  procedimentoServiceSpy.consultarTodos.mockReturnValue(of([]));
  const locationSpy = { back: jest.fn() };
  const messageServiceSpy = { getDescription: jest.fn() };
  const duvidasServiceSpy = { buscarPorParametro: jest.fn() };
  duvidasServiceSpy.buscarPorParametro.mockReturnValue(of({}));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProcedimentosListarAutorizacaoPreviaComponent],
      providers: [
        { provide: ProcedimentoService, useValue: procedimentoServiceSpy },
        { provide: Location, useValue: locationSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: DuvidasService, useValue: duvidasServiceSpy }
      ]
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
