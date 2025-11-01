import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutorizacaoPreviaService, BeneficiarioService, CaraterSolicitacaoService, ComboService, DocumentoPedidoService, DocumentoService, EmpresaPrestadorExternoService, FileUploadService, MessageService, MotivoNegacaoService, MotivoSolicitacaoService, PatologiaService, PrazoTratamentoService, PrestadorExternoService, ProcedimentoPedidoService, ProcedimentoService, ProcessoService, SessaoService, SIASCFluxoService, SituacaoProcessoService, TipoBeneficiarioService, TipoOcorrenciaService, TipoProcessoService } from 'app/shared/services/services';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { TipoDocumentoService } from 'app/shared/services/comum/tipo-documento.service';
import { Data } from 'app/shared/providers/data';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CampoVazioHifen } from 'app/shared/pipes/campo-vazio.pipe';
import { ResumoComponent } from './resumo.component';

describe('ResumoComponent', () => {
  let component: ResumoComponent;
  let fixture: ComponentFixture<ResumoComponent>;
  const messageServiceSpy = jasmine.createSpyObj('MessageService',['getDescription', 'fromResourceBundle']);
  const empresaPrestadorExternoServiceSpy = jasmine.createSpyObj('EmpresaPrestadorExternoService',['consultarPorFiltro', 'consultarFiliais','buscarEmpresas']);
  const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute',['getDescription']);
  const routerSpy = jasmine.createSpyObj('Router',['getDescription']);
  const locationSpy = jasmine.createSpyObj('Location',['getDescription']);
  const comboServiceSpy = jasmine.createSpyObj('ComboService',['consultarComboTiposAuditor','consultarComboPerfisPrestadoresExternos']);
  const tipoDocumentoServiceSpy = jasmine.createSpyObj('TipoDocumentoService',['consultarTodos']);
  const documentoServiceSpy = jasmine.createSpyObj('DocumentoService',['get']);
  const prazoTratamentoServiceSpy = jasmine.createSpyObj('DocumentoService',['consultarPorFiltro']);
  const tipoBeneficiarioServiceSpy = jasmine.createSpyObj('DocumentoServ   ice',['get']);
  const situacaoProcessoServiceSpy = jasmine.createSpyObj('SituacaoProcessoService',['consultarTodasTransicoesManuais']);
  const patologiaServiceSpy = jasmine.createSpyObj('PatologiaService',['consultarDTOPorId']);
  const tipoProcessoServiceSpy = jasmine.createSpyObj('TipoProcessoService',['get']);
  const sessaoServiceSpy = jasmine.createSpyObj('SessaoService',['get']);
  const prestadorExternoServiceSpy = jasmine.createSpyObj('PrestadorExternoService',['consultarPorFiltro','consultarUsuarioExternoPorFiltro']);
  const processoServiceSpy = jasmine.createSpyObj('ProcessoService',['get']);
  const sIASCFluxoServiceSpy = jasmine.createSpyObj('SIASCFluxoService',['get']);
  const autorizacaoPreviaServiceSpy = jasmine.createSpyObj('AutorizacaoPreviaService',['get']);
  const procedimentoServiceeSpy = jasmine.createSpyObj('ProcedimentoService',['get']);
  const caraterSolicitacaoServiceSpy = jasmine.createSpyObj('CaraterSolicitacaoService',['get']);
  const motivoNegacaoServiceSpy = jasmine.createSpyObj('MotivoNegacaoService',['get']);
  const tipoOcorrenciaServiceSpy = jasmine.createSpyObj('TipoOcorrenciaService',['get']);
  const procedimentoPedidoServiceSpy = jasmine.createSpyObj('ProcedimentoPedidoService',['get']);
  const beneficiarioServiceSpy = jasmine.createSpyObj('BeneficiarioService',['get']);
  const fileUploadServiceSpy = jasmine.createSpyObj('FileUploadService',['get']);
  const motivoSolicitacaoServiceSpy = jasmine.createSpyObj('MotivoSolicitacaoService',['get']);

  empresaPrestadorExternoServiceSpy.buscarEmpresas.and.returnValue(of({}));
  prestadorExternoServiceSpy.consultarPorFiltro.and.returnValue(of({}));
  prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro = of({})

  comboServiceSpy.consultarComboPerfisPrestadoresExternos.and.returnValue(of({}));
  comboServiceSpy.consultarComboTiposAuditor.and.returnValue(of({}));
  tipoDocumentoServiceSpy.consultarTodos.and.returnValue(of({}));
  documentoServiceSpy.get.and.returnValue(of({}));
  prazoTratamentoServiceSpy.consultarPorFiltro.and.returnValue(of({}));
  situacaoProcessoServiceSpy.consultarTodasTransicoesManuais.and.returnValue(of({}));
  patologiaServiceSpy.consultarDTOPorId.and.returnValue(of({}));

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
      declarations: [ResumoComponent,
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
        { provide: ProcedimentoService, useValue: procedimentoServiceeSpy },
        { provide: CaraterSolicitacaoService, useValue: caraterSolicitacaoServiceSpy },
        { provide: MotivoSolicitacaoService, useValue: motivoSolicitacaoServiceSpy },
        { provide: MotivoNegacaoService, useValue: motivoNegacaoServiceSpy },
        { provide: TipoOcorrenciaService, useValue: tipoOcorrenciaServiceSpy },
        { provide: ProcedimentoPedidoService, useValue: procedimentoPedidoServiceSpy },
        { provide: BeneficiarioService, useValue: beneficiarioServiceSpy },
        { provide: FileUploadService, useValue: fileUploadServiceSpy },
      ],
      schemas: [
          CUSTOM_ELEMENTS_SCHEMA
      ]
    }).compileComponents();
    });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumoComponent);

    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});