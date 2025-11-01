import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComboService, DocumentoPedidoService, DocumentoService, EmpresaPrestadorExternoService, MessageService, PatologiaService, PrazoTratamentoService, PrestadorExternoService, SessaoService, SituacaoProcessoService, TipoBeneficiarioService, TipoProcessoService } from 'app/shared/services/services';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { TipoDocumentoService } from 'app/shared/services/comum/tipo-documento.service';
import { Data } from 'app/shared/providers/data';
import { PesquisarProcessoReembolsoHomeComponent } from './pesquisar-processo-reembolso-home.component';

describe('PesquisarProcessoReembolsoHomeComponent', () => {
  let component: PesquisarProcessoReembolsoHomeComponent;
  let fixture: ComponentFixture<PesquisarProcessoReembolsoHomeComponent>;
  const messageServiceSpy = jasmine.createSpyObj('MessageService',['getDescription', 'fromResourceBundle']);
  const empresaPrestadorExternoServiceSpy = jasmine.createSpyObj('EmpresaPrestadorExternoService',['consultarEmpresaPorId', 'consultarFiliais']);
  const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute',['getDescription']);
  const routerSpy = jasmine.createSpyObj('Router',['getDescription']);
  const locationSpy = jasmine.createSpyObj('Location',['getDescription']);
  const comboServiceSpy = jasmine.createSpyObj('ComboService',['consultarComboUF']);
  const tipoDocumentoServiceSpy = jasmine.createSpyObj('TipoDocumentoService',['consultarTodos']);
  const documentoServiceSpy = jasmine.createSpyObj('DocumentoService',['get']);
  const prazoTratamentoServiceSpy = jasmine.createSpyObj('DocumentoService',['consultarPorFiltro']);
  const tipoBeneficiarioServiceSpy = jasmine.createSpyObj('DocumentoServ   ice',['get']);
  const situacaoProcessoServiceSpy = jasmine.createSpyObj('SituacaoProcessoService',['consultarTodasTransicoesManuais']);
  const patologiaServiceSpy = jasmine.createSpyObj('PatologiaService',['consultarDTOPorId']);
  const tipoProcessoServiceSpy = jasmine.createSpyObj('TipoProcessoService',['get']);
  const sessaoServiceSpy = jasmine.createSpyObj('SessaoService',['get']);
  const prestadorExternoServiceSpy = jasmine.createSpyObj('PrestadorExternoService',['get','consultarUsuarioExternoPorFiltro']);

  empresaPrestadorExternoServiceSpy.consultarFiliais.and.returnValue(of({}));
  prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro .and.returnValue(of({}));

  comboServiceSpy.consultarComboUF.and.returnValue(of({}));
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
        ReactiveFormsModule
      ],
      declarations: [PesquisarProcessoReembolsoHomeComponent],
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
      ]
    }).compileComponents();
    });

  beforeEach(() => {
    fixture = TestBed.createComponent(PesquisarProcessoReembolsoHomeComponent);

    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});