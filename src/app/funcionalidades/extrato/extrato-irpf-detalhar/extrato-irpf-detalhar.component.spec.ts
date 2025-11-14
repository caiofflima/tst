import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ReembolsoSaudeCaixaService } from 'app/shared/services/comum/reembolso-saude-caixa.service';
import { BeneficiarioPedidoService, BeneficiarioService, SessaoService } from 'app/shared/services/services';
import { of, throwError } from 'rxjs';
import { MessageService } from '../../../shared/components/messages/message.service';
import { ExtratoIRPFDetalharComponent } from './extrato-irpf-detalhar.component';
import { ReembolsoAGSService } from 'app/shared/services/comum/reembolso-ags.service';
import { AtendimentoService } from 'app/shared/services/comum/atendimento.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ExtratoIRPFDetalharComponent', () => {
  let component: ExtratoIRPFDetalharComponent;
  let fixture: ComponentFixture<ExtratoIRPFDetalharComponent>;
  let mockMessageService: any;
  let mockActivatedRoute: any;
  let mockRouter: any;
  let mockLocation: any;
  let mockBeneficiarioPedidoService: any;
  let mockReembolsoSaudeCaixaService: any;

  beforeEach(async () => {
    const sessaoServiceSpy = { getUsuario: jest.fn() };
    const beneficiarioServiceSpy = { consultarPorMatricula: jest.fn() };
    beneficiarioServiceSpy.consultarPorMatricula.and.returnValue(of());
    const reembolsoAGSServiceSpy = { getLancamentosDoAnoPorCPF: jest.fn() };
    const atendimentoServiceSpy = { get: jest.fn() };
    
    mockMessageService = {
      addMsgDanger: jasmine.createSpy('addMsgDanger'),
      showDangerMsg: jasmine.createSpy('showDangerMsg'),
      showWarningMsg: jasmine.createSpy('showWarningMsg')
    };

    mockActivatedRoute = {
      snapshot: {
        queryParams: {
          anoBase: '2022',
          mtr: '12345678900'
        }
      }
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    mockLocation = {
      back: jasmine.createSpy('back')
    };

    mockReembolsoSaudeCaixaService = {
      getComprovanteIRPFPorCPF: jasmine.createSpy('getComprovanteIRPFPorCPF').and.returnValue(of({}))
    };

    await TestBed.configureTestingModule({
      declarations: [ExtratoIRPFDetalharComponent],
      providers: [
        { provide: MessageService, useValue: mockMessageService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: Location, useValue: mockLocation },
        { provide: BeneficiarioPedidoService, useValue: mockBeneficiarioPedidoService },
        { provide: ReembolsoSaudeCaixaService, useValue: mockReembolsoSaudeCaixaService },
        { provide: SessaoService, useValue: sessaoServiceSpy },
        { provide: BeneficiarioService, useValue: beneficiarioServiceSpy },
        { provide: ReembolsoAGSService, useValue: reembolsoAGSServiceSpy },
        { provide: AtendimentoService, useValue: atendimentoServiceSpy }
      ],
      schemas: [
          CUSTOM_ELEMENTS_SCHEMA
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtratoIRPFDetalharComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Inicializa o componente
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy(); // Verifica se o componente foi criado
  });

  it('deve inicializar corretamente os parâmetros do componente', () => {
    expect(component.anoBase).toBe(2022); // Verifica se o ano base foi inicializado corretamente
    expect(component.matricula).toBe('12345678900'); // Verifica se a matrícula foi inicializada corretamente
  });

  it('deve chamar carregarBeneficiario no ngOnInit', () => {
    spyOn(component, 'carregarBeneficiario').and.callThrough(); // Espiona o método
    component.ngOnInit(); // Chama ngOnInit
    expect(component.carregarBeneficiario).toHaveBeenCalledWith('12345678900'); // Verifica se o método foi chamado com a matrícula correta
  });

  it('deve chamar o método de reembolso corretamente', () => {
    const mockDados = { /* mock de dados que devem ser passados para o método */ };
    component.extrairReembolsos(mockDados); // Chama o método extrairReembolsos
  });

});