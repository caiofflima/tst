import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutorizacaoPreviaService, MessageService, ProcedimentoPedidoService, ProcedimentoService, SessaoService, SituacaoPedidoProcedimentoService } from 'app/shared/services/services';
import { of } from 'rxjs';
import { AscFormularioReembolsoConsultaComponent } from './asc-formulario-reembolso-consulta.component';

describe('AscFormularioReembolsoConsultaComponent', () => {
  let component: AscFormularioReembolsoConsultaComponent;
  let fixture: ComponentFixture<AscFormularioReembolsoConsultaComponent>;
  const messageServiceSpy = { getDescription: jest.fn() };
  const situacaoPedidoProcedimentoServiceSpy = { init: jest.fn() };
  const sessaoServiceSpy = { init: jest.fn() };
  const procedimentoServiceSpy = { init: jest.fn() };
  const procedimentoPedidoServiceSpy = { pedidoListenerValorNotaFiscal: jest.fn() };
  const autorizacaoPreviaServiceSpy = { consultarPorIdBeneficiarioAndIdProcedimento: jest.fn() };
  procedimentoPedidoServiceSpy.pedidoListenerValorNotaFiscal = of({valor: 1});


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [AscFormularioReembolsoConsultaComponent],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: SessaoService, useValue: sessaoServiceSpy },
        { provide: SituacaoPedidoProcedimentoService, useValue: situacaoPedidoProcedimentoServiceSpy },
        { provide: ProcedimentoService, useValue: procedimentoServiceSpy },
        { provide: ProcedimentoPedidoService, useValue: procedimentoPedidoServiceSpy },
        { provide: AutorizacaoPreviaService, useValue: autorizacaoPreviaServiceSpy },
      ]
    }).compileComponents();
    });

  beforeEach(() => {
    fixture = TestBed.createComponent(AscFormularioReembolsoConsultaComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve construir formulario', () =>{
    const formulario = component.construirFormulario();
    expect(formulario).toBeTruthy();
  });

});