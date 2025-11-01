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

  const messageServiceSpy = jasmine.createSpyObj('MessageService', ['getDescription']);
  const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['snapshot']);
  activatedRouteSpy.snapshot = {
    params: {
      id: null
    }
  }
  const processoServiceSpy = jasmine.createSpyObj('ProcessoService', ['getProcesso']);
  const patologiaServiceSpy = jasmine.createSpyObj('PatologiaService', ['getPatologia']);
  const procedimentoServiceSpy = jasmine.createSpyObj('ProcedimentoService', ['getProcedimento']);
  const medicamentoServiceSpy = jasmine.createSpyObj('MedicamentoService', ['getMedicamento']);
  const medicamentoPatologiaPedidoServiceSpy = jasmine.createSpyObj('MedicamentoPatologiaPedidoService', ['getMedicamentoPatologiaPedido']);
  const siascFluxoServiceSpy = jasmine.createSpyObj('SIASCFluxoService', ['getFluxo','consultarPermissoesFluxoPorPedido']);
  siascFluxoServiceSpy.consultarPermissoesFluxoPorPedido.and.returnValue(of({}))
  const documentoPedidoServiceSpy = jasmine.createSpyObj('DocumentoPedidoService', ['getDocumentoPedido']);
  documentoPedidoServiceSpy.avisoSituacaoPedido = of({});
  documentoPedidoServiceSpy.avisoSituacaoPedidoComplementares = of({});

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
