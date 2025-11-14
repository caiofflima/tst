import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ProcedimentosCobertosParamComponent } from './procedimentos-cobertos-param.component';
import { ComboService, MessageService } from 'app/shared/services/services';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ProcedimentosCobertosParamComponent', () => {
  let component: ProcedimentosCobertosParamComponent;
  let fixture: ComponentFixture<ProcedimentosCobertosParamComponent>;

  const comboServiceSpy = { consultarComboTipoProcesso: jest.fn() };
  comboServiceSpy.consultarComboTipoProcesso.mockReturnValue(of([]));
  const messageServiceSpy = { addMsgDanger: jest.fn() };
  const routerSpy = { navigate: jest.fn() };
  const locationSpy = { back: jest.fn() };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProcedimentosCobertosParamComponent],
      providers: [
        FormBuilder,
        { provide: ComboService, useValue: comboServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcedimentosCobertosParamComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
});
