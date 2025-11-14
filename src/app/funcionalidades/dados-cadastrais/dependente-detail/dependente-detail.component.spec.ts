import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DependenteDetailComponent } from './dependente-detail.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MessageService } from '../../../shared/components/messages/message.service';
import { BeneficiarioService } from 'app/shared/services/services';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { DetalheBeneficiarioDTO } from 'app/shared/models/comum/detalhe-beneficiario-dto.model';
import { PipeModule } from 'app/shared/pipes/pipe.module';

describe('DependenteDetailComponent', () => {
  let component: DependenteDetailComponent;
  let fixture: ComponentFixture<DependenteDetailComponent>;
  let mockRouter: any;
  let mockLocation: any;
  let mockMessageService: any;
  let mockActivatedRoute: any;
  let mockBeneficiarioService: any;

  beforeEach(async () => {
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

    mockActivatedRoute = {
      snapshot: {
        params: {
          idBeneficiario: 1
        }
      }
    };

    mockBeneficiarioService = {
      getDadosBeneficiarioCartaoPlano: jest.fn().mockReturnValue(of({} as DetalheBeneficiarioDTO))
    };

    await TestBed.configureTestingModule({
      declarations: [DependenteDetailComponent],
      imports: [PipeModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: Location, useValue: mockLocation },
        { provide: MessageService, useValue: mockMessageService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: BeneficiarioService, useValue: mockBeneficiarioService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DependenteDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Inicializa o componente
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy(); // Verifica se o componente foi criado
  });

  it('deve inicializar corretamente os parâmetros do componente', () => {
    expect(component.idBeneficiario).toBe(1); // Verifica se o ID do beneficiário foi inicializado corretamente
  });

  it('deve carregar dados do beneficiário ao inicializar', () => {
    jest.spyOn(component, 'getDadosBeneficiarioCartaoPlano').and.callThrough(); // Espiona o método
    component.ngOnInit(); // Chama ngOnInit
    expect(component.getDadosBeneficiarioCartaoPlano).toHaveBeenCalledWith(1); // Verifica se o método foi chamado com o ID correto
  });
});

