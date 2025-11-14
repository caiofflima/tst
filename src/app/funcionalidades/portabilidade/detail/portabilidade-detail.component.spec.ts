import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PortabilidadeDetailComponent } from './portabilidade-detail.component';
import { BeneficiarioService, MessageService, SessaoService } from 'app/shared/services/services';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

// Mock pdfMake and vfs_fonts
jest.mock('pdfmake/build/pdfmake', () => ({
  vfs: {}
}));

jest.mock('assets/fonts/vfs_fonts', () => ({
  pdfMake: { vfs: {} }
}));

jest.mock('html-to-pdfmake', () => jest.fn());

describe('PortabilidadeDetailComponent', () => {
  let component: PortabilidadeDetailComponent;
  let fixture: ComponentFixture<PortabilidadeDetailComponent>;

  const beneficiarioServiceSpy = { consultarPorMatricula: jest.fn() };
  beneficiarioServiceSpy.consultarPorMatricula.mockReturnValue(of({}));
  const messageServiceSpy = { addMsgDanger: jest.fn() };
  const sessaoServiceSpy = { getUsuario: jest.fn() };
  const locationSpy = { back: jest.fn() };
  const activatedRouteSpy = {
    snapshot: {
      params: {
        id: null
      }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PortabilidadeDetailComponent],
      providers: [
        { provide: BeneficiarioService, useValue: beneficiarioServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: SessaoService, useValue: sessaoServiceSpy },
        { provide: Location, useValue: locationSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortabilidadeDetailComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
});
