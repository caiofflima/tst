import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailSituacaoFormComponent } from './email-situacao-form.component';
import { MessageService } from 'app/shared/components/messages/message.service';
import { FormBuilder } from '@angular/forms';
import { ComboService } from 'app/shared/services/comum/combo.service';
import { TipoProcessoService } from 'app/shared/services/comum/tipo-processo.service';
import { EmailService } from 'app/shared/services/comum/email.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PrestadorExternoService } from 'app/shared/services/services';

describe('EmailSituacaoFormComponent', () => {
  let component: EmailSituacaoFormComponent;
  let fixture: ComponentFixture<EmailSituacaoFormComponent>;

  const messageServiceSpy = { addMsgDanger: jest.fn(), addSuccessMsg: jest.fn(), addConfirmYesNo: jest.fn(), fromResourceBundle: jest.fn() };
  const comboServiceSpy = { consultarComboTipoBeneficiarioPorTipoProcesso: jest.fn(), consultarTipoDestinatario: jest.fn() };
  const tipoProcessoServiceSpy = { consultarTodos: jest.fn() };
  const prestadorExternoServiceSpy = { get: jest.fn(), consultarUsuarioExternoPorFiltro: jest.fn() };
  prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro = of({})
  const emailServiceSpy = { get: jest.fn(), put: jest.fn(), post: jest.fn(), delete: jest.fn() };
  const activatedRouteSpy = {
    snapshot: { params: { id: '1' } }
  };
  const routerSpy = { navigate: jest.fn() };
  const locationSpy = { back: jest.fn() };
  const changeDetectorRefSpy = { detectChanges: jest.fn() };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmailSituacaoFormComponent],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: FormBuilder, useClass: FormBuilder },
        { provide: ComboService, useValue: comboServiceSpy },
        { provide: TipoProcessoService, useValue: tipoProcessoServiceSpy },
        { provide: EmailService, useValue: emailServiceSpy },
  {provide: PrestadorExternoService, useValue: prestadorExternoServiceSpy },

        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy },
        { provide: ChangeDetectorRef, useValue: changeDetectorRefSpy },
      ],
      imports: [
        BrowserAnimationsModule
      ],
      schemas: [
          CUSTOM_ELEMENTS_SCHEMA,
          NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailSituacaoFormComponent);
    component = fixture.componentInstance;

    comboServiceSpy.consultarComboTipoBeneficiarioPorTipoProcesso.mockReturnValue(of([]));
    comboServiceSpy.consultarTipoDestinatario.mockReturnValue(of([]));

    tipoProcessoServiceSpy.consultarTodos.mockReturnValue(of([]));

    emailServiceSpy.get.mockReturnValue(of({}));

    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});
