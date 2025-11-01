import {Component, Input, OnInit, ViewChild} from "@angular/core";
import {BaseComponent} from "../../../app/shared/components/base.component";
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService} from "../../../app/shared/components/messages/message.service";
import {AscVisDadosProcessoComponent} from "../../../app/shared/components/pedido/vis-dados-processo/vis-dados-processo.component";
import {ProcessoService} from "../../../app/shared/services/comum/processo.service";
import {BeneficiarioService} from "../../../app/shared/services/comum/beneficiario.service";
import {SituacaoPedidoService} from "../../../app/shared/services/comum/situacao-pedido.service";
import {MotivoSolicitacaoService} from "../../../app/shared/services/comum/motivo-solicitacao.service";
import {SIASCFluxoService} from "../../../app/shared/services/comum/siasc-fluxo.service";
import {PermissoesSituacaoProcesso} from "../../../app/shared/models/fluxo/permissoes-situacao-processo";
import {Pedido} from "../../../app/shared/models/comum/pedido";
import {Data} from "../../../app/shared/providers/data";

const tiposPedido = {
  autorizacaoPrevia: {id: 1, idsTiposProcesso: [1, 2, 3, 4]},
  reembolso: {id: 7, idsTiposProcesso: [5]}
};

@Component({
  selector: 'app-processos',
  templateUrl: 'processos.component.html',
  styleUrls: ['processos.component.scss']
})
export class ProcessosComponent extends BaseComponent implements OnInit {

  @ViewChild('visDadosProcesso')
  visDadosProcesso: AscVisDadosProcessoComponent;

  @Input('pedido')
  public pedido: Pedido;

  @Input('titular')
  public titular: any;

  public permissoesProcesso: PermissoesSituacaoProcesso;
  public beneficiario: any;
  tipoProcesso: any;
  motivoSolicitacao: any;
  situacaoPedido: any;
  voltarPara: string;

  constructor(protected override messageService: MessageService, private route: ActivatedRoute,
              private siascFluxoService: SIASCFluxoService, private processoService: ProcessoService,
              private beneficiarioService: BeneficiarioService, private motivoSolicitacaoService: MotivoSolicitacaoService,
              private situacaoPedidoService: SituacaoPedidoService, private router: Router, private data: Data) {
    super(messageService);
  }

  public ngOnInit() {
    this.route.params.subscribe(
      param => {
        this.voltarPara = param['origem'];
      }
    );
    if (!this.data.storage || !this.data.storage.pedido || !this.data.storage.pedido.id) {
      this.voltarProcessos();
    } else {
      let idPedido = this.data.storage.pedido.id;
      let paramPermissoes = this.data.storage.permissoesProcesso;
      if (paramPermissoes) {
        this.permissoesProcesso = paramPermissoes;
        if (this.permissoesProcesso.acessar) {
          this.carregarDadosProcesso(idPedido);
        }
      } else {
        this.validarPermissoesAndCarregarDadosProcesso(idPedido);
      }
    }
  }

  public configurarDadosTitular(): void {
    this.beneficiarioService.consultarTitularPorIdPedido(this.pedido.id).subscribe(res => {
      this.titular = res;
    }, err => this.showDangerMsg(err.error));
  }

  public isAutorizacaoPrevia(): boolean {
    return this.checkTipoPedido(tiposPedido.autorizacaoPrevia.idsTiposProcesso);
  }

  public isMeusProcessos(): boolean {
    return this.voltarPara == 'meusProcessos';
  }

  public isReembolso(): boolean {
    return this.checkTipoPedido(tiposPedido.reembolso.idsTiposProcesso);
  }

  public atualizarSituacaoProcesso(idPedido: number): void {
    if (this.visDadosProcesso) {
      this.visDadosProcesso.atualizarInformacoes(idPedido);
    }
  }

  private voltarProcessos(): void {
    this.router.navigateByUrl(atob(this.voltarPara));
  }

  private validarPermissoesAndCarregarDadosProcesso(idPedido: number): void {
    this.siascFluxoService.consultarPermissoesFluxoPorPedido(idPedido).subscribe(res => {
      this.permissoesProcesso = res;
      if (!this.permissoesProcesso.acessar) {
        this.router.navigateByUrl('/home');
        this.showDangerMsg('MA001');
      } else {
        this.carregarDadosProcesso(idPedido);
      }
    }, () => {
      this.voltarProcessos();
    });
  }

  private carregarDadosProcesso(idPedido: number): void {
    this.processoService.consultarPorId(idPedido).subscribe(res => {
      this.pedido = res;
      this.situacaoPedido = this.pedido.ultimaSituacao;
      this.tipoProcesso = this.pedido.tipoProcesso;
      this.configurarDadosTitular();
      if (!this.isAutorizacaoPrevia()) {
        this.beneficiarioService.consultarBeneficiarioPorId(this.pedido.idBeneficiario).subscribe(res => {
          this.beneficiario = res;
        });
      }
      this.motivoSolicitacaoService.get(this.pedido.idMotivoSolicitacao).subscribe(res => {
        this.motivoSolicitacao = res;
      }, error => this.showDangerMsg(error.error));
    });
  }

  private checkTipoPedido(idsTiposProcesso: number[]): boolean {
    let flg = false;
    if (idsTiposProcesso) {
      if (this.pedido && this.pedido.idTipoProcesso) {
        flg = idsTiposProcesso.indexOf(this.pedido.idTipoProcesso) != -1;
      }
    }
    return flg;
  }
}
