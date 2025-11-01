import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocalidadeService, MessageService, ProcedimentoPedidoService, ProcessoService } from 'app/shared/services/services';
import { AscCardDocumentoFiscalComponent } from './asc-card-documento-fiscal.component';


describe('AscCardDocumentoFiscalComponent', () => {
  let component: AscCardDocumentoFiscalComponent;
  let fixture: ComponentFixture<AscCardDocumentoFiscalComponent>;
  const messageServiceSpy = jasmine.createSpyObj('MessageService',['getDescription']);
  const localidadeServiceSpy = jasmine.createSpyObj('LocalidadeService',['getDescription']);
  const procedimentoPedidoServiceSpy = jasmine.createSpyObj('ProcedimentoPedidoService',['getDescription']);
  const processoServiceSpy = jasmine.createSpyObj('ProcessoService',['getDescription']);
 
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[
        FormsModule,  
        ReactiveFormsModule
      ],
      declarations: [AscCardDocumentoFiscalComponent],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: LocalidadeService, useValue: localidadeServiceSpy },
        { provide: ProcedimentoPedidoService, useValue: procedimentoPedidoServiceSpy },
        { provide: ProcessoService, useValue: processoServiceSpy },
      ],
      schemas:[
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
    });

  beforeEach(() => {
    fixture = TestBed.createComponent(AscCardDocumentoFiscalComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});