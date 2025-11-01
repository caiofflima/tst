import {Component, Input} from "@angular/core";
import {ProcessoDTO} from "../../../shared/models/dtos";
import {BaseComponent} from "../../../shared/components/base.component";
import {MessageService, ProcessoService, SessaoService, SIASCFluxoService} from "../../../shared/services/services";
import {Data} from "../../../shared/providers/data";
import {Router} from "@angular/router";
import * as constantes from "../../../../app/shared/constantes";

@Component({
    selector: 'app-resultado-pesquisa-processos-credenciado',
    templateUrl: './resultado-pesquisa-processos-credenciado.component.html',
    styleUrls: ['./resultado-pesquisa-processos-credenciado.component.scss']
})
export class ResultadoPesquisaProcessosCredenciadoComponent extends BaseComponent {

    @Input("resultado")
    resultado: ProcessoDTO[] = [];
    @Input("minhasSolicitacoes")
    minhasSolicitacoes: boolean;
    @Input("paginatorEnabled")
    paginatorEnabled: boolean;
    @Input("home")
    home: boolean;
    @Input("hideGlobalFilter")
    hideGlobalFilter: boolean;
    rowCounter: number = 10;
    mensagemPaginacao: string;
    static currentCredenciado: number;

    constructor(
        override readonly messageService: MessageService,
        private readonly siascFluxoService: SIASCFluxoService,
        private readonly data: Data,
        private readonly router: Router,
        private readonly sessaoService: SessaoService,
        private readonly processoService: ProcessoService
    ) {
        super(messageService);
        this.paginatorEnabled = true;
        this.home = false;
    }

    onPageChange(e): void {
        this.mensagemPaginacao = constantes.getPaginationMessage(e, this.resultado);
    }

    get hideGF(): boolean {
        return this.hideGlobalFilter || this.home;
    }

    public detalharProcesso(row: ProcessoDTO): void {
        this.siascFluxoService.consultarPermissoesFluxoPorPedido(row.idPedido).subscribe(res => {
            if (res.acessar) {
                this.data.storage = {
                    pedido: {id: row.idPedido, tipoProcesso: row.idTipoProcesso},
                    permissoesProcesso: res
                };
                let urlVoltar = '/home';
                if (!this.home) {
                    urlVoltar = '/pesquisar-processos-credenciado/home' + (this.minhasSolicitacoes ? '/' + this.minhasSolicitacoes : '');
                }
                this.router.navigateByUrl('/acesso-credenciados/pedidos/detalhar/' + btoa(urlVoltar));
            } else {
                this.showDangerMsg('MA001');
            }
        }, error => this.showDangerMsg(error.error));
    }

    public hasResultado(): boolean {
        return (this.resultado) && this.resultado.length > 0;
    }

    get totalSize(): number {
        return (this.resultado) ? this.resultado.length : 0;
    }

    public atualizarListaProcessos(idCredenciado: number, maxResults?: number, navigateTo?: string): void {
        this.resultado = [];
        let idOperador = this.sessaoService.getUsuario()!.dadosPrestadorExterno.id;
        if ((maxResults) && maxResults > 0) {
            this.processoService.consultarProcessosNaoConclusivosPorOperadorCredenciado(idOperador, idCredenciado, maxResults).subscribe((next:ProcessoDTO[]) => this.resultado = next);
        } else {
            this.processoService.consultarRecentesPorOperadorCredenciado(idOperador, idCredenciado).subscribe((next:ProcessoDTO[]) => this.resultado = next);
        }
        if (navigateTo && navigateTo.length > 0) {
            this.router.navigateByUrl(navigateTo);
        }
        ResultadoPesquisaProcessosCredenciadoComponent.currentCredenciado = idCredenciado;
    }
}
