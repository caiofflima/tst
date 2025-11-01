import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DocumentoService } from 'app/shared/services/comum/documento.service';
import { DocumentoPedidoService, MessageService } from 'app/shared/services/services';
import { DocumentoComplementarCardComponent } from './asc-documento-complementar-card.component';

describe('DocumentoComplementarCardComponent', () => {
  let component: DocumentoComplementarCardComponent;
  let fixture: ComponentFixture<DocumentoComplementarCardComponent>;
  const messageServiceSpy = jasmine.createSpyObj('MessageService',['getDescription']);
  const documentoServiceSpy = jasmine.createSpyObj('DocumentoService',['getDescription']);
  const documentoPedidoServiceSpy = jasmine.createSpyObj('DocumentoPedidoService',['getDescription']);
 
  



  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[
      

  FormsModule,  
        ReactiveFormsModule
      ],
      declarations: [DocumentoComplementarCardComponent],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: DocumentoService, useValue: documentoServiceSpy },
        { provide: DocumentoPedidoService, useValue: documentoPedidoServiceSpy },
      ],
      schemas:[
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
    });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoComplementarCardComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});