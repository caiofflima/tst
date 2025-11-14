import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'app/shared/components/messages/message.service';
import { MedicamentoPatologiaPedidoService } from 'app/shared/services/comum/medicamento-patologia-pedido.service';
import { PatologiaService } from 'app/shared/services/comum/patologia.service';
import { MedicamentoService } from 'app/shared/services/comum/pedido/medicamento.service';
import { ProcedimentoService } from 'app/shared/services/comum/procedimento.service';
import { ProcessoService } from 'app/shared/services/comum/processo.service';
import { DocumentoPedidoService, SIASCFluxoService } from 'app/shared/services/services';
import { of } from 'rxjs';
import { AcompanhamentoDependenteComponent } from './acompanhamento-dependente.component';

describe('AcompanhamentoDependenteComponent', () => {
  let component: AcompanhamentoDependenteComponent;
  let fixture: ComponentFixture<AcompanhamentoDependenteComponent>;

  const messageServiceSpy = { getDescription: jest.fn() };
  const activatedRouteSpy = { snapshot: jest.fn() };
  activatedRouteSpy.snapshot = {
    params: {
      id: null
    }
  }
  const processoServiceSpy = { getProcesso: jest.fn() };
  const patologiaServiceSpy = { getPatologia: jest.fn() };
  const procedimentoServiceSpy = { getProcedimento: jest.fn() };
  const medicamentoServiceSpy = { getMedicamento: jest.fn() };
  const medicamentoPatologiaPedidoServiceSpy = { getMedicamentoPatologiaPedido: jest.fn() };
  const siascFluxoServiceSpy = { getFluxo: jest.fn(), consultarPermissoesFluxoPorPedido: jest.fn() };
  siascFluxoServiceSpy.consultarPermissoesFluxoPorPedido.mockReturnValue(of({}));
  const documentoPedidoServiceSpy = { getDocumentoPedido: jest.fn() , avisoSituacaoPedido: jest.fn(), avisoSituacaoPedidoComplementares: jest.fn() };
  documentoPedidoServiceSpy.avisoSituacaoPedido.mockReturnValue(of({}));
  documentoPedidoServiceSpy.avisoSituacaoPedidoComplementares.mockReturnValue(of({}));
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AcompanhamentoDependenteComponent],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: ProcessoService, useValue: processoServiceSpy },
        { provide: PatologiaService, useValue: patologiaServiceSpy },
        { provide: ProcedimentoService, useValue: procedimentoServiceSpy },
        { provide: MedicamentoService, useValue: medicamentoServiceSpy },
        { provide: MedicamentoPatologiaPedidoService, useValue: medicamentoPatologiaPedidoServiceSpy },
        { provide: SIASCFluxoService, useValue: siascFluxoServiceSpy },
        { provide: DocumentoPedidoService, useValue: documentoPedidoServiceSpy },
      ],
      imports:[
        BrowserAnimationsModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcompanhamentoDependenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});
