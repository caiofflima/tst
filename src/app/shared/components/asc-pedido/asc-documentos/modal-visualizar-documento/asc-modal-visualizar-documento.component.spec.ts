import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DocumentoPedidoService, MessageService } from 'app/shared/services/services';
import { AnexoService } from './../../../../services/comum/anexo.service';
import { AscModalVisualizarDocumentoComponent } from './asc-modal-visualizar-documento.component';

describe('AscModalVisualizarDocumentoComponent', () => {
  let component: AscModalVisualizarDocumentoComponent;
  let fixture: ComponentFixture<AscModalVisualizarDocumentoComponent>;
  const messageServiceSpy = { getDescription: jest.fn() };
  const anexoServiceSpy = { getDescription: jest.fn() };
  const documentoPedidoServiceSpy = { getDescription: jest.fn() , avisoSituacaoPedido: jest.fn(), avisoSituacaoPedidoComplementares: jest.fn() };
 
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[
        FormsModule,  
        ReactiveFormsModule
      ],
      declarations: [AscModalVisualizarDocumentoComponent],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: AnexoService, useValue: anexoServiceSpy },
        { provide: DocumentoPedidoService, useValue: documentoPedidoServiceSpy },
      ],
      schemas:[
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
    });

  beforeEach(() => {
    fixture = TestBed.createComponent(AscModalVisualizarDocumentoComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});