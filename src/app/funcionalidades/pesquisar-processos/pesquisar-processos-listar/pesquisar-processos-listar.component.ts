import {FiltroConsultaProcesso} from 'app/shared/models/filtro/filtro-consulta-processo';
import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MessageService, ProcessoService, SIASCFluxoService} from 'app/shared/services/services';
import {PermissoesSituacaoProcesso} from 'app/shared/models/fluxo/permissoes-situacao-processo';
import {Data} from 'app/shared/providers/data';
import {PageRequest} from 'app/shared/components/page-request';
import {ProcessoDTO} from 'app/shared/models/dtos';
import {BaseComponent} from 'app/shared/components/base.component';
import * as constantes from 'app/shared/constantes';

@Component({
    selector: 'app-pesquisar-processos-listar',
    templateUrl: 'pesquisar-processos-listar.component.html',
    styleUrls: ['pesquisar-processos-listar.component.scss']
})
export class PesquisarProcessosListarComponent extends BaseComponent implements OnInit {
    @ViewChild('caixaTablePesquisarProcessosListar')caixaTablePesquisarProcessosListar:any
    
    permissoesProcesso: PermissoesSituacaoProcesso;
    filtro: FiltroConsultaProcesso;
    listaProcessos: any[];
    listaTotal: number = 0;
    rowCounter: number = 10;
    mensagemPaginacao: string;

    constructor(
        private data: Data,
        protected override messageService: MessageService,
        private router: Router,
        private processoService: ProcessoService,
        private siascFluxoService: SIASCFluxoService) {

        super(messageService);

        this.filtro = new FiltroConsultaProcesso()

        if (this.data.storage) {
            this.filtro = this.data.storage.filtro;

            if (this.data.storage.pageable) {
                this.listaProcessos = this.data.storage.pageable;
                this.listaTotal = this.data.storage.pageable.length;
            }
        }
    }

    ngOnInit(): void {
        let end = this.rowCounter;
        if (this.listaProcessos) {
            if (this.listaProcessos.length > 0) {
                if (end > this.listaProcessos.length) {
                    end = this.listaProcessos.length;
                }
                this.mensagemPaginacao = 'Mostrando de 1 até ' + end + ' de ' + this.listaProcessos.length + ' registros';
            }
        }
    }
    applyGlobalFilter(evento:Event){
        const input = evento.target as HTMLInputElement
        const value = input.value
        this.caixaTablePesquisarProcessosListar.filterGlobal(value,'contains')
    }

    paginate($event) {
        let page: PageRequest = null;
        if ($event) {
            page = new PageRequest($event.page, $event.rows)
        }

        this.processoService.consultarPaginado(this.filtro, page).subscribe(res => {
            this.listaProcessos = res.dados;
            this.mensagemPaginacao = constantes.getPaginationMessage($event, this.listaProcessos);
        }, err => this.showDangerMsg(err.error));

    }

    mascara(nDoc) {
        if (nDoc.lenght >= 11) {
            return "99.999.999/9999-99";
        } else {
            return "999.999.999-99";
        }
    }

    detalharProcesso(row: ProcessoDTO) {
        this.siascFluxoService.consultarPermissoesFluxoPorPedido(row.idPedido).subscribe(res => {
            this.permissoesProcesso = res;
            if (this.permissoesProcesso.acessar) {
                this.data.storage = {
                    pedido: {id: row.idPedido, tipoProcesso: row.idTipoProcesso},
                    permissoesProcesso: this.permissoesProcesso
                };
                let paramVoltar = btoa('/manutencao/consulta/pedidos');
                this.router.navigateByUrl('/meus-dados/pedidos/detalhar/' + paramVoltar);
            } else {
                this.showDangerMsg('MA001');
            }
        }, error => this.showDangerMsg(error.error));
    }

    retornarConsulta() {
        this.router.navigateByUrl('/manutencao/consulta/pedidos');
    }

    onPageChange(e): void {
        this.mensagemPaginacao = constantes.getPaginationMessage(e, this.listaProcessos);
    }
}
