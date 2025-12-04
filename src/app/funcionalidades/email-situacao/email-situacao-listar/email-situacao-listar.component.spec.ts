import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EmailSituacaoListarComponent } from './email-situacao-listar.component';
import { MessageService } from 'app/shared/components/messages/message.service';
import { EmailService } from 'app/shared/services/comum/email.service';

describe('EmailSituacaoListarComponent', () => {
  let component: EmailSituacaoListarComponent;
  let fixture: ComponentFixture<EmailSituacaoListarComponent>;

  // Mock services
  const messageServiceSpy = {
    showDangerMsg: jest.fn()
  };
  const emailServiceSpy = {
    consultar: jest.fn().mockReturnValue(of({ total: 0, dados: [] }))
  };
  const routeSpy = {
    snapshot: {
      queryParams: {}
    }
  };
  const locationSpy = {
    back: jest.fn()
  };
  const changeDetectorRefSpy = {
    detectChanges: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmailSituacaoListarComponent],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: EmailService, useValue: emailServiceSpy },
        { provide: ActivatedRoute, useValue: routeSpy },
        { provide: Location, useValue: locationSpy },
        { provide: ChangeDetectorRef, useValue: changeDetectorRefSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailSituacaoListarComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
});
