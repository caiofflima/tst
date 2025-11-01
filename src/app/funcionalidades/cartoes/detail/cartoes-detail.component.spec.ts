import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartoesDetailComponent } from './cartoes-detail.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MessageService } from '../../../shared/components/messages/message.service';
import { BeneficiarioService, SessaoService } from 'app/shared/services/services';
import { of } from 'rxjs';
import { Usuario } from 'app/shared/models/entidades';

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

    const beneficiarioServiceSpy = jasmine.createSpyObj('BeneficiarioService',['consultarBeneficiarioPorId']);
    beneficiarioServiceSpy.consultarBeneficiarioPorId.and.returnValue(of())

    const sessaoServiceSpy = jasmine.createSpyObj('SessaoService', ['getMatriculaFuncional','usuario']);   

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    mockLocation = {
      back: jasmine.createSpy('back')
    };

    mockMessageService = {
      addMsgDanger: jasmine.createSpy('addMsgDanger'),
      showDangerMsg: jasmine.createSpy('showDangerMsg')
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