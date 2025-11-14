import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartoesDetailComponent } from './cartoes-detail.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MessageService } from '../../../shared/components/messages/message.service';
import { BeneficiarioService, SessaoService } from 'app/shared/services/services';
import { of } from 'rxjs';
import { Usuario } from 'app/shared/models/entidades';

// Mock pdfMake and vfs_fonts
jest.mock('pdfmake/build/pdfmake', () => ({
  vfs: {}
}));

jest.mock('assets/fonts/vfs_fonts', () => ({
  pdfMake: { vfs: {} }
}));

jest.mock('html-to-pdfmake', () => jest.fn());

describe('CartoesDetailComponent', () => {
  let component: CartoesDetailComponent;
  let fixture: ComponentFixture<CartoesDetailComponent>;
  let mockRouter: any;
  let mockLocation: any;
  let mockMessageService: any;
  let mockActivatedRoute;

  beforeEach(async () => {
    mockActivatedRoute = { snapshot: { params: { idBeneficiario: 1 } } };
    const usuario = {} as Usuario;
    usuario.matriculaFuncional = "C123000";
    SessaoService.usuario = usuario;

    const beneficiarioServiceSpy = { consultarBeneficiarioPorId: jest.fn() };
    beneficiarioServiceSpy.consultarBeneficiarioPorId.mockReturnValue(of())

    const sessaoServiceSpy = { getMatriculaFuncional: jest.fn(), usuario: jest.fn() };   

    mockRouter = {
      navigate: jest.fn()
    };

    mockLocation = {
      back: jest.fn()
    };

    mockMessageService = {
      addMsgDanger: jest.fn(),
      showDangerMsg: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [CartoesDetailComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: Location, useValue: mockLocation },
        { provide: MessageService, useValue: mockMessageService },
        { provide: BeneficiarioService, useValue: beneficiarioServiceSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: SessaoService, useValue: sessaoServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartoesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Inicializa o componente
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy(); // Verifica se o componente foi criado
  });


});