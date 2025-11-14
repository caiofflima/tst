import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComboService, DocumentoPedidoService, DocumentoService, EmpresaPrestadorExternoService, MessageService, PrestadorExternoService } from 'app/shared/services/services';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { TipoDocumentoService } from 'app/shared/services/comum/tipo-documento.service';
import { ParametrizacaoDocumentosListarComponent } from './parametrizacao-documentos-listar.component';


describe('ParametrizacaoDocumentosListarComponent', () => {
  let component: ParametrizacaoDocumentosListarComponent;
  let fixture: ComponentFixture<ParametrizacaoDocumentosListarComponent>;
  const messageServiceSpy = { getDescription: jest.fn() };
  const empresaPrestadorExternoServiceSpy = { consultarEmpresaPorId: jest.fn(), consultarFiliais: jest.fn() };
  const activatedRouteSpy = { getDescription: jest.fn() , snapshot: null, paramMap: jest.fn() };
  const routerSpy = { getDescription: jest.fn() };
  const locationSpy = { getDescription: jest.fn() };
  const comboServiceSpy = { consultarComboUF: jest.fn() };
  const tipoDocumentoServiceSpy = { consultarTodos: jest.fn() };
  const documentoServiceSpy = { get: jest.fn() };
  const prestadorExternoServiceSpy = { get: jest.fn(), consultarUsuarioExternoPorFiltro: jest.fn() };
  prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro.mockReturnValue(of({}));
  empresaPrestadorExternoServiceSpy.consultarFiliais.mockReturnValue(of({}));
  comboServiceSpy.consultarComboUF.mockReturnValue(of({}));
  tipoDocumentoServiceSpy.consultarTodos.mockReturnValue(of({}));
  documentoServiceSpy.get.mockReturnValue(of({}));
  activatedRouteSpy.snapshot = {
    params:{
        id: 1
    }
  }
 
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[
        FormsModule,  
        ReactiveFormsModule
      ],
      declarations: [ParametrizacaoDocumentosListarComponent],
      providers: [
        FormBuilder,
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: EmpresaPrestadorExternoService, useValue: empresaPrestadorExternoServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy },
        { provide: ComboService, useValue: comboServiceSpy },
        { provide: TipoDocumentoService, useValue: tipoDocumentoServiceSpy },
        {provide: PrestadorExternoService, useValue: prestadorExternoServiceSpy },

        { provide: DocumentoService, useValue: documentoServiceSpy },
      ]
    }).compileComponents();
    });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametrizacaoDocumentosListarComponent);

    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});