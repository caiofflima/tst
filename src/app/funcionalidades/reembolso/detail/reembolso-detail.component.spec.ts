import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReembolsoDetailComponent } from './reembolso-detail.component';
import { BeneficiarioService, MessageService, SessaoService } from 'app/shared/services/services';
import { ReembolsoSaudeCaixaService } from 'app/shared/services/comum/reembolso-saude-caixa.service';
import { ReembolsoAGSService } from 'app/shared/services/comum/reembolso-ags.service';
import { MensagemPedidoService } from 'app/shared/services/comum/mensagem-enviada.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ReembolsoDetailComponent', () => {
  let component: ReembolsoDetailComponent;
  let fixture: ComponentFixture<ReembolsoDetailComponent>;

  const beneficiarioServiceSpy = { consultarPorMatricula: jest.fn() };
  beneficiarioServiceSpy.consultarPorMatricula.mockReturnValue(of({}));
  const messageServiceSpy = { getDescription: jest.fn(), addMsgDanger: jest.fn() };
  const sessaoServiceSpy = { getUsuario: jest.fn() };
  const reembolsoSaudeCaixaServiceSpy = { getCoparticipacoes: jest.fn() };
  reembolsoSaudeCaixaServiceSpy.getCoparticipacoes.mockReturnValue(of([]));
  const reembolsoAGSServiceSpy = { getLancamentosDoAnoPorCPF: jest.fn() };
  reembolsoAGSServiceSpy.getLancamentosDoAnoPorCPF.mockReturnValue(of([]));
  const mensagemPedidoServiceSpy = { consultarMensagensEnviadas: jest.fn() };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReembolsoDetailComponent],
      providers: [
        { provide: BeneficiarioService, useValue: beneficiarioServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: SessaoService, useValue: sessaoServiceSpy },
        { provide: ReembolsoSaudeCaixaService, useValue: reembolsoSaudeCaixaServiceSpy },
        { provide: ReembolsoAGSService, useValue: reembolsoAGSServiceSpy },
        { provide: MensagemPedidoService, useValue: mensagemPedidoServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReembolsoDetailComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
});
