import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadService } from 'app/shared/services/comum/file-upload.service';
import { SituacaoPedidoService } from 'app/shared/services/comum/situacao-pedido.service';
import { MessageService, SessaoService } from 'app/shared/services/services';
import { AscModalOcorrenciaComponent } from './asc-modal-ocorrencia.component';


describe('AscModalOcorrenciaComponent', () => {
  let component: AscModalOcorrenciaComponent;
  let fixture: ComponentFixture<AscModalOcorrenciaComponent>;
  const messageServiceSpy = jasmine.createSpyObj('MessageService',['getDescription']);
  const situacaoPedidoServiceSpy = jasmine.createSpyObj('SituacaoPedidoService',['getDescription']);
  const fileUploadServiceSpy = jasmine.createSpyObj('FileUploadService',['getDescription']);
  const sessaoServiceSpy = jasmine.createSpyObj('FileUploadService',['ini']);
 
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[
        FormsModule,  
        ReactiveFormsModule
      ],
      declarations: [AscModalOcorrenciaComponent],
      providers: [
        FormBuilder,
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: SituacaoPedidoService, useValue: situacaoPedidoServiceSpy },
        { provide: FileUploadService, useValue: fileUploadServiceSpy },
        { provide: SessaoService, useValue: sessaoServiceSpy },
      ],
      schemas:[
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
    });

  beforeEach(() => {
    fixture = TestBed.createComponent(AscModalOcorrenciaComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});