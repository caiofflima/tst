import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EtapaResumoTitularComponent } from './etapa-resumo-titular.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { InscricaoDependenteService, MessageService, SessaoService, TipoDeficienciaService } from 'app/shared/services/services';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { PipeModule } from 'app/shared/pipes/pipe.module';

describe('EtapaResumoTitularComponent', () => {
  let component: EtapaResumoTitularComponent;
  let fixture: ComponentFixture<EtapaResumoTitularComponent>;

  // Mock services
  const messageServiceSpy = {
    addMsgDanger: jest.fn(),
    showDangerMsg: jest.fn()
  };
  const serviceSpy = {
    salvar: jest.fn().mockReturnValue(of({}))
  };
  const tipoDeficienciaServiceSpy = {
    consultarTodos: jest.fn().mockReturnValue(of([]))
  };
  const changeDetectorRefSpy = {
    detectChanges: jest.fn()
  };

  beforeEach(async () => {
    // Initialize SessaoService.usuario before TestBed configuration
    SessaoService.usuario = { matriculaFuncional: '12345', nome: 'Test User' } as any;

    await TestBed.configureTestingModule({
      declarations: [EtapaResumoTitularComponent],
      imports: [ReactiveFormsModule, PipeModule],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: InscricaoDependenteService, useValue: serviceSpy },
        { provide: TipoDeficienciaService, useValue: tipoDeficienciaServiceSpy },
        { provide: ChangeDetectorRef, useValue: changeDetectorRefSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EtapaResumoTitularComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
});
