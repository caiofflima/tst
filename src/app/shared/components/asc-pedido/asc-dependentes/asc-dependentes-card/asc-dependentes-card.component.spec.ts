import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InscricaoDependenteService } from 'app/shared/services/comum/inscricao-dependente.service';
import { TipoDependenteService } from 'app/shared/services/comum/tipo-dependente.service';
import { BeneficiarioService, MessageService, TipoDeficienciaService } from 'app/shared/services/services';
import { of } from 'rxjs';
import { CampoVazioHifen } from './../../../../pipes/campo-vazio.pipe';
import { AscDependentesCardComponent } from './asc-dependentes-card.component';

describe('AscDependentesCardComponent', () => {
  let component: AscDependentesCardComponent;
  let fixture: ComponentFixture<AscDependentesCardComponent>;
  const messageServiceSpy = jasmine.createSpyObj('MessageService',['getDescription']);
  const inscricaoDependenteServiceSpy = jasmine.createSpyObj('InscricaoDependenteService',['init']);
  const tipoDependenteServiceSpy = jasmine.createSpyObj('TipoDependenteService',['init']);
  const BeneficiarioServiceSpy = jasmine.createSpyObj('BeneficiarioService',['init']);
  const tipoDeficienciaServiceSpy = jasmine.createSpyObj('TipoDeficienciaService',['consultarTodos']);
  tipoDeficienciaServiceSpy.consultarTodos.and.returnValue(of([]));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [AscDependentesCardComponent, CampoVazioHifen],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: InscricaoDependenteService, useValue: inscricaoDependenteServiceSpy },
        { provide: TipoDependenteService, useValue: tipoDependenteServiceSpy },
        { provide: TipoDeficienciaService, useValue: tipoDeficienciaServiceSpy },
        { provide: BeneficiarioService, useValue: BeneficiarioServiceSpy },
      ]
    }).compileComponents();
    });

  beforeEach(() => {
    fixture = TestBed.createComponent(AscDependentesCardComponent);
    component = fixture.componentInstance;
    
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});