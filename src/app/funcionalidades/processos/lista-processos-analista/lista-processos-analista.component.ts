import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { BaseComponent } from 'app/shared/components/base.component';
import { MessageService } from 'app/shared/components/messages/message.service';
import { SIASCFluxoService } from 'app/shared/services/comum/siasc-fluxo.service';
import { PermissoesSituacaoProcesso } from 'app/shared/models/fluxo/permissoes-situacao-processo';
import { ProcessoService } from 'app/shared/services/comum/processo.service';
import { Data } from 'app/shared/providers/data';
import { ProcessoDTO } from "../../../shared/models/dto/processo";
import {
    isTipoProcessoAltearDependente,
    istipoProcessoAutorizacaoPrevia,
    isTipoProcessoCancelamentoDependente,
    isTipoProcessoInscricaoDependente,
    isTipoProcessoInscricaoProgramas,
    isTipoProcessoReembolsoById,
    isTipoProcessoRenovacaoDependente
} from "../../../shared/components/asc-pedido/models/tipo-processo.enum";
import { isNotUndefinedNullOrEmpty } from "../../../shared/constantes";
import { FiltroConsultaProcesso } from 'app/shared/models/filtro/filtro-consulta-processo';
import { FormControl } from "@angular/forms";
import { debounceTime, distinctUntilChanged, take, takeUntil } from "rxjs/operators";
import { Pageable } from "../../../shared/components/pageable.model";
import { Paginator } from "primeng/paginator";
import { DatePipe, Location } from "@angular/common";
import { Subject } from "rxjs";
import {Util} from "app/arquitetura/shared/util/util";

@Component({
    selector: 'asc-lista-processos-analista',
    templateUrl: './lista-processos-analista.component.html',
    styleUrls: ['./lista-processos-analista.component.scss']
})
export class ListaProcessosAnalistaComponent extends BaseComponent implements OnInit {
    processosAnalista: any[];
    TipoProcesso: any[];
    total: number = 0;
    rows: number = 10;
    filtroRapido: FormControl;
    filtro: FiltroConsultaProcesso;
    permissoesProcesso: PermissoesSituacaoProcesso;
    lastPage: any = null;
    valorFiltro: string = null;
    timestamp = 0;
    valueChange = new Subject<void>();
    sortedColumn: string = 'dataUltimaAlteracao';
    sortOrder: 'asc' | 'desc' = 'asc';

    private dados: any[];
    private lastNavigationId = null;
    private readonly camposFiltro = [
        'idPedido',
        'codTipoProcesso',
        'descTipoBeneficiario',
        'filial',
        'idFilial',
        'descBeneficiario',
        'descSituacaoPedido',
        'dataUltimaAlteracao'
    ];

    @ViewChild('paginator')
    paginator: Paginator;

    constructor(
        override readonly messageService: MessageService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly router: Router,
        private readonly location: Location,
        private readonly data: Data,
        private readonly processoService: ProcessoService,
        private readonly siascFluxoService: SIASCFluxoService
    ) {
        super(messageService);
        this.filtroRapido = new FormControl();
    }

    ngOnInit(): void {
        if (this.data.storage) {
            if (this.data.storage.pageable) {
                this.filtro = this.data.storage.filtro;
                this.total = this.data.storage.pageable.total;
                this.dados = this.data.storage.pageable.dados;
                this.sortAndFilterData(); // Ensure initial sorting
            }
        }

        this.router.events.pipe(takeUntil(this.unsubscribe$)).subscribe((event: NavigationStart) => {
            if (event.id != this.lastNavigationId) {
                this.lastNavigationId = event.id;

                if (event instanceof NavigationEnd) {
                    this.lastPage = null;
                    if (this.filtro && !this.dados) {
                        this.pesquisar();
                    } else if (!this.dados) {
                        this.router.navigate(['/pedidos/pesquisar']).then();
                    }
                }
            }
        });

        this.valueChange.pipe(
            debounceTime<void>(200),
            distinctUntilChanged<void>()
        ).subscribe(() => {
            this.sortAndFilterData();
        })
    }

    private sortAndFilterData(): void {
        this.sortData();
        this.filtrar();
    }

