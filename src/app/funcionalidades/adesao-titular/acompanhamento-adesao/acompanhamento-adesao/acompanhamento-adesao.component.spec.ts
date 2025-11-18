import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcompanhamentoAdesaoComponent } from './acompanhamento-adesao.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MedicamentoPatologiaPedidoService } from '../../../../shared/services/comum/medicamento-patologia-pedido.service';
import { PatologiaService } from '../../../../shared/services/comum/patologia.service';
import { MedicamentoService } from '../../../../shared/services/comum/pedido/medicamento.service';
import { ProcedimentoService } from '../../../../shared/services/comum/procedimento.service';
import { ProcessoService } from '../../../../shared/services/comum/processo.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'app/shared/components/messages/message.service';
import { DocumentoPedidoService, SIASCFluxoService } from 'app/shared/services/services';

describe('AcompanhamentoAdesaoComponent', () => {
  let component: AcompanhamentoAdesaoComponent;
  let fixture: ComponentFixture<AcompanhamentoAdesaoComponent>;

  // Mock services
  const messageServiceSpy = { /* add methods as needed */ };
  const activatedRouteSpy = { /* add methods as needed */ };
  const processoServiceSpy = { /* add methods as needed */ };
  const procedimentoServiceSpy = { /* add methods as needed */ };
  const medicamentoServiceSpy = { /* add methods as needed */ };
  const patologiaServiceSpy = { /* add methods as needed */ };
  const medicamentoPatologiaPedidoServiceSpy = { /* add methods as needed */ };
  const siascFluxoServiceSpy = { /* add methods as needed */ };
  const documentoPedidoServiceSpy = { /* add methods as needed */ };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AcompanhamentoAdesaoComponent],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: ProcessoService, useValue: processoServiceSpy },
        { provide: ProcedimentoService, useValue: procedimentoServiceSpy },
        { provide: MedicamentoService, useValue: medicamentoServiceSpy },
        { provide: PatologiaService, useValue: patologiaServiceSpy },
        { provide: MedicamentoPatologiaPedidoService, useValue: medicamentoPatologiaPedidoServiceSpy },
        { provide: SIASCFluxoService, useValue: siascFluxoServiceSpy },
        { provide: DocumentoPedidoService, useValue: documentoPedidoServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcompanhamentoAdesaoComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
});
