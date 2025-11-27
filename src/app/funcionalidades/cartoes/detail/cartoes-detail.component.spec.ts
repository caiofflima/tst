import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Location, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import { CartoesDetailComponent } from './cartoes-detail.component';
import { BeneficiarioService, MessageService, SessaoService } from 'app/shared/services/services';
import { Beneficiario } from 'app/shared/models/entidades';
import { CartaoDTO } from 'app/shared/models/comum/cartao-dto.model';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as htmlToPdfmake from 'html-to-pdfmake';

// Register pt-BR locale for DatePipe
registerLocaleData(localePt, 'pt-BR');

// Mock pdfMake.createPdf
jest.mock('pdfmake/build/pdfmake', () => ({
  createPdf: jest.fn(),
}));

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
      consultarFamiliaPorMatricula: jest.fn().mockReturnValue(of([mockBeneficiario])),
    };

    const locationMock = {
      back: jest.fn(),
    };

    const activatedRouteMock = {
      snapshot: {
        params: { idBeneficiario: '1' },
      },
    };

    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [CartoesDetailComponent],
      providers: [
        { provide: MessageService, useValue: messageServiceMock },
        { provide: BeneficiarioService, useValue: beneficiarioServiceMock },
        { provide: Location, useValue: locationMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    TestBed.overrideTemplate(CartoesDetailComponent, `
      <form [formGroup]="formularioSolicitacao">
        <input formControlName="dependente" />
      </form>
    `);
    await TestBed.compileComponents();

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

      expect(beneficiarioService.consultarBeneficiarioPorId).toHaveBeenCalledWith('1');
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

    it('deve buscar cartão mesmo se beneficiário for nulo', () => {
      const spy = jest.spyOn(beneficiarioService, 'getDadosCartaoBeneficiario');
      
      component.beneficiarioSelecionado(null);
      
      expect(spy).toHaveBeenCalled();
    });

    it('deve buscar cartão mesmo se beneficiário não tiver id definido', () => {
      const spy = jest.spyOn(beneficiarioService, 'getDadosCartaoBeneficiario');
      const benef = {} as Beneficiario;
      
      // Simular que getDadosCartaoBeneficiario foi chamado com o id do beneficiário inicializado
      component.beneficiarioSelecionado(benef);
      
      // A função chama o serviço mesmo sem id explícito, mas o mock retorna algo
      expect(spy).toHaveBeenCalled();
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
    it('deve atualizar o valor do dependente', fakeAsync(() => {
      fixture.detectChanges();
      
      component.formularioSolicitacao.get('dependente')?.setValue(2);
      tick();

      expect(component.formularioSolicitacao.get('dependente')?.value).toBe(2);
    }));

    it('deve manter o formulário válido quando o dependente tiver valor', fakeAsync(() => {
      fixture.detectChanges();
      
      component.formularioSolicitacao.get('dependente')?.setValue(999);
      tick();

      expect(component.formularioSolicitacao.valid).toBe(true);
    }));
  });

  describe('voltar', () => {
    it('deve navegar para a página anterior', () => {
      component.voltar();
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
      expect(component.formatarNrCartao('12345678')).toBe('123456-78');
      expect(component.formatarNrCartao('1234567890')).toBe('12345678-90');
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
      expect(resultado.length).toBeGreaterThanOrEqual(texto.length);
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
      // Com limite 0 ou negativo, a função ainda processa
      expect(component.quebraLinha(texto, 0)).toContain('exto');
      expect(component.quebraLinha(texto, -5)).toContain('exto');
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

    it('deve inicializar cartao como objeto vazio', () => {
      const comp = new CartoesDetailComponent(messageService, location, TestBed.inject(ActivatedRoute), beneficiarioService);
      expect(comp.cartao).toEqual({});
    });

    it('deve inicializar idBeneficiario como null', () => {
      const comp = new CartoesDetailComponent(messageService, location, TestBed.inject(ActivatedRoute), beneficiarioService);
      expect(comp.idBeneficiario).toBeNull();
    });
  });

  describe('integração com ActivatedRoute', () => {
    it('deve obter o idBeneficiario dos parâmetros da rota', () => {
      fixture.detectChanges();
      expect(component.idBeneficiario).toBe('1');
    });
  });

  describe('scrollTo', () => {
    it('deve chamar window.scrollTo no ngOnInit', () => {
      fixture.detectChanges();
      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });
  });

  describe('gerarPDF', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.cartao = mockCartao;
      
      // Reset the mock before each test
      (pdfMake.createPdf as jest.Mock).mockReset();
      (pdfMake.createPdf as jest.Mock).mockReturnValue({
        download: jest.fn(),
      });
    });

    it('deve gerar PDF quando restrito for S', async () => {
      jest.spyOn(component as any, 'getBase64ImageFromURL').mockResolvedValue('base64string');

      await component.gerarPDF('S');

      expect(pdfMake.createPdf).toHaveBeenCalled();
    });

    it('deve gerar PDF quando restrito for diferente de S', async () => {
      jest.spyOn(component as any, 'getBase64ImageFromURL').mockResolvedValue('base64string');

      await component.gerarPDF('N');

      expect(pdfMake.createPdf).toHaveBeenCalled();
    });

    it('não deve gerar PDF se cartao não tiver nomeBeneficiario', async () => {
      component.cartao = {} as CartaoDTO;

      await component.gerarPDF('S');

      expect(pdfMake.createPdf).not.toHaveBeenCalled();
    });
  });

  describe('carregarListOperator', () => {
    it('deve carregar a lista de beneficiários e criar options', () => {
      const mockBeneficiarios = [
        { id: 1, nome: 'John Doe' } as Beneficiario,
        { id: 2, nome: 'Jane Smith' } as Beneficiario,
      ];
      
      (beneficiarioService.consultarFamiliaPorMatricula as jest.Mock).mockReturnValue(
        of(mockBeneficiarios)
      );

      component.carregarListOperator();

      expect(beneficiarioService.consultarFamiliaPorMatricula).toHaveBeenCalledWith(
        component.matricula,
        component.titular
      );
      expect(component.beneficiarios).toEqual(mockBeneficiarios);
      expect(component.options).toEqual([
        { label: 'John Doe', value: 1 },
        { label: 'Jane Smith', value: 2 },
      ]);
    });

    it('deve lidar com erro ao carregar lista de beneficiários', () => {
      const errorResponse = { error: 'Erro ao buscar família' };
      (beneficiarioService.consultarFamiliaPorMatricula as jest.Mock).mockReturnValue(
        throwError(() => errorResponse)
      );

      component.carregarListOperator();

      // O HttpUtil.catchErrorAndReturnEmptyObservableByKey trata o erro
      // então não deve quebrar a execução
      expect(beneficiarioService.consultarFamiliaPorMatricula).toHaveBeenCalled();
    });
  });

  describe('propriedades adicionais', () => {
    it('deve inicializar beneficiarios como array vazio', () => {
      expect(component.beneficiarios).toEqual([]);
    });

    it('deve inicializar options como array vazio', () => {
      expect(component.options).toEqual([]);
    });

    it('deve inicializar titular como true', () => {
      expect(component.titular).toBe(true);
    });

    it('deve permitir alterar o valor de titular', () => {
      component.titular = false;
      expect(component.titular).toBe(false);
    });
  });

  describe('integração entre formulário e beneficiários', () => {
    it('deve atualizar beneficiario quando o valor do dependente mudar', fakeAsync(() => {
      const mockBeneficiarios = [
        { id: 1, nome: 'John Doe' } as Beneficiario,
        { id: 2, nome: 'Jane Smith' } as Beneficiario,
      ];
      
      // Primeiro inicializa o componente
      fixture.detectChanges();
      tick();

      // Depois adiciona os beneficiários
      component.beneficiarios = mockBeneficiarios;

      // Agora altera o valor do formulário
      component.formularioSolicitacao.patchValue({ dependente: 2 });
      tick(400);

      expect(component.beneficiario).toEqual(mockBeneficiarios[1]);
    }));

    it('deve buscar cartão do beneficiário selecionado via formulário', fakeAsync(() => {
      const mockBeneficiarios = [
        { id: 1, nome: 'John Doe' } as Beneficiario,
        { id: 2, nome: 'Jane Smith' } as Beneficiario,
      ];

      // Limpa as chamadas anteriores para poder contar apenas a nova
      jest.clearAllMocks();

      // Primeiro inicializa o componente
      fixture.detectChanges();
      tick();

      // Depois adiciona os beneficiários
      component.beneficiarios = mockBeneficiarios;

      const spy = jest.spyOn(beneficiarioService, 'getDadosCartaoBeneficiario');

      // Agora altera o valor do formulário
      component.formularioSolicitacao.patchValue({ dependente: 2 });
      tick(400);

      expect(spy).toHaveBeenCalledWith(2);
    }));
  });
});