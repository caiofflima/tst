import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'app/shared/components/messages/message.service';
import { MedicamentoPatologiaPedidoService } from 'app/shared/services/comum/medicamento-patologia-pedido.service';
import { PatologiaService } from 'app/shared/services/comum/patologia.service';
import { MedicamentoService } from 'app/shared/services/comum/pedido/medicamento.service';
import { ProcedimentoService } from 'app/shared/services/comum/procedimento.service';
import { ProcessoService } from 'app/shared/services/comum/processo.service';
import { BeneficiarioService, DocumentoPedidoService, InscricaoDependenteService, SessaoService, SIASCFluxoService } from 'app/shared/services/services';
import { of } from 'rxjs';
import { CadastroDependenteComponent } from './cadastro-dependente.component';
import { AtendimentoService } from 'app/shared/services/comum/atendimento.service';
import { Usuario } from 'app/shared/models/entidades';

describe('CadastroDependenteComponent', () => {
  let component: CadastroDependenteComponent;
  let fixture: ComponentFixture<CadastroDependenteComponent>;

  const messageServiceSpy = { getDescription: jest.fn() };
  const activatedRouteSpy = { snapshot: jest.fn() };
  activatedRouteSpy.snapshot = {
    params: {
      id: null
    }
  }

  const processoServiceSpy = { getProcesso: jest.fn() };
  const beneficiarioServiceSpy = { consultarBeneficiarioPorId: jest.fn(), consultarFamiliaPorMatricula: jest.fn(), consultarTodaFamiliaPorMatriculaRenovacao: jest.fn(), consultarTitularPorMatricula: jest.fn() };
  beneficiarioServiceSpy.consultarFamiliaPorMatricula.mockReturnValue(of({}))
  beneficiarioServiceSpy.consultarTodaFamiliaPorMatriculaRenovacao.mockReturnValue(of([]))
  beneficiarioServiceSpy.consultarTitularPorMatricula.mockReturnValue(of({}))
  const patologiaServiceSpy = { getPatologia: jest.fn() };
  const procedimentoServiceSpy = { getProcedimento: jest.fn() };
  const medicamentoServiceSpy = { getMedicamento: jest.fn() };
  const medicamentoPatologiaPedidoServiceSpy = { getMedicamentoPatologiaPedido: jest.fn() };
  const siascFluxoServiceSpy = { getFluxo: jest.fn(), consultarPermissoesFluxoPorPedido: jest.fn() };
  siascFluxoServiceSpy.consultarPermissoesFluxoPorPedido.mockReturnValue(of({}))
  const documentoPedidoServiceSpy = { getDocumentoPedido: jest.fn() };
  documentoPedidoServiceSpy.avisoSituacaoPedido.mockReturnValue(of({}));
  const sessaoServiceSpy = { getUsuario: jest.fn() };
  const atendimentoServiceSpy = { get: jest.fn() };
  atendimentoServiceSpy.get.mockReturnValue(of({}))

  const inscricaoDependenteServiceSpy = { setEditMode: jest.fn() };

  const usuario = {} as Usuario;
    usuario.matriculaFuncional = "C123000";
    usuario.menu = [{label: 'Atendimento'}]
    

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CadastroDependenteComponent],
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
        { provide: InscricaoDependenteService, useValue: inscricaoDependenteServiceSpy },
      ],
      imports:[
        BrowserAnimationsModule
      ]
    }).compileComponents();
    SessaoService.usuario = usuario;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroDependenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});
