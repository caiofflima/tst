import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'app/shared/components/messages/message.service';
import { CampoVazioHifen } from 'app/shared/pipes/campo-vazio.pipe';
import { TelefonePipe } from 'app/shared/pipes/telefone.pipe';
import { EtapaMotivoDependenteComponent } from './etapa-motivo-beneficiario.component';
import { BeneficiarioService, ProcessoService, SessaoService } from 'app/shared/services/services';
import { Usuario } from 'app/shared/models/entidades';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('EtapaMotivoDependenteComponent', () => {
  let component: EtapaMotivoDependenteComponent;
  let fixture: ComponentFixture<EtapaMotivoDependenteComponent>;

  const messageServiceSpy = jasmine.createSpyObj('MessageService', ['getDescription']);
  const processoServiceSpy = jasmine.createSpyObj('ProcessoService', ['getDescription']);
  const beneficiarioServiceSpy = jasmine.createSpyObj('BeneficiarioService', ['getDescription']);
   const usuario = {} as Usuario;
      usuario.matriculaFuncional = "C123000";
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EtapaMotivoDependenteComponent, CampoVazioHifen, TelefonePipe],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: ProcessoService, useValue: processoServiceSpy },
        { provide: BeneficiarioService, useValue: beneficiarioServiceSpy },
       
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
    fixture = TestBed.createComponent(EtapaMotivoDependenteComponent);
    component = fixture.componentInstance;
    SessaoService.usuario = usuario;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});
