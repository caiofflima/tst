import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'app/shared/components/messages/message.service';
import { ProcessoService } from 'app/shared/services/comum/processo.service';
import { BeneficiarioService, SessaoService, TipoDependenteService } from 'app/shared/services/services';
import { of } from 'rxjs';
import { Usuario } from 'app/shared/models/entidades';
import { CampoVazioHifen } from 'app/shared/pipes/campo-vazio.pipe';
import { TelefonePipe } from 'app/shared/pipes/telefone.pipe';
import { AtendimentoService } from 'app/shared/services/comum/atendimento.service';
import { Atendimento } from 'app/shared/models/comum/atendimento';
import { PaginaInicialComponent } from './pagina-inicial.component';

describe('PaginaInicialComponent', () => {
  let component: PaginaInicialComponent;
  let fixture: ComponentFixture<PaginaInicialComponent>;

  const messageServiceSpy = { getDescription: jest.fn() };
  const activatedRouteSpy = {
    snapshot: {
params: {
      id: null
    }
    }
  };
  const processoServiceSpy = { getProcesso: jest.fn() };
  const beneficiarioServiceSpy = { consultarPorMatricula: jest.fn() };
  beneficiarioServiceSpy.consultarPorMatricula.mockReturnValue(of({}));
  const tipoDependenteServiceSpy = { consultarTodos: jest.fn() }; 
  const sessaoServiceSpy = { SessaoService: jest.fn() }; 

  const usuario = {} as Usuario;
    usuario.matriculaFuncional = "C123000";

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaginaInicialComponent, CampoVazioHifen, TelefonePipe],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: ProcessoService, useValue: processoServiceSpy },
        { provide: TipoDependenteService, useValue: tipoDependenteServiceSpy },
        { provide: BeneficiarioService, useValue: beneficiarioServiceSpy },
        { provide: SessaoService, useValue: sessaoServiceSpy },
      ],
      imports:[
        BrowserAnimationsModule
      ]
    }).compileComponents();
    SessaoService.usuario = usuario;
    AtendimentoService.atendimento = { matricula: "C123000" } as Atendimento;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginaInicialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente 123', () => {
    expect(component).toBeTruthy();
  });

});
