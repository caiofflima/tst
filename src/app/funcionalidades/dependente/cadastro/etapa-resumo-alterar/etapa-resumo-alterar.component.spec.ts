import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'app/shared/components/messages/message.service';
import { ProcessoService } from 'app/shared/services/comum/processo.service';
import { BeneficiarioService, FileUploadService, InscricaoDependenteService, SessaoService, TipoDeficienciaService, TipoDependenteService } from 'app/shared/services/services';
import { Usuario } from 'app/shared/models/entidades';
import { EtapaResumoAlterarComponent } from './etapa-resumo-alterar.component';
import { of } from 'rxjs';
import { CampoVazioHifen } from 'app/shared/pipes/campo-vazio.pipe';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('EtapaResumoAlterarComponent', () => {
  let component: EtapaResumoAlterarComponent;
  let fixture: ComponentFixture<EtapaResumoAlterarComponent>;

  const messageServiceSpy = jasmine.createSpyObj('MessageService', ['getDescription']);
   const processoServiceSpy = jasmine.createSpyObj('ProcessoService', ['getProcesso']);
  const beneficiarioServiceSpy = jasmine.createSpyObj('BeneficiarioService',['consultarBeneficiarioPorId','consultarFamiliaPorMatricula']);
  const tipoDependenteServiceSpy = jasmine.createSpyObj('TipoDependenteService', ['consultarTodos']);
  const fileUploadServiceSpy = jasmine.createSpyObj('FileUploadService',['init']);
  const inscricaoDependenteServiceSpy = jasmine.createSpyObj('InscricaoDependenteService',['init']);
  const tipoDeficienciaServiceSpy = jasmine.createSpyObj('TipoDeficienciaService',['consultarTodos']);
  tipoDeficienciaServiceSpy.consultarTodos.and.returnValue(of({}))
  

  const usuario = {} as Usuario;
    usuario.matriculaFuncional = "C123000";
    usuario.menu = []
    SessaoService.usuario = usuario;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EtapaResumoAlterarComponent,
        CampoVazioHifen
      ],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: ProcessoService, useValue: processoServiceSpy },
        { provide: BeneficiarioService, useValue: beneficiarioServiceSpy },
        { provide: TipoDependenteService, useValue: tipoDependenteServiceSpy },
        { provide: FileUploadService, useValue: fileUploadServiceSpy },
        { provide: InscricaoDependenteService, useValue: inscricaoDependenteServiceSpy },
        { provide: TipoDeficienciaService, useValue: tipoDeficienciaServiceSpy },
      ],
      imports:[
        BrowserAnimationsModule,
      ],
      schemas: [
          CUSTOM_ELEMENTS_SCHEMA,
          NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EtapaResumoAlterarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});
