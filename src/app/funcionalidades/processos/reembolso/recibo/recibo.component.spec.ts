import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutorizacaoPreviaService, BeneficiarioService, CaraterSolicitacaoService, ComboService, DocumentoPedidoService, DocumentoService, EmpresaPrestadorExternoService, FileUploadService, InscricaoProgramasMedicamentosService, LocalidadeService, MessageService, MotivoNegacaoService, MotivoSolicitacaoService, PatologiaService, PrazoTratamentoService, PrestadorExternoService, ProcedimentoPedidoService, ProcedimentoService, ProcessoService, SessaoService, SIASCFluxoService, SituacaoPedidoProcedimentoService, SituacaoProcessoService, TipoBeneficiarioService, TipoOcorrenciaService, TipoProcessoService } from 'app/shared/services/services';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { TipoDocumentoService } from 'app/shared/services/comum/tipo-documento.service';
import { Data } from 'app/shared/providers/data';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CampoVazioHifen } from 'app/shared/pipes/campo-vazio.pipe';
import { Usuario } from 'app/shared/models/entidades';
import { EstruturaProcedimentoPipe } from 'app/shared/pipes/estrutura-procedimento.pipe';
import { MedicamentoService } from 'app/shared/services/comum/pedido/medicamento.service';
import { MedicamentoPatologiaPedidoService } from 'app/shared/services/comum/medicamento-patologia-pedido.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReciboComponent } from './recibo.component';

describe('ReciboComponent', () => {
  let component: ReciboComponent;
  let fixture: ComponentFixture<ReciboComponent>;
  const messageServiceSpy = { getDescription: jest.fn(), fromResourceBundle: jest.fn() };
  const empresaPrestadorExternoServiceSpy = { consultarPorFiltro: jest.fn(), consultarFiliais: jest.fn(), buscarEmpresas: jest.fn() };
  const activatedRouteSpy = { getDescription: jest.fn() };
  const routerSpy = { getDescription: jest.fn() };
  const locationSpy = { getDescription: jest.fn() };
  const comboServiceSpy = { consultarComboTiposAuditor: jest.fn(), consultarComboPerfisPrestadoresExternos: jest.fn() };
  const tipoDocumentoServiceSpy = { consultarTodos: jest.fn() };
  const documentoServiceSpy = { get: jest.fn() };
  const prazoTratamentoServiceSpy = { consultarPorFiltro: jest.fn() };
  const tipoBeneficiarioServiceSpy = { get: jest.fn() };
  const situacaoProcessoServiceSpy = { consultarTodasTransicoesManuais: jest.fn() };
  const patologiaServiceSpy = { consultarDTOPorId: jest.fn() };
  const tipoProcessoServiceSpy = { get: jest.fn() };
  const sessaoServiceSpy = { get: jest.fn() };
  const prestadorExternoServiceSpy = { consultarPorFiltro: jest.fn(), consultarUsuarioExternoPorFiltro: jest.fn() };
  const processoServiceSpy = { get: jest.fn() };
  const sIASCFluxoServiceSpy = { consultarPermissoesFluxoPorPedido: jest.fn() };
  const autorizacaoPreviaServiceSpy = { get: jest.fn() };
  const procedimentoServiceeSpy = { get: jest.fn() };
  const caraterSolicitacaoServiceSpy = { get: jest.fn() };
  const motivoNegacaoServiceSpy = { get: jest.fn() };
  const tipoOcorrenciaServiceSpy = { get: jest.fn() };
  const procedimentoPedidoServiceSpy = { get: jest.fn() };
  const beneficiarioServiceSpy = { get: jest.fn() };
  const fileUploadServiceSpy = { get: jest.fn() };
  const motivoSolicitacaoServiceSpy = { get: jest.fn() };
  const situacaoPedidoProcedimentoServiceSpy = { get: jest.fn() };
  const medicamentoServiceSpy = { get: jest.fn() };
  const medicamentoPatologiaPedidoServiceSpy = { get: jest.fn() };
  const documentoPedidoServiceSpy = { get: jest.fn() };

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
  sIASCFluxoServiceSpy.consultarPermissoesFluxoPorPedido.mockReturnValue(of({}));
  sIASCFluxoServiceSpy.consultarPermissoesFluxoPorPedido.mockReturnValue(of({}));

  documentoPedidoServiceSpy.avisoSituacaoPedido = of({});

  activatedRouteSpy.snapshot = {
    params:{
        id: 1
    },
    queryParams:{

    }
  }

  activatedRouteSpy.paramMap = of({});

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[
        FormsModule,  
        ReactiveFormsModule,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      declarations: [ReciboComponent,
        CampoVazioHifen,
        EstruturaProcedimentoPipe,
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
        { provide: ProcedimentoService, useValue: procedimentoServiceeSpy },
        { provide: CaraterSolicitacaoService, useValue: caraterSolicitacaoServiceSpy },
        { provide: MotivoSolicitacaoService, useValue: motivoSolicitacaoServiceSpy },
        { provide: MotivoNegacaoService, useValue: motivoNegacaoServiceSpy },
        { provide: TipoOcorrenciaService, useValue: tipoOcorrenciaServiceSpy },
        { provide: ProcedimentoPedidoService, useValue: procedimentoPedidoServiceSpy },
        { provide: BeneficiarioService, useValue: beneficiarioServiceSpy },
        { provide: FileUploadService, useValue: fileUploadServiceSpy },
        { provide: SituacaoPedidoProcedimentoService, useValue: situacaoPedidoProcedimentoServiceSpy },
        { provide: MedicamentoService, useValue: medicamentoServiceSpy },
        { provide: MedicamentoPatologiaPedidoService, useValue: medicamentoPatologiaPedidoServiceSpy },
        { provide: DocumentoPedidoService, useValue: documentoPedidoServiceSpy },
        { provide: InscricaoProgramasMedicamentosService, useValue: documentoPedidoServiceSpy },
        { provide: LocalidadeService, useValue: documentoPedidoServiceSpy },
      ],
      schemas: [
          CUSTOM_ELEMENTS_SCHEMA
      ]
    }).compileComponents();
    });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReciboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});