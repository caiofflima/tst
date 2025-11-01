import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'app/shared/components/messages/message.service';
import { ProcessoService } from 'app/shared/services/comum/processo.service';
import { BeneficiarioService, FileUploadService, InscricaoDependenteService, SessaoService, TipoDeficienciaService } from 'app/shared/services/services';
import { of } from 'rxjs';
import { Usuario } from 'app/shared/models/entidades';
import { CampoVazioHifen } from 'app/shared/pipes/campo-vazio.pipe';
import { TelefonePipe } from 'app/shared/pipes/telefone.pipe';
import { CancelarDependenteComponent } from './cancelar-dependente.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('CancelarDependenteComponent', () => {
  let component: CancelarDependenteComponent;
  let fixture: ComponentFixture<CancelarDependenteComponent>;

  const messageServiceSpy = jasmine.createSpyObj('MessageService', ['getDescription']);
  const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['snapshot']);
  activatedRouteSpy.snapshot = {
    params: {
      id: null
    }
  }
  const processoServiceSpy = jasmine.createSpyObj('ProcessoService', ['getProcesso']);
  const fileUploadServiceSpy = jasmine.createSpyObj('FileUploadService', ['getProcesso']);
  const beneficiarioServiceSpy = jasmine.createSpyObj('BeneficiarioService',['consultarBeneficiarioPorId','consultarFamiliaPorMatricula']);
  const inscricaoDependenteServiceSpy = jasmine.createSpyObj('InscricaoDependenteService',['consultarBeneficiarioPorId']);
  const tipoDeficienciaServiceSpy = jasmine.createSpyObj('TipoDeficienciaService',['consultarTodos']);
  beneficiarioServiceSpy.consultarFamiliaPorMatricula.and.returnValue(of({}))
  tipoDeficienciaServiceSpy.consultarTodos.and.returnValue(of({}))
  

  const usuario = {} as Usuario;
    usuario.matriculaFuncional = "C123000";
    usuario.menu = [{label: 'Atendimento'}]
    

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CancelarDependenteComponent, CampoVazioHifen, TelefonePipe],
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
    fixture = TestBed.createComponent(CancelarDependenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});
