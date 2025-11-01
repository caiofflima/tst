import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'app/shared/components/messages/message.service';
import { MedicamentoPatologiaPedidoService } from 'app/shared/services/comum/medicamento-patologia-pedido.service';
import { PatologiaService } from 'app/shared/services/comum/patologia.service';
import { MedicamentoService } from 'app/shared/services/comum/pedido/medicamento.service';
import { ProcedimentoService } from 'app/shared/services/comum/procedimento.service';
import { ProcessoService } from 'app/shared/services/comum/processo.service';
import { BeneficiarioService, DocumentoPedidoService, SessaoService, SIASCFluxoService } from 'app/shared/services/services';
import { of } from 'rxjs';
import { CadastroDependenteComponent } from './cadastro-dependente.component';
import { AtendimentoService } from 'app/shared/services/comum/atendimento.service';
import { Usuario } from 'app/shared/models/entidades';

describe('CadastroDependenteComponent', () => {
  let component: CadastroDependenteComponent;
  let fixture: ComponentFixture<CadastroDependenteComponent>;

  const messageServiceSpy = jasmine.createSpyObj('MessageService', ['getDescription']);
  const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['snapshot']);
  activatedRouteSpy.snapshot = {
    params: {
      id: null
    }
  }
  const processoServiceSpy = jasmine.createSpyObj('ProcessoService', ['getProcesso']);
  const beneficiarioServiceSpy = jasmine.createSpyObj('BeneficiarioService',['consultarBeneficiarioPorId','consultarFamiliaPorMatricula']);
  beneficiarioServiceSpy.consultarFamiliaPorMatricula.and.returnValue(of({}))
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
