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
  const messageServiceSpy = { fromResourceBundle: jest.fn() };
  const empresaPrestadorExternoServiceSpy = { consultarEmpresaPorId: jest.fn(), consultarFiliais: jest.fn() };
  const activatedRouteSpy = { getDescription: jest.fn() };
  const routerSpy = { getDescription: jest.fn() };
  const locationSpy = { getDescription: jest.fn() };
  const meusDadosServiceSpy = { carregarTitular: jest.fn() };
  const documentoServiceSpy = { get: jest.fn() };
  const tipoDeficienciaServiceSpy = { consultarTodos: jest.fn() };
  const grupoDocumentoServiceSpy = { consultarTodos: jest.fn() };
  const caraterSolicitacaoServiceSpy = { consultarTodos: jest.fn() };
  const prestadorExternoServiceSpy = { get: jest.fn(), consultarUsuarioExternoPorFiltro: jest.fn() };
  prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro.mockReturnValue(of({})
  empresaPrestadorExternoServiceSpy.consultarFiliais.mockReturnValue(of({})));
  meusDadosServiceSpy.carregarTitular.mockReturnValue(of({});
  documentoServiceSpy.get.mockReturnValue(of({}))
  tipoDeficienciaServiceSpy.consultarTodos.mockReturnValue(of({}))
  grupoDocumentoServiceSpy.consultarTodos.mockReturnValue(of({}))
  caraterSolicitacaoServiceSpy.consultarTodos.mockReturnValue(of({}))

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