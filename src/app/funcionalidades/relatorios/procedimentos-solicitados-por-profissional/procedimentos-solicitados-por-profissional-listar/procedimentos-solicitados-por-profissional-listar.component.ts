import {
    FiltroRelatorioProcedimentosSolicitadosPorProfissional
} from 'app/shared/models/filtro/filtro-relatorio-procedimentos-solicitados-por-profissional';
import {FiltroRelatorioAnalitico} from 'app/shared/models/filtro/filtro-relatorio-analitico';
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MessageService, ProcessoService, SIASCFluxoService} from 'app/shared/services/services';
import {PermissoesSituacaoProcesso} from 'app/shared/models/fluxo/permissoes-situacao-processo';
import {Data} from 'app/shared/providers/data';
import {PageRequest} from 'app/shared/components/page-request';
import {ProcessoDTO} from 'app/shared/models/dtos';
import {BaseComponent} from 'app/shared/components/base.component';
import * as constantes from 'app/shared/constantes';

@Component({
    selector: 'app-procedimentos-solicitados-por-profissional-listar',
    templateUrl: 'procedimentos-solicitados-por-profissional-listar.component.html',
    styleUrls: ['procedimentos-solicitados-por-profissional-listar.component.scss']
})
export class RelatorioProcedimentosSolicitadosPorProfissionalListarComponent extends BaseComponent implements OnInit {

    permissoesProcesso: PermissoesSituacaoProcesso;
    filtro: FiltroRelatorioProcedimentosSolicitadosPorProfissional;
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

        this.filtro = new FiltroRelatorioProcedimentosSolicitadosPorProfissional()

        if (this.data.storage) {
            this.filtro = this.data.storage.filtro;

            if (this.data.storage.pageable) {
                this.listaProcessos = this.data.storage.pageable;
                this.listaTotal = this.data.storage.pageable.length;
            }
        }
    }

    ngOnInit() {
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

    paginate($event) {

        this.processoService.consultarPaginado(this.filtro, new PageRequest($event.page, $event.rows)).subscribe(res => {
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


    exportarPDFRelatorioProcedimentosSolicitadosPorProfissional() {
        this.processoService.exportarPDFRelatorioProcedimentosSolicitadosPorProfissional(this.listaProcessos).subscribe((fileByteArray: any) => {

            let blob = new Blob([fileByteArray], {type: 'application/pdf'});

            let a = document.createElement('a');

            a.href = window.URL.createObjectURL(blob);
            a.download = 'relatorio-procedimentos-solicitados-por-profissional.pdf';

            document.body.appendChild(a);

            a.click();

            document.body.removeChild(a);
        }, () => {
            this.showDangerMsg('MA00Q');
        });
    }

    exportarXLSRelatorioProcedimentosSolicitadosPorProfissional() {
        this.processoService.exportarXLSRelatorioProcedimentosSolicitadosPorProfissional(this.listaProcessos).subscribe((fileByteArray: any) => {

            let blob = new Blob([fileByteArray], {type: 'application/vnd.ms-excel'});

            let a = document.createElement('a');

            a.href = window.URL.createObjectURL(blob);
            a.download = 'relatorio-procedimentos-solicitados-por-profissional.xls';

            document.body.appendChild(a);

            a.click();

            document.body.removeChild(a);
        }, () => {
            this.showDangerMsg('MA00Q');
        });
    }

    exportarCSVRelatorioProcedimentosSolicitadosPorProfissional() {
        this.processoService.exportarCSVRelatorioProcedimentosSolicitadosPorProfissional(this.listaProcessos).subscribe((fileByteArray: any) => {

            let blob = new Blob([fileByteArray], {type: 'text/csv'});

            let a = document.createElement('a');

            a.href = window.URL.createObjectURL(blob);
            a.download = 'relatorio-procedimentos-solicitados-por-profissional.csv';

            document.body.appendChild(a);

            a.click();

            document.body.removeChild(a);
        }, () => {
            this.showDangerMsg('MA00Q');
        });
    }


    retornarConsulta() {
        this.router.navigateByUrl('/relatorios/procedimentos-solicitados-por-profissional');
    }

    onPageChange(e): void {
        this.mensagemPaginacao = constantes.getPaginationMessage(e, this.listaProcessos);
    }

    consultarRelatorioAnalitico() {

        if (this.listaProcessos.length > 0) {
            let filtroRelatorioOrigem: FiltroRelatorioProcedimentosSolicitadosPorProfissional = this.data.storage.filtro;
            let filtroRelAnaliticoDest: FiltroRelatorioAnalitico = new FiltroRelatorioAnalitico();
            let filtroRelAnalitico: FiltroRelatorioAnalitico = Object.assign(filtroRelAnaliticoDest, filtroRelatorioOrigem);
            filtroRelAnalitico.relatorioOrigem = "PROCEDIMENTOS_SOLICITADOS_POR_PROFISSIONAL";

            this.processoService.consultarRelatorioAnaliticoProcedimentosSolicitadosPorProfissional(filtroRelAnalitico).subscribe(res => {
                const voltar = '/relatorios/procedimentos-solicitados-por-profissional';
                this.data.storage = {
                    pageable: res,
                    filtro: filtroRelAnalitico,
                    voltar: voltar
                };

                this.router.navigateByUrl('/relatorios/analitico/lista');

            }, err => this.showDangerMsg(err.error));

        }
    }
}
