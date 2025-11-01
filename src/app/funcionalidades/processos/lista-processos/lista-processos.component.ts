import { Component, ViewChild, ViewEncapsulation } from "@angular/core";
import { NavigationEnd, NavigationStart, Router } from "@angular/router";
import { BaseComponent } from "app/shared/components/base.component";
import { MessageService } from "app/shared/components/messages/message.service";
import { ProcessoService } from "app/shared/services/comum/processo.service";
import { ProcessoDTO } from "../../../shared/models/dto/processo";
import {
  isTipoProcessoAdesao,
  isTipoProcessoAltearDependente,
  istipoProcessoAutorizacaoPrevia,
  isTipoProcessoCancelamentoDependente,
  isTipoProcessoInscricaoDependente,
  isTipoProcessoInscricaoProgramas,
  isTipoProcessoReembolsoById,
  isTipoProcessoRenovacaoDependente,
} from "../../../shared/components/asc-pedido/models/tipo-processo.enum";
import { isNotUndefinedNullOrEmpty } from "../../../shared/constantes";
import { FormControl } from "@angular/forms";
import { take, takeUntil } from "rxjs/operators";
import { Pageable } from "../../../shared/components/pageable.model";
import { Pedido } from "../../../shared/models/comum/pedido";
import { SessaoService } from "../../../arquitetura/shared/services/seguranca/sessao.service";
import { Paginator } from "primeng/paginator";
import { DatePipe, Location } from "@angular/common";
import { AtendimentoService } from "../../../shared/services/comum/atendimento.service";
import { Loading } from "app/shared/components/loading/loading-modal.component";

