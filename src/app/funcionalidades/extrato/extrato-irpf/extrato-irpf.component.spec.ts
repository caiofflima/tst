import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageService, SessaoService } from 'app/shared/services/services';
import { ExtratoIRPFComponent } from './extrato-irpf.component';

describe('ExtratoIRPFComponent', () => {
  let component: ExtratoIRPFComponent;
  let fixture: ComponentFixture<ExtratoIRPFComponent>;

  beforeEach(() => {
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['showDangerMsg']);
    const sessaoServiceSpy = jasmine.createSpyObj('SessaoService', ['getUsuario']);

    TestBed.configureTestingModule({
      declarations: [ ExtratoIRPFComponent ],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: SessaoService, useValue: sessaoServiceSpy },
      ],
      schemas: [
          CUSTOM_ELEMENTS_SCHEMA,
          NO_ERRORS_SCHEMA
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtratoIRPFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
