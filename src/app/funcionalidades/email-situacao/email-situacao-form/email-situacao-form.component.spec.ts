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

  const messageServiceSpy = jasmine.createSpyObj('MessageService', ['addMsgDanger', 'addSuccessMsg', 'addConfirmYesNo','fromResourceBundle']);
  const comboServiceSpy = jasmine.createSpyObj('ComboService', ['consultarComboTipoBeneficiarioPorTipoProcesso', 'consultarTipoDestinatario']);
  const tipoProcessoServiceSpy = jasmine.createSpyObj('TipoProcessoService', ['consultarTodos']);
  const prestadorExternoServiceSpy = jasmine.createSpyObj('PrestadorExternoService',['get','consultarUsuarioExternoPorFiltro']);
  prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro = of({})
  const emailServiceSpy = jasmine.createSpyObj('EmailService', ['get', 'put', 'post', 'delete']);
  const activatedRouteSpy = {
    snapshot: { params: { id: '1' } }
  };
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  const locationSpy = jasmine.createSpyObj('Location', ['back']);
  const changeDetectorRefSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

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

    comboServiceSpy.consultarComboTipoBeneficiarioPorTipoProcesso.and.returnValue(of([]));
    comboServiceSpy.consultarTipoDestinatario.and.returnValue(of([]));

    tipoProcessoServiceSpy.consultarTodos.and.returnValue(of([]));

    emailServiceSpy.get.and.returnValue(of({}));

    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});
