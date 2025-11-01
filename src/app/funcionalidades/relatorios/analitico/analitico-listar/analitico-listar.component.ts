import {Component, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {MessageService, ProcessoService} from "app/shared/services/services";
import {PermissoesSituacaoProcesso} from "app/shared/models/fluxo/permissoes-situacao-processo";
import {Data} from "app/shared/providers/data";
import {BaseComponent} from "app/shared/components/base.component";
import * as constantes from "app/shared/constantes";
import {Location} from "@angular/common";

@Component({
    selector: 'app-analitico-listar',
    templateUrl: 'analitico-listar.component.html',
    styleUrls: ['analitico-listar.component.scss']
})
export class RelatorioAnaliticoListarComponent extends BaseComponent implements OnInit {

    @ViewChild('caixaTableAnaliticoListar')caixaTableAnaliticoListar:any
    
    permissoesProcesso: PermissoesSituacaoProcesso;
    listaProcessos: any[];
    listaTotal: number = 0;
    rowCounter: number = 100;
    mensagemPaginacao: string;
    tituloRelatorio: string;

    constructor(
        override readonly messageService: MessageService,
        private readonly data: Data,
        private readonly router: Router,
        private readonly processoService: ProcessoService,
        private readonly location: Location
    ) {
        super(messageService);

        if (this.data.storage && this.data.storage.pageable) {
            this.listaProcessos = this.data.storage.pageable.dados;
            this.listaTotal = this.listaProcessos.length;
        }
    }
    applyGlobalFilter(evento:Event){
        const input = evento.target as HTMLInputElement
        const value = input.value
        this.caixaTableAnaliticoListar.filterGlobal(value,'contains')
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
        if (!this.tituloRelatorio || this.tituloRelatorio.length == 0) {
            if (this.data.storage && this.data.storage.tituloRelatorio) {
                this.tituloRelatorio = this.data.storage.tituloRelatorio;
            }
        }
    }

    exportarPDFRelatorioAnalitico() {
        this.processoService.exportarPDFRelatorioAnalitico(this.listaProcessos).subscribe((fileByteArray: any) => {

            let blob = new Blob([fileByteArray], {type: 'application/pdf'});

            let a = document.createElement('a');

            a.href = window.URL.createObjectURL(blob);
            a.download = 'relatorio-pedido-analitico.pdf';

            document.body.appendChild(a);

            a.click();

            document.body.removeChild(a);
        }, () => {
            this.showDangerMsg('MA00Q');
        });
    }

    exportarXLSRelatorioAnalitico() {
        this.processoService.exportarXLSRelatorioAnalitico(this.listaProcessos).subscribe((fileByteArray: any) => {

            let blob = new Blob([fileByteArray], {type: 'application/vnd.ms-excel'});

            let a = document.createElement('a');

            a.href = window.URL.createObjectURL(blob);
            a.download = 'relatorio-pedido-analitico.xls';

            document.body.appendChild(a);

            a.click();

            document.body.removeChild(a);
        }, () => {
            this.showDangerMsg('MA00Q');
        });
    }

    exportarCSVRelatorioAnalitico() {
        this.processoService.exportarCSVRelatorioAnalitico(this.listaProcessos).subscribe((fileByteArray: any) => {

            let blob = new Blob([fileByteArray], {type: 'text/csv'});

            let a = document.createElement('a');

            a.href = window.URL.createObjectURL(blob);
            a.download = 'relatorio-pedido-analitico.csv';

            document.body.appendChild(a);

            a.click();

            document.body.removeChild(a);
        }, () => {
            this.showDangerMsg('MA00Q');
        });
    }

    retornarConsulta() {
        let voltar = this.data.storage.voltar;
        this.router.navigateByUrl(voltar);
    }

    onPageChange(e): void {
        this.mensagemPaginacao = constantes.getPaginationMessage(e, this.listaProcessos);
    }

    voltar(): void {
        this.location.back();
    }
}
