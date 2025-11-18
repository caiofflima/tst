import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailSituacaoHomeComponent } from './email-situacao-home.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'app/shared/components/messages/message.service';
import { ComboService } from 'app/shared/services/comum/combo.service';
import { of } from 'rxjs';

describe('EmailSituacaoHomeComponent', () => {
  let component: EmailSituacaoHomeComponent;
  let fixture: ComponentFixture<EmailSituacaoHomeComponent>;

  // Mock services
  const messageServiceSpy = {
    showDangerMsg: jest.fn(),
    addMsgDanger: jest.fn()
  };
  const routerSpy = {
    navigate: jest.fn()
  };
  const locationSpy = {
    back: jest.fn()
  };
  const comboServiceSpy = {
    consultarComboSituacaoProcesso: jest.fn().mockReturnValue(of([])),
    consultarComboTipoProcesso: jest.fn().mockReturnValue(of([])),
    consultarComboTipoBeneficiarioPorTipoProcesso: jest.fn().mockReturnValue(of([]))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmailSituacaoHomeComponent],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy },
        FormBuilder,
        { provide: ComboService, useValue: comboServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailSituacaoHomeComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
});
