import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { CartoesDetailComponent } from './cartoes-detail.component';
import { BeneficiarioService, MessageService, SessaoService } from 'app/shared/services/services';
import { Beneficiario } from 'app/shared/models/entidades';
import { CartaoDTO } from 'app/shared/models/comum/cartao-dto.model';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as htmlToPdfmake from 'html-to-pdfmake';

Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });

describe('CartoesDetailComponent', () => {
  let component: CartoesDetailComponent;
  let fixture: ComponentFixture<CartoesDetailComponent>;
  let messageService: MessageService;
  let beneficiarioService: BeneficiarioService;
  let location: Location;

  const mockBeneficiario: Beneficiario = {
    id: 1,
    nome: 'John Doe',
  } as Beneficiario;

  const mockCartao: CartaoDTO = {
    nrCartao: '123456789',
    nomeBeneficiario: 'John Doe',
    dtValidade: new Date('2025-12-31'),
    dtNascimento: new Date('1990-01-01'),
    noTitular: 'Jane Doe',
    coBeneficiario: 'ABC123',
    dtAdesao: new Date('2020-01-01'),
    noContrato: 'Contrato X',
  } as CartaoDTO;

  beforeEach(async () => {
    const messageServiceMock = {
      addMsgDanger: jest.fn(),
      addMsgSuccess: jest.fn(),
      addMsgInfo: jest.fn(),
    };

    const beneficiarioServiceMock = {
      consultarBeneficiarioPorId: jest.fn().mockReturnValue(of(mockBeneficiario)),
      getDadosCartaoBeneficiario: jest.fn().mockReturnValue(of(mockCartao)),
    };

    const locationMock = {
      back: jest.fn(),
    };

    const activatedRouteMock = {
      snapshot: {
        params: { idBeneficiario: '1' },
      },
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [CartoesDetailComponent],
      providers: [
        { provide: MessageService, useValue: messageServiceMock },
        { provide: BeneficiarioService, useValue: beneficiarioServiceMock },
        { provide: Location, useValue: locationMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CartoesDetailComponent);
    component = fixture.componentInstance;
    messageService = TestBed.inject(MessageService);
    beneficiarioService = TestBed.inject(BeneficiarioService);
    location = TestBed.inject(Location);

    jest.spyOn(SessaoService, 'getMatriculaFuncional').mockReturnValue('C123456');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('deve carregar dados do beneficiário e do cartão com sucesso', () => {
      fixture.detectChanges();

      expect(beneficiarioService.consultarBeneficiarioPorId).toHaveBeenCalledWith(1);
      expect(component.beneficiario).toEqual(mockBeneficiario);
      expect(beneficiarioService.getDadosCartaoBeneficiario).toHaveBeenCalledWith(1);
      expect(component.cartao).toEqual(mockCartao);
      expect(component.formularioSolicitacao.get('dependente')?.value).toBe(1);
      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });

    it('deve exibir erro ao falhar na busca do beneficiário', () => {
      const errorResponse = { error: 'Erro ao buscar beneficiário' };
      (beneficiarioService.consultarBeneficiarioPorId as jest.Mock).mockReturnValue(
        throwError(() => errorResponse)
      );

      fixture.detectChanges();

      expect(messageService.addMsgDanger).toHaveBeenCalledWith(errorResponse.error);
    });

    it('deve exibir erro ao falhar na busca dos dados do cartão', () => {
      const errorResponse = { error: 'Erro ao buscar cartão' };
      (beneficiarioService.getDadosCartaoBeneficiario as jest.Mock).mockReturnValue(
        throwError(() => errorResponse)
      );

      fixture.detectChanges();

      expect(messageService.addMsgDanger).toHaveBeenCalledWith(errorResponse.error);
    });

    it('deve lidar com erro sem propriedade error', () => {
      (beneficiarioService.consultarBeneficiarioPorId as jest.Mock).mockReturnValue(
        throwError(() => ({}))
      );

      fixture.detectChanges();

      expect(messageService.addMsgDanger).toHaveBeenCalled();
    });
  });

  describe('beneficiarioSelecionado', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('deve buscar dados do cartão quando um beneficiário é selecionado', () => {
      component.beneficiarioSelecionado(mockBeneficiario);

      expect(beneficiarioService.getDadosCartaoBeneficiario).toHaveBeenCalledWith(mockBeneficiario.id);
      expect(component.cartao).toEqual(mockCartao);
      expect(component.beneficiario).toEqual(mockBeneficiario);
    });

    it('deve exibir erro ao falhar na busca dos dados do cartão', () => {
      const errorResponse = { error: 'Erro ao buscar cartão' };
      (beneficiarioService.getDadosCartaoBeneficiario as jest.Mock).mockReturnValue(
        throwError(() => errorResponse)
      );

      component.beneficiarioSelecionado(mockBeneficiario);

      expect(messageService.addMsgDanger).toHaveBeenCalledWith(errorResponse.error);
    });

    it('não deve fazer nada se o beneficiário for nulo', () => {
      const spy = jest.spyOn(beneficiarioService, 'getDadosCartaoBeneficiario');
      
      component.beneficiarioSelecionado(null);
      
      expect(spy).not.toHaveBeenCalled();
    });

    it('não deve fazer nada se o beneficiário não tiver id', () => {
      const spy = jest.spyOn(beneficiarioService, 'getDadosCartaoBeneficiario');
      
      component.beneficiarioSelecionado({} as Beneficiario);
      
      expect(spy).not.toHaveBeenCalled();
    });

    it('deve lidar com erro sem propriedade error ao buscar cartão', () => {
      (beneficiarioService.getDadosCartaoBeneficiario as jest.Mock).mockReturnValue(
        throwError(() => ({}))
      );

      component.beneficiarioSelecionado(mockBeneficiario);

      expect(messageService.addMsgDanger).toHaveBeenCalled();
    });
  });

  describe('formularioSolicitacao valueChanges', () => {
    it('deve chamar beneficiarioSelecionado quando o dependente mudar', fakeAsync(() => {
      const beneficiario2 = { id: 2, nome: 'Jane Doe' } as Beneficiario;
      component.beneficiarios = [mockBeneficiario, beneficiario2];
      
      fixture.detectChanges();
      
      const spy = jest.spyOn(component, 'beneficiarioSelecionado');
      
      component.formularioSolicitacao.get('dependente')?.setValue(2);
      tick();

      expect(spy).toHaveBeenCalledWith(beneficiario2);
    }));

    it('não deve chamar beneficiarioSelecionado se o beneficiário não for encontrado', fakeAsync(() => {
      component.beneficiarios = [mockBeneficiario];
      
      fixture.detectChanges();
      
      const spy = jest.spyOn(component, 'beneficiarioSelecionado');
      
      component.formularioSolicitacao.get('dependente')?.setValue(999);
      tick();

      expect(spy).not.toHaveBeenCalled();
    }));
  });

  describe('goBack', () => {
    it('deve navegar para a página anterior', () => {
      (component as any).goBack();
      expect(location.back).toHaveBeenCalled();
    });
  });

  describe('get matricula', () => {
    it('deve retornar a matrícula funcional da sessão', () => {
      expect(component.matricula).toBe('C123456');
      expect(SessaoService.getMatriculaFuncional).toHaveBeenCalled();
    });
  });

  describe('formatarNrCartao', () => {
    it('deve formatar o número do cartão corretamente', () => {
      expect(component.formatarNrCartao('123456')).toBe('1234-56');
      expect(component.formatarNrCartao('12345678')).toBe('1234-5678');
      expect(component.formatarNrCartao('1234567890')).toBe('1234-567890');
    });

    it('deve retornar o valor original se tiver menos de 4 caracteres', () => {
      expect(component.formatarNrCartao('123')).toBe('123');
      expect(component.formatarNrCartao('12')).toBe('12');
      expect(component.formatarNrCartao('1')).toBe('1');
    });

    it('deve retornar null se o valor for null ou undefined', () => {
      expect(component.formatarNrCartao(null)).toBeNull();
      expect(component.formatarNrCartao(undefined)).toBeUndefined();
    });

    it('deve retornar string vazia se o valor for string vazia', () => {
      expect(component.formatarNrCartao('')).toBe('');
    });
  });

  describe('quebraLinha', () => {
    it('deve quebrar linha no espaço mais próximo do limite', () => {
      const texto = 'Este é um texto longo para teste de quebra';
      const resultado = component.quebraLinha(texto, 15);
      
      expect(resultado).toContain('\n');
      expect(resultado.length).toBeGreaterThan(texto.length);
    });

    it('deve retornar o texto original se for menor que o limite', () => {
      const texto = 'Texto curto';
      const resultado = component.quebraLinha(texto, 20);
      
      expect(resultado).toBe(texto);
    });

    it('deve quebrar sem espaço se não houver espaço disponível', () => {
      const texto = 'TextoSemEspacoMuitoLongoParaTeste';
      const resultado = component.quebraLinha(texto, 10);
      
      expect(resultado).toContain('\n');
    });

    it('deve lidar com texto vazio', () => {
      expect(component.quebraLinha('', 10)).toBe('');
    });

    it('deve lidar com limite zero ou negativo', () => {
      const texto = 'Texto teste';
      expect(component.quebraLinha(texto, 0)).toBe(texto);
      expect(component.quebraLinha(texto, -5)).toBe(texto);
    });
  });

  describe('titular Input', () => {
    it('deve ter valor padrão true', () => {
      expect(component.titular).toBe(true);
    });

    it('deve aceitar valor false', () => {
      component.titular = false;
      expect(component.titular).toBe(false);
    });
  });

  describe('formularioSolicitacao', () => {
    it('deve ter o campo dependente como obrigatório', () => {
      const dependenteControl = component.formularioSolicitacao.get('dependente');
      
      expect(dependenteControl).toBeDefined();
      expect(dependenteControl?.hasError('required')).toBe(true);
      
      dependenteControl?.setValue(1);
      expect(dependenteControl?.hasError('required')).toBe(false);
    });

    it('deve ser inválido quando dependente for null', () => {
      expect(component.formularioSolicitacao.valid).toBe(false);
    });

    it('deve ser válido quando dependente tiver valor', () => {
      component.formularioSolicitacao.get('dependente')?.setValue(1);
      expect(component.formularioSolicitacao.valid).toBe(true);
    });
  });

  describe('propriedades do componente', () => {
    it('deve inicializar beneficiario como undefined', () => {
      const comp = new CartoesDetailComponent(messageService, location, TestBed.inject(ActivatedRoute), beneficiarioService);
      expect(comp.beneficiario).toBeUndefined();
    });

    it('deve inicializar beneficiarios como array vazio', () => {
      const comp = new CartoesDetailComponent(messageService, location, TestBed.inject(ActivatedRoute), beneficiarioService);
      expect(comp.beneficiarios).toEqual([]);
    });

    it('deve inicializar cartao como objeto vazio', () => {
      const comp = new CartoesDetailComponent(messageService, location, TestBed.inject(ActivatedRoute), beneficiarioService);
      expect(comp.cartao).toEqual({});
    });

    it('deve inicializar options como array vazio', () => {
      const comp = new CartoesDetailComponent(messageService, location, TestBed.inject(ActivatedRoute), beneficiarioService);
      expect(comp.options).toEqual([]);
    });

    it('deve inicializar idBeneficiario como null', () => {
      const comp = new CartoesDetailComponent(messageService, location, TestBed.inject(ActivatedRoute), beneficiarioService);
      expect(comp.idBeneficiario).toBeNull();
    });
  });

  describe('integração com ActivatedRoute', () => {
    it('deve obter o idBeneficiario dos parâmetros da rota', () => {
      fixture.detectChanges();
      expect(component.idBeneficiario).toBe(1);
    });
  });

  describe('scrollTo', () => {
    it('deve chamar window.scrollTo no ngOnInit', () => {
      fixture.detectChanges();
      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });
  });

  describe('gerarPDF', () => {
    it('deve chamar a geração de PDF', () => {
      const spyCreatePdf = jest.spyOn(pdfMake, 'createPdf').mockReturnValue({
        download: jest.fn(),
      } as any);

      (htmlToPdfmake as any) = jest.fn().mockReturnValue({});

      component.gerarPDF('titular');

      expect(spyCreatePdf).toHaveBeenCalled();
      expect(htmlToPdfmake).toHaveBeenCalled();
    });
  });
});