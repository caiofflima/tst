import { CdkStepper } from '@angular/cdk/stepper';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'app/shared/components/messages/message.service';
import { TipoBeneficiarioDTO } from 'app/shared/models/dto/tipo-beneficiario';
import { Beneficiario, Usuario } from 'app/shared/models/entidades';
import { AtendimentoService } from 'app/shared/services/comum/atendimento.service';
import { ProcessoService } from 'app/shared/services/comum/processo.service';
import { BeneficiarioService, SessaoService, TipoDependenteService } from 'app/shared/services/services';
import { Observable, of } from 'rxjs';
import { BeneficiarioDependenteFormModel } from '../../models/beneficiario-dependente-form.model';
import { EtapaDadosDependenteComponent } from './etapa-dados-dependente.component';

describe('EtapaDadosDependenteComponent', () => {
  let component: EtapaDadosDependenteComponent;
  let fixture: ComponentFixture<EtapaDadosDependenteComponent>;

  const messageServiceSpy = { addMsgDanger: jest.fn() };
   const processoServiceSpy = { getProcesso: jest.fn() };
  const beneficiarioServiceSpy = { consultarPorMatricula: jest.fn(), consultarFamiliaPorMatricula: jest.fn() };
  const tipoDependenteServiceSpy = { consultarTipoDependente: jest.fn() };
  const cdkStepperSpy = { next: jest.fn(), previous: jest.fn() };
  const atendimentoServiceSpy = { init: jest.fn() };
  

  const usuario = {} as Usuario;
    usuario.matriculaFuncional = "C123000";
    usuario.menu = []
    SessaoService.usuario = usuario;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EtapaDadosDependenteComponent],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: ProcessoService, useValue: processoServiceSpy },
        { provide: BeneficiarioService, useValue: beneficiarioServiceSpy },
        { provide: TipoDependenteService, useValue: tipoDependenteServiceSpy },
        { provide: CdkStepper, useValue: cdkStepperSpy },
        { provide: AtendimentoService, useValue: atendimentoServiceSpy },
      ],
      imports:[
        BrowserAnimationsModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EtapaDadosDependenteComponent);
    component = fixture.componentInstance;
    component.checkRestart = new Observable<void>();
    component.stepper = cdkStepperSpy;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve validar data de Nascimento Menor', () => {
    const dataNascimentoControl = component.formularioDadosDependente.get('dataNascimento');
    expect(dataNascimentoControl).toBeTruthy();

    const dataNascimentoValidators = dataNascimentoControl.validator;
    expect(dataNascimentoValidators).toBeTruthy();

    const dataAtual = new Date();
   
    const dadosMenor = {
      dataNascimento : dataAtual
    }
    component.formularioDadosDependente.patchValue(dadosMenor);
    component.validDataNascimento();
  });

 it('deve validar data de Nascimento Maior', () => {
    const dataNascimentoControl = component.formularioDadosDependente.get('dataNascimento');
    expect(dataNascimentoControl).toBeTruthy();

    const dataNascimentoValidators = dataNascimentoControl.validator;
    expect(dataNascimentoValidators).toBeTruthy();

    const data = new Date();
    data.setFullYear(data.getFullYear() - 20);
    const dadosMenor = {
      dataNascimento : data
    }
    component.formularioDadosDependente.patchValue(dadosMenor);
    component.validDataNascimento();
  });  

  it('deve enviar informações', () =>{
    const data = new Date();
    data.setFullYear(data.getFullYear() - 20);
    component.beneficiarioDependente = {matricula:1} as BeneficiarioDependenteFormModel;

    const beneficiario = {tipoDependente: {id:1} } as Beneficiario;
    beneficiarioServiceSpy.consultarPorMatricula.and.returnValue(of(beneficiario));

    tipoDependenteServiceSpy.consultarTipoDependente.and.returnValue(of({} as TipoBeneficiarioDTO));
    
    const dados = {
      nomeCompleto: 'TESTE TESTE ',
      cpf:"68782453039",
      dataNascimento: data,
      nomeMae:'Teste Teste',
      sexo:'M',
      nomePai: 'Teste Teste',
      declaracaoNascidoVivo: 123456 ,
      idEstadoCivil: 2,
      emailDependente:'teste@gmail.com'
    }
    component.formularioDadosDependente.setValue(dados);

    component.onSubmit();
  });

  it('Valida se é menor de idade', () =>{
    const data = new Date();
    component.dadoDependente = { dataNascimento: data };;

    component.tipoDependente = {
      codigoLegadoDependencia: 'C'
    } as TipoBeneficiarioDTO;
    
    expect(component.isMenorIdade(13)).toBe(true);
    
  });

  it('Valida se é menor de idade', () =>{
    const data = new Date();
    component.dadoDependente = { dataNascimento: data };;

    component.tipoDependente = {
      codigoLegadoDependencia: 'C'
    } as TipoBeneficiarioDTO;
    expect(component.idadeIncompativel()).toBeFalse;
    
  });

});