@Component({
  selector: "app-pesquisar-processos-listar",
  templateUrl: "./lista-processos.component.html",
  styleUrls: ["./lista-processos.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ListaProcessosComponent extends BaseComponent {
  filtroRapido: FormControl;
  processosBeneficiario: ProcessoDTO[];
  TipoProcesso: any[];
  total: number = 0;
  rows: number = 10;
  lastPage: any = null;
  timestamp = 0;
  valorFiltro: string = "";
  mensagemResultadoConsultaPedidos: string = null;
  sortedColumn: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  private dados: any[];
  private lastNavigationId = null;
  private readonly camposFiltro = [
    "idPedido",
    "codTipoProcesso",
    "descTipoBeneficiario",
    "filial",
    "idFilial",
    "descBeneficiario",
    "descSituacaoPedido",
    "dataUltimaAlteracao",
  ];

  @ViewChild("paginator")
  paginator: Paginator;

  constructor(
    override readonly messageService: MessageService,
    private readonly location: Location,
    private readonly router: Router,
    private readonly processoService: ProcessoService,
    private readonly atendimentoService: AtendimentoService
  ) {
    super(messageService);
    this.filtroRapido = new FormControl();
    this.TipoProcesso = [
      { label: "Fisioterápica (APR-FIS)", value: "Fisioterápica" },
      { label: "Médica (APR-MED)", value: "Médica" },
      { label: "Odontológica (APR-ODT)", value: "Odontológica" },
      { label: "PAD (APR-PAD)", value: "PAD" },
    ];

    router.events
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((event: NavigationStart) => {
        if (event.id != this.lastNavigationId) {
          this.lastNavigationId = event.id;

          if (event instanceof NavigationEnd) {
            this.pesquisar();
            const loadingModal = document.querySelector<any>("#loading-modal");
            loadingModal.style.display = "";
          }
        }
      });
  }

  isLoading: boolean = false;
  public initLoading() {
    this.isLoading = true;
    Loading.start();
  }
  
  public filtrar(): void {
    const listaFiltrada = this.dados.filter(this.filtrarLista);

    // Recalcula o total da paginação.
    this.total = listaFiltrada.length;

    let start = this.lastPage * this.rows;
    if (start > this.total) {
      start = this.total;
    }

    let end = start + this.rows;
    if (end > this.total) {
      end = this.total;
    }

    // Filtrar o resultado.
    this.processosBeneficiario = listaFiltrada
      .slice(start, end)
      .filter(this.filtrarLista);
  }

  private filtrarLista = (value: ProcessoDTO): boolean => {
    if (this.valorFiltro) {
      const datePipe = new DatePipe("pt-BR");
      const filtro = this.valorFiltro.toUpperCase();
      for (let key of Object.keys(value)) {
        if (this.camposFiltro.includes(key, 0) && value[key]) {
          let v = value[key].toString().toUpperCase();
          if (key === "dataUltimaAlteracao") {
            v = datePipe.transform(
              value.dataUltimaAlteracao,
              "dd/MM/yyyy HH:mm:ss"
            );
          }

          if (v.includes(filtro)) {
            return true;
          }
        }
      }

      return false;
    }

    return true;
  };

  private definirRotasAcompanhamento(
    idPedido: number,
    idTipoProcesso: number
  ): string {
    const dictionaryRoutesAcompanhamento = [
      {
        predicate: istipoProcessoAutorizacaoPrevia,
        route: `/meus-dados/pedidos/${idPedido}/autorizacao-previa/acompanhamento`,
      },
      {
        predicate: isTipoProcessoReembolsoById,
        route: `/meus-dados/pedidos/${idPedido}/reembolso/acompanhamento`,
      },
      {
        predicate: isTipoProcessoInscricaoProgramas,
        route: `/pedidos/inscricao/programas-medicamentos/${idPedido}/acompanhamento`,
      },
      {
        predicate: isTipoProcessoInscricaoDependente,
        route: `/dependente/${idPedido}/acompanhamento`,
      },
      {
        predicate: isTipoProcessoRenovacaoDependente,
        route: `/renovar-dependente/${idPedido}/acompanhamento`,
      },
      {
        predicate: isTipoProcessoCancelamentoDependente,
        route: `/cancelar-dependente/${idPedido}/acompanhamento`,
      },
      {
        predicate: isTipoProcessoAltearDependente,
        route: `/dependente/alterar/${idPedido}/acompanhamento`,
      },
      {
        predicate: isTipoProcessoAdesao,
        route: `/meus-dados/pedidos/${idPedido}/adesao/acompanhamento`,
      },
    ];

    const routerAcompanhamento = dictionaryRoutesAcompanhamento.find(
      (register) => register.predicate(idTipoProcesso)
    );
    if (isNotUndefinedNullOrEmpty(routerAcompanhamento)) {
      return routerAcompanhamento.route;
    }

    return "/pedidos/autorizacao-previa";
  }

  async detalharProcesso(row: ProcessoDTO) {
    const url = this.definirRotasAcompanhamento(
      row.idPedido,
      row.idTipoProcesso
    );
    await this.router.navigateByUrl(url);
  }

  onChangePaginator(event): void {
    const { page } = event;
    this.lastPage = page;
    this.filtrar();
  }

  carregarMensagemLoaging(): void {
    if (this.processosBeneficiario === null || this.processosBeneficiario === undefined) {
      this.mensagemResultadoConsultaPedidos = null;
    } else if (this.total === 0) {
      this.mensagemResultadoConsultaPedidos = "Não há pedidos cadastrados para beneficiários desta família";
    } else {
      this.mensagemResultadoConsultaPedidos = null;
    }
  }

  async pesquisar(): Promise<void> {
    this.carregarMensagemLoaging();
    this.isLoading = true;
    const atendimento: any = await this.atendimentoService
      .get()
      .toPromise()
      .catch((error) => this.messageService.addMsgDanger(error.error));
    if (atendimento) {
      AtendimentoService.atendimento = atendimento;
      AtendimentoService.changed.next(atendimento);
    }

    const matricula = SessaoService.getMatriculaFuncional();
    const familia = sessionStorage.getItem("familia");

    const currentTime = new Date().getTime();

    if(this.isFamiliaMulticontrato(familia)){
      this.processoService
      .consultarPorMatriculaFamiliaTitular(matricula, familia)
      .pipe(take<Pageable<Pedido>>(1))
      .subscribe(
        (res) => {
          if (currentTime > this.timestamp) {
            this.timestamp = currentTime;
            this.dados = res.dados;
            this.total = res.total;
            this.filtrar();
          }
          this.carregarMensagemLoaging();
        },
        (error) => {
          this.showWarningMsg(error.error);
        },
        () => {
          this.isLoading = false;
        }
      );
    } else {
      this.processoService
      .consultarPorMatriculaTitular(matricula)
      .pipe(take<Pageable<Pedido>>(1))
      .subscribe(
        (res) => {
          if (currentTime > this.timestamp) {
            this.timestamp = currentTime;
            this.dados = res.dados;
            this.total = res.total;
            this.filtrar();
          }
          this.carregarMensagemLoaging();
        },
        (error) => {
          this.showWarningMsg(error.error);
        },
        () => {
          this.isLoading = false;
        }
      ); 
    }
  }

  filtroEvent(): void {
    this.valorFiltro = this.filtroRapido.value;
    this.lastPage = 0;
    this.paginator.changePage(this.lastPage);
    this.filtrar();
  }

  ordenarListaPorCampo(campo: string): void {
    if (this.sortedColumn === campo) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortedColumn = campo;
      this.sortOrder = 'asc';
    }

    this.dados.sort((a, b) => {
      if (a[campo] < b[campo]) {
        return this.sortOrder === 'asc' ? -1 : 1;
      }
      if (a[campo] > b[campo]) {
        return this.sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });

    this.lastPage = 0;
    this.paginator.changePage(this.lastPage);

    this.filtrar();
  }

  isSorted(campo: string, ordem?: 'asc' | 'desc'): boolean {
    if (ordem) {
      return this.sortedColumn === campo && this.sortOrder === ordem;
    }
    return this.sortedColumn === campo;
  }

  voltar(): void {
    this.location.back();
  }

  isFamiliaMulticontrato(familia: string): boolean {
    let resultado: boolean;
    if(familia != null) {
      if(familia.trim() === "") {
        resultado = false;
      } else {
        resultado = true;
      }
    } else {
      resultado = false;
    }
    return resultado;
  }
}
