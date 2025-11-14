import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {Subject, of} from 'rxjs';
import { MessageService, SessaoService } from '../../../../services/services';
import { AscBeneficiarioPedido } from './asc-beneficiario-pedido.component';

describe('AscBeneficiarioPedido', () => {
  let component: AscBeneficiarioPedido;
  let fixture: ComponentFixture<AscBeneficiarioPedido>;

  beforeEach(async () => {
    const messageServiceSpy = { showDangerMsg: jest.fn() };
    jest.spyOn(SessaoService, 'getMatriculaFuncional').mockReturnValue('C000123');

    await TestBed.configureTestingModule({
      declarations: [ AscBeneficiarioPedido ],
      imports: [ ReactiveFormsModule, BrowserAnimationsModule ],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
      ],
      schemas:[
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AscBeneficiarioPedido);
    component = fixture.componentInstance;
    component.checkRestart = new Subject<void>();

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
