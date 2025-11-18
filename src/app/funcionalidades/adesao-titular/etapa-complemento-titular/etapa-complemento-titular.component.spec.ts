import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EtapaComplementotitularComponent } from './etapa-complemento-titular.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MessageService, TipoDeficienciaService } from 'app/shared/services/services';
import { of } from 'rxjs';

describe('EtapaComplementotitularComponent', () => {
  let component: EtapaComplementotitularComponent;
  let fixture: ComponentFixture<EtapaComplementotitularComponent>;

  // Mock services
  const serviceSpy = {
    consultarTodos: jest.fn().mockReturnValue(of([]))
  };
  const messageServiceSpy = {
    addMsgDanger: jest.fn(),
    showDangerMsg: jest.fn()
  };
  const changeDetectorRefSpy = {
    detectChanges: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EtapaComplementotitularComponent],
      providers: [
        FormBuilder,
        { provide: TipoDeficienciaService, useValue: serviceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: ChangeDetectorRef, useValue: changeDetectorRefSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EtapaComplementotitularComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
});
