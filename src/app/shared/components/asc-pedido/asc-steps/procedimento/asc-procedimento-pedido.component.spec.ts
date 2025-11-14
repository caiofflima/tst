import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {Subject, of} from 'rxjs';
import { BeneficiarioService } from '../../../../services/comum/beneficiario.service';
import { MedicamentoPatologiaPedidoService } from '../../../../services/comum/medicamento-patologia-pedido.service';
import { AutorizacaoPreviaService } from '../../../../services/comum/pedido/autorizacao-previa.service';
import { ProcedimentoPedidoService } from '../../../../services/comum/procedimento-pedido.service';
import { ProcessoService } from '../../../../services/comum/processo.service';
import { MessageService } from '../../../messages/message.service';
import { ProcedimentoFormComponent } from '../procedimento-form/procedimento-form.component';
import { AscProcedimentoPedidoComponent } from './asc-procedimento-pedido.component';

describe('AscProcedimentoPedidoComponent', () => {
  let component: AscProcedimentoPedidoComponent;
  let fixture: ComponentFixture<AscProcedimentoPedidoComponent>;
  
  beforeEach(async () => {
    const mockAutorizacaoPreviaService = { incluirPedidoModoRascunho: jest.fn(), verificarAutorizacoesComDataAtentimentoValida: jest.fn() };
    const mockProcessoService = { consultarPedidoEmAbertoSemelhante: jest.fn(), consultarPedidosProcedimentoPorPedido: jest.fn(), consultarMedicamentoPatologiaPedidoPorPedido: jest.fn() };
    const mockMessageService = { showDangerMsg: jest.fn(), showSuccessMsg: jest.fn() };
    const mockProcedimentoPedidoService = { incluirOuAtualizarPedidoProcedimento: jest.fn(), consultarPedidosProcedimentoPorPedido: jest.fn() };
    const mockBeneficiarioService = {  };
    const mockMedicamentoPatologiaPedidoService = { incluir: jest.fn(), atualizar: jest.fn() };

    await TestBed.configureTestingModule({
      declarations: [ AscProcedimentoPedidoComponent, ProcedimentoFormComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        { provide: AutorizacaoPreviaService, useValue: mockAutorizacaoPreviaService },
        { provide: ProcessoService, useValue: mockProcessoService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: ProcedimentoPedidoService, useValue: mockProcedimentoPedidoService },
        { provide: BeneficiarioService, useValue: mockBeneficiarioService },
        { provide: MedicamentoPatologiaPedidoService, useValue: mockMedicamentoPatologiaPedidoService },
      ],
      schemas: [NO_ERRORS_SCHEMA] 
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AscProcedimentoPedidoComponent);
    component = fixture.componentInstance;
    component.pedido = {} as any;
    component.checkRestart = new Subject() 
    component.tipoProcesso = 'processo-teste';
    component.tituloStepProcedimento = 'Título do Passo';

    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
});
