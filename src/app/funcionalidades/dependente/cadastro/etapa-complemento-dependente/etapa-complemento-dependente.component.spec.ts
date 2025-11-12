import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'app/shared/components/messages/message.service';
import { MedicamentoPatologiaPedidoService } from 'app/shared/services/comum/medicamento-patologia-pedido.service';
import { PatologiaService } from 'app/shared/services/comum/patologia.service';
import { MedicamentoService } from 'app/shared/services/comum/pedido/medicamento.service';
import { ProcedimentoService } from 'app/shared/services/comum/procedimento.service';
import { ProcessoService } from 'app/shared/services/comum/processo.service';
import { BeneficiarioService, DocumentoPedidoService, InscricaoDependenteService, MotivoSolicitacaoService, SessaoService, SIASCFluxoService, TipoDeficienciaService } from 'app/shared/services/services';
import { BehaviorSubject, of } from 'rxjs';
import { AtendimentoService } from 'app/shared/services/comum/atendimento.service';
import { MotivoSolicitacao, Usuario } from 'app/shared/models/entidades';
import { EtapaComplementoDependenteComponent } from './etapa-complemento-dependente.component';

describe('EtapaComplementoDependenteComponent', () => {
  let component: EtapaComplementoDependenteComponent;
  let fixture: ComponentFixture<EtapaComplementoDependenteComponent>;

  const messageServiceSpy = jasmine.createSpyObj('MessageService', ['getDescription']);
  const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['snapshot']);
  activatedRouteSpy.snapshot = {
    params: {
      id: null
    }
  }
  const processoServiceSpy = jasmine.createSpyObj('ProcessoService', ['getProcesso']);
  const beneficiarioServiceSpy = jasmine.createSpyObj('BeneficiarioService',['consultarBeneficiarioPorId','consultarFamiliaPorMatricula']);
  const patologiaServiceSpy = jasmine.createSpyObj('PatologiaService', ['getPatologia']);
  const procedimentoServiceSpy = jasmine.createSpyObj('ProcedimentoService', ['getProcedimento']);
  const medicamentoServiceSpy = jasmine.createSpyObj('MedicamentoService', ['getMedicamento']);
  const medicamentoPatologiaPedidoServiceSpy = jasmine.createSpyObj('MedicamentoPatologiaPedidoService', ['getMedicamentoPatologiaPedido']);
  const siascFluxoServiceSpy = jasmine.createSpyObj('SIASCFluxoService', ['getFluxo','consultarPermissoesFluxoPorPedido']);
  siascFluxoServiceSpy.consultarPermissoesFluxoPorPedido.and.returnValue(of({}))
  const documentoPedidoServiceSpy = jasmine.createSpyObj('DocumentoPedidoService', ['getDocumentoPedido']);
  documentoPedidoServiceSpy.avisoSituacaoPedido = of({});
  const sessaoServiceSpy = jasmine.createSpyObj('SessaoService',['getUsuario']);
  const atendimentoServiceSpy = jasmine.createSpyObj('AtendimentoService',['get']);
  atendimentoServiceSpy.get.and.returnValue(of({}))
  const tipoDeficienciaServiceSpy = jasmine.createSpyObj('TipoDeficienciaService', ['consultarTodos']);
  tipoDeficienciaServiceSpy.consultarTodos.and.returnValue(of({}));
  const motivoSolicitacaoServiceSpy = jasmine.createSpyObj('MotivoSolicitacaoService', ['consultarTodos']);
  const inscricaoDependenteServiceSpy = jasmine.createSpyObj('InscricaoDependenteService', ['consultarTodos']);

  const usuario = {} as Usuario;
    usuario.matriculaFuncional = "C123000";
    usuario.menu = []
    SessaoService.usuario = usuario;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EtapaComplementoDependenteComponent],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: ProcessoService, useValue: processoServiceSpy },
        { provide: PatologiaService, useValue: patologiaServiceSpy },
        { provide: ProcedimentoService, useValue: procedimentoServiceSpy },
        { provide: MedicamentoService, useValue: medicamentoServiceSpy },
        { provide: MedicamentoPatologiaPedidoService, useValue: medicamentoPatologiaPedidoServiceSpy },
        { provide: SIASCFluxoService, useValue: siascFluxoServiceSpy },
        { provide: DocumentoPedidoService, useValue: documentoPedidoServiceSpy },
        { provide: BeneficiarioService, useValue: beneficiarioServiceSpy },
        { provide: SessaoService, useValue: sessaoServiceSpy },
        { provide: AtendimentoService, useValue: atendimentoServiceSpy },
        { provide: TipoDeficienciaService, useValue: tipoDeficienciaServiceSpy },
        { provide: MotivoSolicitacaoService, useValue: motivoSolicitacaoServiceSpy },
        { provide: InscricaoDependenteService, useValue: inscricaoDependenteServiceSpy },
      ],
      imports:[
        BrowserAnimationsModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    const selectedOptionSource = new BehaviorSubject<MotivoSolicitacao | null>(null);
    motivoSolicitacaoServiceSpy.selectedOption$ = selectedOptionSource.asObservable();

    fixture = TestBed.createComponent(EtapaComplementoDependenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});
