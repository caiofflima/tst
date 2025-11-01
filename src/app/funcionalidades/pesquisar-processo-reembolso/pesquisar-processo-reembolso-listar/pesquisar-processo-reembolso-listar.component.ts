
import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseComponent} from 'app/shared/components/base.component';
import {MessageService} from 'app/shared/services/services';
import {take} from "rxjs/operators";

import {FiltroProcessoReembolso} from 'app/shared/models/filtro/filtro-processo-reembolso';
import {ProcessoReembolsoDTO} from "../../../shared/models/dto/processo-reembolso";
import {ProcessoService} from 'app/shared/services/comum/processo.service';
import {Pageable} from "../../../shared/components/pageable.model";
import {Util} from "app/arquitetura/shared/util/util";

@Component({
    selector: 'asc-pesquisar-processo-reembolso-listar',
    templateUrl: './pesquisar-processo-reembolso-listar.component.html',
    styleUrls: ['./pesquisar-processo-reembolso-listar.component.scss']
})
export class PesquisarProcessoReembolsoListarComponent extends BaseComponent implements OnInit {
@ViewChild('caixaTablePesquisarProcessoReembolso')caixaTablePesquisarProcessoReembolso:any
    filtro: FiltroProcessoReembolso;
    dados : ProcessoReembolsoDTO[];
    total : number;
    loading = false;
 
    constructor(
        override readonly messageService: MessageService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly processoService: ProcessoService,
    ) {
        super(messageService);
    }

    ngOnInit() {
        this.pesquisar();
    }    
    applyGlobalFilter(evento:Event){
        const input = evento.target as HTMLInputElement
        const value = input.value
        this.caixaTablePesquisarProcessoReembolso.filterGlobal(value,'contains')
    }

    pesquisar() {
        this.loading = true;
        this.processoService.consultarProcessosReembolso(this.montaFiltro()).pipe(
            take<Pageable<ProcessoReembolsoDTO>>(1)
        ).subscribe(async pageable => {
            this.total = pageable.total;
            this.dados = pageable.dados.map(d => ({
                ...d
            }));
            this.loading = false;
        }, err => {
            this.showDangerMsg(err.error);
            this.loading = false;
        });
    }

    public exportarExcel(){
        const columnNames =  ['Pedido', 'Tipo de Pedido', 'Matrícula', 'UF', 'Data de Abertura', 'Situação', 'Inicio', 'Fim'];
        const ordemColumnNames = ['idPedido', 'descTipoProcesso', 'matricula', 'uf',  'dataAbertura','descSituacaoPedido', 'dataInicio', 'dataFim'];
        const agora = new Date();
        const nomeArquivo = "pedido_reembolso_"+ Util.dateToStringBr(agora);
        this.exportToCSV(this.dados, nomeArquivo, columnNames, ordemColumnNames);
    }

    exportToCSV(data: any[], fileName: string, columnNames: string[], ordemColumnNames: string[])
    {
		const rows = data.map(obj => this.mapObjectToColumn(obj, ordemColumnNames));
		
		const header = columnNames.join(';');
		
        const csv = "\ufeff" + [header, ...rows].join('\n'); /* \ufeff - acrestentado para ativar o charset */
		
        const blob = new Blob([csv], { type: "text/plain; charset=utf-8" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.csv`
        a.click();
        window.URL.revokeObjectURL(url);
    }

    convertToCSV(data: any, columnNames: string[]){
        const header = columnNames.join(';');
        const rows = data.map(obj => this.getObjectValues(obj).join(';'));
        return [header, ...rows].join('\n');
    }

    getObjectValues(obj: any){
        return Object.keys(obj).map(key => obj[key]);
    }

	  mapObjectToColumn(obj:any, columnNames: string[]){
		return columnNames.map(col => obj[col]).join(';');
	  }


    private montaFiltro(): FiltroProcessoReembolso {
        this.filtro = new FiltroProcessoReembolso();
   
        this.filtro.descTipoProcesso = this.route.snapshot.queryParams['descTipoProcesso'] || '';
        this.filtro.idsTipoProcesso = this.route.snapshot.queryParams['idsTipoProcesso'] || null;
        this.filtro.processo = this.route.snapshot.queryParams['processo'] || '';
        this.filtro.descUfsProcesso = this.route.snapshot.queryParams['descUfsProcesso'] || '';
        this.filtro.descEmpresasAuditoria = this.route.snapshot.queryParams['descEmpresasAuditoria'] || '';
        this.filtro.idsUfsProcesso = this.route.snapshot.queryParams['idsUfsProcesso'] || null;
        this.filtro.idsEmpresasAuditoria = this.route.snapshot.queryParams['idsEmpresasAuditoria'] || null;
        this.filtro.dataInicio = this.route.snapshot.queryParams['dataInicio'] || '';
        this.filtro.dataFim = this.route.snapshot.queryParams['dataFim'] || '';

        return this.filtro;
    }

    voltar(): void {
        const queryParams = this.route.snapshot.queryParams;
        this.router.navigate(['/relatorios/pesquisar-pedido-reembolso'], { queryParams} );
    }
}
