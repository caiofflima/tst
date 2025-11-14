import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'app/shared/components/messages/message.service';
import { CampoVazioHifen } from 'app/shared/pipes/campo-vazio.pipe';
import { TelefonePipe } from 'app/shared/pipes/telefone.pipe';
import { BeneficiarioService, MotivoCancelamentoService, ProcessoService, SessaoService, TipoDependenteService } from 'app/shared/services/services';
import { Usuario } from 'app/shared/models/entidades';
import { EtapaMotivoRenovacaoComponent } from './etapa-motivo-renovacao.component';
import { ActivatedRoute } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('EtapaMotivoRenovacaoComponent', () => {
  let component: EtapaMotivoRenovacaoComponent;
  let fixture: ComponentFixture<EtapaMotivoRenovacaoComponent>;

  const messageServiceSpy = { getDescription: jest.fn() };
  const processoServiceSpy = { getDescription: jest.fn() };
  const tipoDependenteServiceSpy = { getDescription: jest.fn() };
  const motivoCancelamentoServiceSpy = { getDescription: jest.fn() };
  const beneficiarioServiceSpy = { getDescription: jest.fn() };
  const sctivatedRouteSpy = { getDescription: jest.fn() };
  const usuario = {} as Usuario;
  usuario.matriculaFuncional = "C123000";
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EtapaMotivoRenovacaoComponent, CampoVazioHifen, TelefonePipe],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: ProcessoService, useValue: processoServiceSpy },
        { provide: TipoDependenteService, useValue: tipoDependenteServiceSpy },
        { provide: MotivoCancelamentoService, useValue: motivoCancelamentoServiceSpy },
        { provide: BeneficiarioService, useValue: beneficiarioServiceSpy },
        { provide: ActivatedRoute, useValue: sctivatedRouteSpy },
       
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
    fixture = TestBed.createComponent(EtapaMotivoRenovacaoComponent);
    component = fixture.componentInstance;
    SessaoService.usuario = usuario;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});