    private sortData(): void {
        this.dados.sort((a, b) => {
            if (a[this.sortedColumn] < b[this.sortedColumn]) {
                return this.sortOrder === 'asc' ? -1 : 1;
            }
            if (a[this.sortedColumn] > b[this.sortedColumn]) {
                return this.sortOrder === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }

    private filtrar = (): void => {
        if (this.dados) {
            const listaFiltrada = this.dados.filter(this.filtrarLista);

            this.total = listaFiltrada.length;

            let start = this.lastPage * this.rows;
            if (start > this.total) {
                start = this.total;
            }

            let end = start + this.rows;
            if (end > this.total) {
                end = this.total;
            }

            this.processosAnalista = listaFiltrada.slice(start, end).filter(this.filtrarLista);
        } else {
            this.processosAnalista = [];
            this.total = 0;
        }
    }

    private filtrarLista = (value: ProcessoDTO): boolean => {

        if (this.valorFiltro) {
            const datePipe = new DatePipe('pt-BR');
            const filtro = this.valorFiltro.toUpperCase();
            for (let key of Object.keys(value)) {
                if (this.camposFiltro.includes(key, 0) && value[key]) {
                    let v = value[key].toString().toUpperCase();
                    if (key === 'dataUltimaAlteracao') {
                        v = datePipe.transform(value.dataUltimaAlteracao, 'dd/MM/yyyy HH:mm:ss');
                    }

                    if (v.includes(filtro)) {
                        return true;
                    }
                }
            }

            return false;
        }

        return true;
    }

    private definirRotasAcompanhamento(idPedido: number, idTipoProcesso: number): string {
        return this.definirRotas(idPedido, idTipoProcesso, "acompanhamento");
    }

    private definirRotasAnalise(idPedido: number, idTipoProcesso: number): string {
        return this.definirRotas(idPedido, idTipoProcesso, "analise");
    }

    private definirRotas(idPedido: number, idTipoProcesso: number, analiseOrAcompanhamento: string): string {
        const dictionaryRoutesAcompanhamento = [{
            predicate: istipoProcessoAutorizacaoPrevia,
            route: `/pedidos/autorizacao-previa/${idPedido}/${analiseOrAcompanhamento}`
        }, {
            predicate: isTipoProcessoReembolsoById,
            route: `/pedidos/reembolso/${idPedido}/${analiseOrAcompanhamento}`
        }, {
            predicate: isTipoProcessoInscricaoProgramas,
            route: `/pedidos/inscricao/programas-medicamentos/${idPedido}/${analiseOrAcompanhamento}`
        }, {
            predicate: isTipoProcessoInscricaoDependente,
            route: `/dependente/${idPedido}/${analiseOrAcompanhamento}`
        }, {
            predicate: isTipoProcessoRenovacaoDependente,
            route: `/dependente/${idPedido}/${analiseOrAcompanhamento}`
        }, {
            predicate: isTipoProcessoCancelamentoDependente,
            route: `/dependente/${idPedido}/${analiseOrAcompanhamento}`
        }, {
            predicate: isTipoProcessoAltearDependente,
            route: `/dependente/${idPedido}/${analiseOrAcompanhamento}`
        }];

        const routerAcompanhamento = dictionaryRoutesAcompanhamento.find(
            register => register.predicate(idTipoProcesso)
        );

        if (isNotUndefinedNullOrEmpty(routerAcompanhamento)) {
            return routerAcompanhamento.route;
        }

        return '/pedidos/autorizacao-previa';
    }

    detalharProcesso(row: ProcessoDTO) {
        const urlAtiva = this.activatedRoute.snapshot['_routerState'].url;
        const toAcompanhar = "meus-dados/pedidos";
        this.siascFluxoService.consultarPermissoesFluxoPorPedido(row.idPedido).subscribe(async res => {
            this.permissoesProcesso = res;
            if (this.permissoesProcesso.acessar) {
                let url;
                if (urlAtiva.includes(toAcompanhar)) {
                    url = this.definirRotasAcompanhamento(row.idPedido, row.idTipoProcesso);
                } else {
                    url = this.definirRotasAnalise(row.idPedido, row.idTipoProcesso);
                }
                await this.router.navigateByUrl(url);
            } else {
                this.showDangerMsg('MA001');
            }
        }, error => this.showDangerMsg(error.error));
    }

    onChangePaginator(event: any): void {
        const { page } = event;
        this.lastPage = page;
        this.filtrar();
    }

    private pesquisar = (): void => {
        const currentTime = new Date().getTime();
        this.processoService.consultar(this.filtro).pipe(
            take<Pageable<ProcessoDTO>>(1)
        ).subscribe(res => {
            if (currentTime > this.timestamp) {
                this.timestamp = currentTime;
                this.dados = res.dados;
                this.total = res.total;

                if (this.total == 0) {
                    this.router.navigate(['/pedidos/pesquisar']).then();
                } else {
                    this.sortAndFilterData();
                }
            }
        }, err => this.showDangerMsg(err.error));
    }

    filtroEvent(): void {
        this.valorFiltro = this.filtroRapido.value;
        this.lastPage = 0;
        this.paginator.changePage(this.lastPage);
        this.valueChange.next();
    }

    ordenarListaPorCampo(campo: string): void {
        if (this.sortedColumn === campo) {
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortedColumn = campo;
            this.sortOrder = 'asc';
        }

        this.sortData();

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

    public exportarCSVRelatorioProcessosAnalista() {

        const columnNames = ['Número do pedido', 'Sigla pedido', 'Descrição Pedido', 'Data/hora de abertura do pedido',
            'Código Motivo', 'Descrição Motivo', 'Tipo de beneficiário', 'Código do beneficiário', 'Nome do beneficiário',
            'Matrícula funcional do titular', 'Agrupadora', 'Código Situação', 'Descrição Situação', 'Data/hora da última atualização',
            'Data Nascimento','CPF','Último Usuário'];

        const ordemColumnNames = ['idPedido', 'codTipoProcesso', 'descPedido', 'dataAberturaPedido',
            'codMotivosolicitacao', 'motivoSolicitacao', 'descTipoBeneficiario', 'codigoBeneficiario', 'descBeneficiario',
            'matriculaFuncional', 'filial', 'idSituacaoProcesso', 'descSituacaoPedido', 'dataUltimaAlteracao', 'dataNascimento', 'cpf', 'matriculaUltimoUsuario'];
        
        let dadosExportar = this.dados.map(item=>({
            ...item, dataNascimento:Util.dateToStringBr(item.dataNascimento), matriculaUltimoUsuario:this.verificarTexto(item.matriculaUltimoUsuario, "SIASC")
        }));
        const agora = new Date();
        const nomeArquivo = "PedidosAnalista"+ Util.dateTimeToStringBr(agora).replace(/\//g,'_').replace(/[\s:]/g,'_');
        this.exportToCSV(dadosExportar, nomeArquivo, columnNames, ordemColumnNames);

    }

    private verificarTexto(texto: string, textoAlternativo:string):string{
        let result = "";
        if(texto !== null && texto !== undefined && texto.length>0){
            result = texto;
        }else{
            if(textoAlternativo !== null && textoAlternativo !== undefined && textoAlternativo.length>0){
                result = textoAlternativo;
            }
        }
        return result;
    }

    exportToCSV(data: any[], fileName: string, columnNames: string[], ordemColumnNames: string[]) {

        const datePipe = new DatePipe('pt-BR');

        const formatData = data.map(dt => ({
            ...dt,
            dataAberturaPedido: datePipe.transform(dt.dataAberturaPedido, 'dd/MM/yyyy HH:mm:ss'),
            dataUltimaAlteracao: datePipe.transform(dt.dataUltimaAlteracao, 'dd/MM/yyyy HH:mm:ss')
        }));

        const rows = formatData.map(obj => this.mapObjectToColumn(obj, ordemColumnNames));

        const header = columnNames.join(';');

        const csv = "\ufeff" + [header, ...rows].join('\n');

        const blob = new Blob([csv], { type: "text/plain; charset=utf-8" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.csv`
        a.click();
        window.URL.revokeObjectURL(url);
    }

    mapObjectToColumn(obj: any, columnNames: string[]) {
        return columnNames.map(col => obj[col]).join(';');
    }
}
