import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EtapaTipoTitularComponent } from './etapa-tipo-titular.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BeneficiarioService, MessageService, SessaoService } from 'app/shared/services/services';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { PipeModule } from 'app/shared/pipes/pipe.module';

describe('EtapaTipoTitularComponent', () => {
  let component: EtapaTipoTitularComponent;
  let fixture: ComponentFixture<EtapaTipoTitularComponent>;

  // Mock services
  const messageServiceSpy = {
    addMsgDanger: jest.fn()
  };
  const serviceSpy = {
    consultarBeneficiarioAtivoPorMatricula: jest.fn().mockReturnValue(of(null)),
    verificarSeEmpregadoEstaAtivoPorMatricula: jest.fn().mockReturnValue(of(true)),
    consultarTitularPorMatricula: jest.fn().mockReturnValue(of({ id: 1, nome: 'Test', matricula: { matricula: '12345', sexo: 'M', cpf: '12345678900', nomeMae: 'Mae', dataNascimento: new Date() }, tipoDependente: { id: 86 }, estadoCivil: { codigo: 1 } }))
  };

  beforeEach(async () => {
    // Initialize SessaoService.usuario before TestBed configuration
    SessaoService.usuario = { matriculaFuncional: '12345', nome: 'Test User' } as any;

    await TestBed.configureTestingModule({
      declarations: [EtapaTipoTitularComponent],
      imports: [ReactiveFormsModule, NoopAnimationsModule, PipeModule],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: BeneficiarioService, useValue: serviceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EtapaTipoTitularComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
});
