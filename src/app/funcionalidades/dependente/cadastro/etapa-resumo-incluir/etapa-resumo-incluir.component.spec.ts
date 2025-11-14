import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'app/shared/components/messages/message.service';
import { ProcessoService } from 'app/shared/services/comum/processo.service';
import { BeneficiarioService, FileUploadService, InscricaoDependenteService, SessaoService, TipoDeficienciaService } from 'app/shared/services/services';
import { of } from 'rxjs';
import { Usuario } from 'app/shared/models/entidades';
import { EtapaResumoIncluirComponent } from './etapa-resumo-incluir.component';
import { CampoVazioHifen } from 'app/shared/pipes/campo-vazio.pipe';
import { TelefonePipe } from 'app/shared/pipes/telefone.pipe';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('EtapaResumoIncluirComponent', () => {
  let component: EtapaResumoIncluirComponent;
  let fixture: ComponentFixture<EtapaResumoIncluirComponent>;

  const messageServiceSpy = { getDescription: jest.fn() };
  const activatedRouteSpy = { snapshot: jest.fn() };
  activatedRouteSpy.snapshot = {
    params: {
      id: null
    }
  }
  const processoServiceSpy = { getProcesso: jest.fn() };
  const fileUploadServiceSpy = { getProcesso: jest.fn() };
  const beneficiarioServiceSpy = { consultarBeneficiarioPorId: jest.fn(), consultarFamiliaPorMatricula: jest.fn() };
  const inscricaoDependenteServiceSpy = { consultarBeneficiarioPorId: jest.fn() };
  const tipoDeficienciaServiceSpy = { consultarTodos: jest.fn() };
  beneficiarioServiceSpy.consultarFamiliaPorMatricula.and.returnValue(of({}))
  tipoDeficienciaServiceSpy.consultarTodos.and.returnValue(of({}))
  

  const usuario = {} as Usuario;
    usuario.matriculaFuncional = "C123000";
    usuario.menu = [{label: 'Atendimento'}]
    

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EtapaResumoIncluirComponent, CampoVazioHifen, TelefonePipe],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: FileUploadService, useValue: fileUploadServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: ProcessoService, useValue: processoServiceSpy },
        { provide: BeneficiarioService, useValue: beneficiarioServiceSpy },
        { provide: InscricaoDependenteService, useValue: inscricaoDependenteServiceSpy },
        { provide: TipoDeficienciaService, useValue: tipoDeficienciaServiceSpy },
      ],
      imports:[
        BrowserAnimationsModule
      ],
      schemas: [
          CUSTOM_ELEMENTS_SCHEMA,
          NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
    SessaoService.usuario = usuario;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EtapaResumoIncluirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});
