import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'app/shared/components/messages/message.service';
import { CampoVazioHifen } from 'app/shared/pipes/campo-vazio.pipe';
import { TelefonePipe } from 'app/shared/pipes/telefone.pipe';
import { FileUploadService, InscricaoDependenteService, SessaoService } from 'app/shared/services/services';
import { EtapaResumoRenovarComponent } from './etapa-resumo-renovar.component';
import { Usuario } from 'app/shared/models/entidades';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('EtapaResumoRenovarComponent', () => {
  let component: EtapaResumoRenovarComponent;
  let fixture: ComponentFixture<EtapaResumoRenovarComponent>;

  const messageServiceSpy = jasmine.createSpyObj('MessageService', ['getDescription']);
  const fileUploadServiceSpy = jasmine.createSpyObj('FileUploadService', ['getDescription']);
  const inscricaoDependenteServiceSpy = jasmine.createSpyObj('InscricaoDependenteService', ['getDescription']);
  const usuario = {} as Usuario;
  usuario.matriculaFuncional = "C123000";
   
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EtapaResumoRenovarComponent, CampoVazioHifen, TelefonePipe],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: FileUploadService, useValue: fileUploadServiceSpy },
        { provide: InscricaoDependenteService, useValue: inscricaoDependenteServiceSpy },
        
       
      ],
      imports:[
        BrowserAnimationsModule
      ],
      schemas: [
          CUSTOM_ELEMENTS_SCHEMA,
          NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EtapaResumoRenovarComponent);
    component = fixture.componentInstance;
    SessaoService.usuario = usuario;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});
