import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EtapaContatoTitularComponent } from './etapa-contato-titular.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IntegracaoCorreiosService } from 'app/shared/services/comum/integracao-correios.service';
import { MessageService } from 'app/shared/services/services';
import { of } from 'rxjs';

describe('EtapaContatoTitularComponent', () => {
  let component: EtapaContatoTitularComponent;
  let fixture: ComponentFixture<EtapaContatoTitularComponent>;

  // Mock services
  const messageServiceSpy = {
    addMsgDanger: jest.fn()
  };
  const integracaoCorreiosServiceSpy = {
    getEnderecoByCEP: jest.fn().mockReturnValue(of(null))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EtapaContatoTitularComponent],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        FormBuilder,
        { provide: IntegracaoCorreiosService, useValue: integracaoCorreiosServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EtapaContatoTitularComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
});
