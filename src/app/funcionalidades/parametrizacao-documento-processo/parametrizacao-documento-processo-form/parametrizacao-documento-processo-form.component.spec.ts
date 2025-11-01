import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutorizacaoPreviaService, BeneficiarioService, CaraterSolicitacaoService, ComboService, DocumentoPedidoService, DocumentoService, DocumentoTipoProcessoService, EmpresaPrestadorExternoService, MessageService, PrestadorExternoService, TipoBeneficiarioService, TipoDeficienciaService } from 'app/shared/services/services';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { MeusDadosService } from 'app/shared/services/meus-dados/meus-dados.service';
import { AtendimentoService } from 'app/shared/services/comum/atendimento.service';
import { Data } from 'app/shared/providers/data';
import { ParametrizacaoDocumentoProcessoFormComponent } from './parametrizacao-documento-processo-form.component';
import { GrupoDocumentoService } from 'app/shared/services/comum/grupo-documento.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ParametrizacaoDocumentoProcessoFormComponent', () => {
  let component: ParametrizacaoDocumentoProcessoFormComponent;
  let fixture: ComponentFixture<ParametrizacaoDocumentoProcessoFormComponent>;
  const messageServiceSpy = jasmine.createSpyObj('MessageService',['fromResourceBundle']);
  const empresaPrestadorExternoServiceSpy = jasmine.createSpyObj('EmpresaPrestadorExternoService',['consultarEmpresaPorId', 'consultarFiliais']);
  const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute',['getDescription']);
  const routerSpy = jasmine.createSpyObj('Router',['getDescription']);
  const locationSpy = jasmine.createSpyObj('Location',['getDescription']);
  const meusDadosServiceSpy = jasmine.createSpyObj('ComboService',['carregarTitular']);
  const documentoServiceSpy = jasmine.createSpyObj('DocumentoService',['get']);
  const tipoDeficienciaServiceSpy = jasmine.createSpyObj('TipoDeficienciaService',['consultarTodos']);
  const grupoDocumentoServiceSpy = jasmine.createSpyObj('GrupoDocumentoService',['consultarTodos']);
  const caraterSolicitacaoServiceSpy = jasmine.createSpyObj('CaraterSolicitacaoService',['consultarTodos']);
  const prestadorExternoServiceSpy = jasmine.createSpyObj('PrestadorExternoService',['get','consultarUsuarioExternoPorFiltro']);
  prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro = of({})
  empresaPrestadorExternoServiceSpy.consultarFiliais.and.returnValue(of({}));
  meusDadosServiceSpy.carregarTitular.and.returnValue(of({}));
  documentoServiceSpy.get.and.returnValue(of({}))
  tipoDeficienciaServiceSpy.consultarTodos.and.returnValue(of({}))
  grupoDocumentoServiceSpy.consultarTodos.and.returnValue(of({}))
  caraterSolicitacaoServiceSpy.consultarTodos.and.returnValue(of({}))

  activatedRouteSpy.snapshot = {
    params: {
      id: null
    }
  }
 
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[
        FormsModule,  
        ReactiveFormsModule
      ],
      declarations: [ParametrizacaoDocumentoProcessoFormComponent],
      providers: [
        FormBuilder,
        Data,
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: EmpresaPrestadorExternoService, useValue: empresaPrestadorExternoServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy },
        { provide: MeusDadosService, useValue: meusDadosServiceSpy },
        { provide: AtendimentoService, useValue: meusDadosServiceSpy },
        { provide: BeneficiarioService, useValue: meusDadosServiceSpy },
        { provide: AutorizacaoPreviaService, useValue: meusDadosServiceSpy },
        { provide: ComboService, useValue: meusDadosServiceSpy },
        { provide: DocumentoService, useValue: documentoServiceSpy },
        { provide: GrupoDocumentoService, useValue: grupoDocumentoServiceSpy },
        { provide: TipoDeficienciaService, useValue: tipoDeficienciaServiceSpy },
        { provide: TipoBeneficiarioService, useValue: meusDadosServiceSpy },
        { provide: CaraterSolicitacaoService, useValue: caraterSolicitacaoServiceSpy },
  {provide: PrestadorExternoService, useValue: prestadorExternoServiceSpy },

        { provide: DocumentoTipoProcessoService, useValue: meusDadosServiceSpy },
      ],
      schemas: [
          CUSTOM_ELEMENTS_SCHEMA
      ]
    }).compileComponents();
    });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametrizacaoDocumentoProcessoFormComponent);

    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});