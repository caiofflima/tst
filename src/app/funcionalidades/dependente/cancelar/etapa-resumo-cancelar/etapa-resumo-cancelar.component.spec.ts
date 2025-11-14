import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'app/shared/components/messages/message.service';
import { CampoVazioHifen } from 'app/shared/pipes/campo-vazio.pipe';
import { TelefonePipe } from 'app/shared/pipes/telefone.pipe';
import { BeneficiarioService, FileUploadService, InscricaoDependenteService, ProcessoService, SessaoService } from 'app/shared/services/services';
import { Usuario } from 'app/shared/models/entidades';
import { EtapaResumoCancelarComponent } from './etapa-resumo-cancelar.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('EtapaResumoCancelarComponent', () => {
  let component: EtapaResumoCancelarComponent;
  let fixture: ComponentFixture<EtapaResumoCancelarComponent>;

  const messageServiceSpy = { getDescription: jest.fn() };
  const processoServiceSpy = { getDescription: jest.fn() };
  const beneficiarioServiceSpy = { getDescription: jest.fn() };
  const fileUploadServiceSpy = { getDescription: jest.fn() };
  const inscricaoDependenteServiceSpy = { getDescription: jest.fn() };
   const usuario = {} as Usuario;
      usuario.matriculaFuncional = "C123000";
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EtapaResumoCancelarComponent, CampoVazioHifen, TelefonePipe],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: ProcessoService, useValue: processoServiceSpy },
        { provide: BeneficiarioService, useValue: beneficiarioServiceSpy },
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
    SessaoService.usuario = usuario;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EtapaResumoCancelarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente 123', () => {
    expect(component).toBeTruthy();
  });

});
