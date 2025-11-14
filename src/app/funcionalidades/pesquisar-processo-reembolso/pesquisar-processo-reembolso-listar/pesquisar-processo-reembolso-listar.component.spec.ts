import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComboService, DocumentoPedidoService, DocumentoService, EmpresaPrestadorExternoService, MessageService, PatologiaService, PrazoTratamentoService, PrestadorExternoService, ProcessoService, SessaoService, SituacaoProcessoService, TipoBeneficiarioService, TipoProcessoService } from 'app/shared/services/services';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { TipoDocumentoService } from 'app/shared/services/comum/tipo-documento.service';
import { Data } from 'app/shared/providers/data';
import { PesquisarProcessoReembolsoListarComponent } from './pesquisar-processo-reembolso-listar.component';

describe('PesquisarProcessoReembolsoListarComponent', () => {
  let component: PesquisarProcessoReembolsoListarComponent;
  let fixture: ComponentFixture<PesquisarProcessoReembolsoListarComponent>;
  const messageServiceSpy = { getDescription: jest.fn(), fromResourceBundle: jest.fn() };
  const empresaPrestadorExternoServiceSpy = { consultarEmpresaPorId: jest.fn(), consultarFiliais: jest.fn() };
  const activatedRouteSpy = { getDescription: jest.fn() };
  const routerSpy = { getDescription: jest.fn() };
  const locationSpy = { getDescription: jest.fn() };
  const comboServiceSpy = { consultarComboUF: jest.fn() };
  const tipoDocumentoServiceSpy = { consultarTodos: jest.fn() };
  const documentoServiceSpy = { get: jest.fn() };
  const prazoTratamentoServiceSpy = { consultarPorFiltro: jest.fn() };
  const tipoBeneficiarioServiceSpy = { get: jest.fn() };
  const situacaoProcessoServiceSpy = { consultarTodasTransicoesManuais: jest.fn() };
  const patologiaServiceSpy = { consultarDTOPorId: jest.fn() };
  const tipoProcessoServiceSpy = { get: jest.fn() };
  const sessaoServiceSpy = { get: jest.fn() };
  const prestadorExternoServiceSpy = { get: jest.fn(), consultarUsuarioExternoPorFiltro: jest.fn() };

  empresaPrestadorExternoServiceSpy.consultarFiliais.mockReturnValue(of({});
  prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro .mockReturnValue(of({});
  comboServiceSpy.consultarComboUF.mockReturnValue(of({});
  tipoDocumentoServiceSpy.consultarTodos.mockReturnValue(of({});
  documentoServiceSpy.get.mockReturnValue(of({});
  prazoTratamentoServiceSpy.consultarPorFiltro.mockReturnValue(of({});
  situacaoProcessoServiceSpy.consultarTodasTransicoesManuais.mockReturnValue(of({});
  patologiaServiceSpy.consultarDTOPorId.mockReturnValue(of({});
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
      declarations: [PesquisarProcessoReembolsoListarComponent],
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
        { provide: ProcessoService, useValue: prestadorExternoServiceSpy },
      ]
    }).compileComponents();
    });

  beforeEach(() => {
    fixture = TestBed.createComponent(PesquisarProcessoReembolsoListarComponent);

    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});