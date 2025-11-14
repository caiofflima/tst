import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutorizacaoPreviaService, BeneficiarioService, CaraterSolicitacaoService, ComboService, DocumentoPedidoService, DocumentoService, EmpresaPrestadorExternoService, MessageService, MotivoNegacaoService, MotivoSolicitacaoService, PatologiaService, PrazoTratamentoService, PrestadorExternoService, ProcedimentoPedidoService, ProcedimentoService, ProcessoService, SessaoService, SIASCFluxoService, SituacaoProcessoService, TipoBeneficiarioService, TipoOcorrenciaService, TipoProcessoService } from 'app/shared/services/services';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { TipoDocumentoService } from 'app/shared/services/comum/tipo-documento.service';
import { Data } from 'app/shared/providers/data';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CampoVazioHifen } from 'app/shared/pipes/campo-vazio.pipe';
import { PaginaInicialAprComponent } from './pagina-inicial-apr.component';

describe('PaginaInicialAprComponent', () => {
  let component: PaginaInicialAprComponent;
  let fixture: ComponentFixture<PaginaInicialAprComponent>;
  const messageServiceSpy = { getDescription: jest.fn(), fromResourceBundle: jest.fn() };
  const empresaPrestadorExternoServiceSpy = { consultarPorFiltro: jest.fn(), consultarFiliais: jest.fn(), buscarEmpresas: jest.fn() };
  const activatedRouteSpy = { getDescription: jest.fn() };
  const routerSpy = { getDescription: jest.fn() };
  const locationSpy = { getDescription: jest.fn() };
  const comboServiceSpy = { consultarComboTiposAuditor: jest.fn(), consultarComboPerfisPrestadoresExternos: jest.fn() };
  const tipoDocumentoServiceSpy = { consultarTodos: jest.fn() };
  const documentoServiceSpy = { get: jest.fn() };
  const prazoTratamentoServiceSpy = { consultarPorFiltro: jest.fn() };
  const tipoBeneficiarioServiceSpy = jasmine.createSpyObj('DocumentoServ   ice',['get']);
  const situacaoProcessoServiceSpy = { consultarTodasTransicoesManuais: jest.fn() };
  const patologiaServiceSpy = { consultarDTOPorId: jest.fn() };
  const tipoProcessoServiceSpy = { get: jest.fn() };
  const sessaoServiceSpy = { get: jest.fn() };
  const prestadorExternoServiceSpy = { consultarPorFiltro: jest.fn(), consultarUsuarioExternoPorFiltro: jest.fn() };
  const processoServiceSpy = { get: jest.fn() };
  const sIASCFluxoServiceSpy = { get: jest.fn() };
  const autorizacaoPreviaServiceSpy = { get: jest.fn() };

  empresaPrestadorExternoServiceSpy.buscarEmpresas.mockReturnValue(of({}));
  prestadorExternoServiceSpy.consultarPorFiltro.mockReturnValue(of({}));
  prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro = of({})

  comboServiceSpy.consultarComboPerfisPrestadoresExternos.mockReturnValue(of({}));
  comboServiceSpy.consultarComboTiposAuditor.mockReturnValue(of({}));
  tipoDocumentoServiceSpy.consultarTodos.mockReturnValue(of({}));
  documentoServiceSpy.get.mockReturnValue(of({}));
  prazoTratamentoServiceSpy.consultarPorFiltro.mockReturnValue(of({}));
  situacaoProcessoServiceSpy.consultarTodasTransicoesManuais.mockReturnValue(of({}));
  patologiaServiceSpy.consultarDTOPorId.mockReturnValue(of({}));

  activatedRouteSpy.snapshot = {
    params:{
        id: 1
    },
    queryParams:{

    }
  }
 
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[
        FormsModule,  
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      declarations: [PaginaInicialAprComponent,
        CampoVazioHifen
      ],
      providers: [
        FormBuilder,
        Data,
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: EmpresaPrestadorExternoService, useValue: empresaPrestadorExternoServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy },
        { provide: ComboService, useValue: comboServiceSpy },
        { provide: TipoDocumentoService, useValue: tipoDocumentoServiceSpy },
        { provide: DocumentoService, useValue: documentoServiceSpy },
        { provide: PrazoTratamentoService, useValue: prazoTratamentoServiceSpy },
        { provide: TipoBeneficiarioService, useValue: tipoBeneficiarioServiceSpy },
        { provide: SituacaoProcessoService, useValue: situacaoProcessoServiceSpy },
        { provide: PatologiaService, useValue: patologiaServiceSpy },
        { provide: TipoProcessoService, useValue: tipoProcessoServiceSpy },
        { provide: SessaoService, useValue: sessaoServiceSpy },
        { provide: PrestadorExternoService, useValue: prestadorExternoServiceSpy },
        { provide: ProcessoService, useValue: processoServiceSpy },
        { provide: SIASCFluxoService, useValue: sIASCFluxoServiceSpy },
        { provide: AutorizacaoPreviaService, useValue: autorizacaoPreviaServiceSpy },
        { provide: ProcedimentoService, useValue: autorizacaoPreviaServiceSpy },
        { provide: CaraterSolicitacaoService, useValue: autorizacaoPreviaServiceSpy },
        { provide: MotivoSolicitacaoService, useValue: autorizacaoPreviaServiceSpy },
        { provide: MotivoNegacaoService, useValue: autorizacaoPreviaServiceSpy },
        { provide: TipoOcorrenciaService, useValue: autorizacaoPreviaServiceSpy },
        { provide: ProcedimentoPedidoService, useValue: autorizacaoPreviaServiceSpy },
        { provide: BeneficiarioService, useValue: autorizacaoPreviaServiceSpy },
      ],
      schemas: [
          CUSTOM_ELEMENTS_SCHEMA
      ]
    }).compileComponents();
    });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginaInicialAprComponent);

    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});