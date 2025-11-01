import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService, ProcedimentoPedidoService, ProcedimentoService, SessaoService, SituacaoPedidoProcedimentoService } from 'app/shared/services/services';
import { of } from 'rxjs';
import { AscProcedimentoAutorizacaoPreviaFormComponent } from './../asc-autorizacao-previa-components/procedimento-form/asc-procedimento-autorizacao-previa-form.component';

describe('AscProcedimentoAutorizacaoPreviaFormComponent', () => {
  let component: AscProcedimentoAutorizacaoPreviaFormComponent;
  let fixture: ComponentFixture<AscProcedimentoAutorizacaoPreviaFormComponent>;
  const messageServiceSpy = jasmine.createSpyObj('MessageService',['getDescription']);
  const situacaoPedidoProcedimentoServiceSpy = jasmine.createSpyObj('SituacaoPedidoProcedimentoService',['init']);
  const sessaoServiceSpy = jasmine.createSpyObj('SessaoService',['init']);
  const procedimentoServiceSpy = jasmine.createSpyObj('ProcedimentoService',['init']);
  const procedimentoPedidoServiceSpy = jasmine.createSpyObj('ProcedimentoPedidoService',['pedidoListenerValorNotaFiscal']);
  procedimentoPedidoServiceSpy.pedidoListenerValorNotaFiscal = of({valor: 1});


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