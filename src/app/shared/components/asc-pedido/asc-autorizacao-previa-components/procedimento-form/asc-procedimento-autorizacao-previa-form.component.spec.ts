import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService, ProcedimentoPedidoService, ProcedimentoService, SessaoService, SituacaoPedidoProcedimentoService } from 'app/shared/services/services';
import { of } from 'rxjs';
import { AscProcedimentoAutorizacaoPreviaFormComponent } from './asc-procedimento-autorizacao-previa-form.component';

describe('AscProcedimentoAutorizacaoPreviaFormComponent', () => {
  let component: AscProcedimentoAutorizacaoPreviaFormComponent;
  let fixture: ComponentFixture<AscProcedimentoAutorizacaoPreviaFormComponent>;
  const messageServiceSpy = { getDescription: jest.fn() };
  const situacaoPedidoProcedimentoServiceSpy = { init: jest.fn() };
  const sessaoServiceSpy = { init: jest.fn() };
  const procedimentoServiceSpy = { init: jest.fn() };
  const procedimentoPedidoServiceSpy = { pedidoListenerValorNotaFiscal: jest.fn() };
  procedimentoPedidoServiceSpy.pedidoListenerValorNotaFiscal.mockReturnValue(of({valor: 1})));
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [AscProcedimentoAutorizacaoPreviaFormComponent],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: SessaoService, useValue: sessaoServiceSpy },
        { provide: SituacaoPedidoProcedimentoService, useValue: situacaoPedidoProcedimentoServiceSpy },
        { provide: ProcedimentoService, useValue: procedimentoServiceSpy },
        { provide: ProcedimentoPedidoService, useValue: procedimentoPedidoServiceSpy },
      ]
    }).compileComponents();
    });

  beforeEach(() => {
    fixture = TestBed.createComponent(AscProcedimentoAutorizacaoPreviaFormComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});