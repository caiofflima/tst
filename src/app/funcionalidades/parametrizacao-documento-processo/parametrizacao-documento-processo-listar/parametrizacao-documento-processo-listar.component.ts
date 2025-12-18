import {Component,ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {take} from "rxjs/operators";
import {Location} from "@angular/common";

import {FiltroDocumentoProcesso} from "../../../shared/models/filtro/filtro-documento-processo";
import {DocumentoTipoProcessoService} from "../../../shared/services/comum/documento-tipo-processo.service";
import {BaseComponent} from "../../../shared/components/base.component";
import {MessageService} from "../../../shared/components/messages/message.service";
import {DocumentoTipoProcesso} from "../../../shared/models/dto/documento-tipo-processo";
import {Pageable} from "../../../shared/components/pageable.model";
import {NumberUtil} from "../../../shared/util/number-util";
import {ArrayUtil} from "../../../shared/util/array-util";

@Component({
    selector: 'asc-parametrizacao-documento-processo-listar',
    templateUrl: './parametrizacao-documento-processo-listar.component.html',
    styleUrls: ['./parametrizacao-documento-processo-listar.component.scss']
})
export class ParametrizacaoDocumentoProcessoListarComponent extends BaseComponent {

    @ViewChild('caixaTableParametrizacaoDocumentoProcessoListar')caixaTableParametrizacaoDocumentoProcessoListar:any

    id: number;
    isRetorno: boolean = false;
    loading = false;
    listaTotal: number = 0;
    filtro = new FiltroDocumentoProcesso();
    listaDocumentoProcesso: DocumentoTipoProcesso[];
    descricaoSexo: string;
    descricaoDocumentos: string;
    descricaoEstadoCivil: string;
    descricaoTiposProcesso: string;
    descricaoTiposBeneficiario: string;
    descricaoMotivosDeSolicitacao: string;

    constructor(
        override readonly messageService: MessageService,
        private readonly router: Router,
        private readonly location: Location,
        private readonly serviceDocumentoProcesso: DocumentoTipoProcessoService,
        private readonly route: ActivatedRoute
    ) {
        super(messageService);
        this.id = this.route.snapshot.queryParams['id'];
        this.isRetorno = this.route.snapshot.queryParams['isRetorno'];
        this.retornaValorFiltro();
    }

    private retornaValorFiltro(): void {
        this.filtro.id = this.id;
        this.filtro.sexo = ArrayUtil.get<string>(this.route.snapshot.queryParams['sexo']);
        this.filtro.obrigatorio = this.obterParametroBooleano(this.route.snapshot.queryParams['obrigatorio']);
        this.filtro.documentos = NumberUtil.getArrayBySymbol(this.route.snapshot.queryParams['documentos'], ",");
        this.filtro.somenteAtivos = this.obterParametroBooleano(this.route.snapshot.queryParams['somenteAtivos']);
        this.filtro.estadoCivil = NumberUtil.getArrayBySymbol(this.route.snapshot.queryParams['estadoCivil'], ",");
        this.filtro.tiposProcesso = NumberUtil.getArrayBySymbol(this.route.snapshot.queryParams['tiposProcesso'], ",");
        this.filtro.tiposBeneficiario = NumberUtil.getArrayBySymbol(this.route.snapshot.queryParams['tiposBeneficiario'], ",");
        this.filtro.motivosDeSolicitacao = NumberUtil.getArrayBySymbol(this.route.snapshot.queryParams['motivosDeSolicitacao'], ",");
        this.descricaoSexo = this.route.snapshot.queryParams['descricaoSexo'] || 'Todas';
        this.descricaoDocumentos = this.route.snapshot.queryParams['descricaoDocumentos'] || 'Todas';
        this.descricaoEstadoCivil = this.route.snapshot.queryParams['descricaoEstadoCivil'] || 'Todas';
        this.descricaoTiposProcesso = this.route.snapshot.queryParams['descricaoTiposProcesso'] || 'Todas';
        this.descricaoTiposBeneficiario = this.route.snapshot.queryParams['descricaoTiposBeneficiario'] || 'Todas';
        this.descricaoMotivosDeSolicitacao = this.route.snapshot.queryParams['descricaoMotivosDeSolicitacao'] || 'Todas';
    }

    private obterParametroBooleano(valor: any): boolean {
        if (valor === null || valor === undefined) {
            return null;
        }
        if (valor === 'true' || valor === true) {
            return true;
        }
        if (valor === 'false' || valor === false) {
            return false;
        }
        return null;
    }

    ngOnInit(): void {
        this.pesquisaInicial();
    }

    public pesquisaInicial(): void {
        this.loading = true;
        this.serviceDocumentoProcesso.consultarPorFiltro(this.filtro, null, null).pipe(
            take<Pageable<DocumentoTipoProcesso>>(1)
        ).subscribe(res => {
            this.listaTotal = res.total;
            this.listaDocumentoProcesso = res.dados.map(d => ({
                ...d,
                documento: d.documento,
                idEstadoCivil: d.idEstadoCivil,
                descricaoInativo: this.getTextoByBoolean(d.inativo),
                descricaoObrigatorio: this.getTextoByBoolean(d.obrigatorio),
                sexo: d.sexo ? d.sexo == 'M' ? 'Masculino' : 'Feminino' : null
            }));

            if(this.isRetorno){
                this.listaTotal = 1;
                this.listaDocumentoProcesso = [ this.listaDocumentoProcesso[0] ];
                this.isRetorno = false;
            }
        
            this.loading = false;
        }, err => {
            this.showDangerMsg(err.error);
            this.loading = false;
        } );
    }

    getTextoByBoolean(valor:any):string{
        return valor ? 'Sim' : 'Não';
    }

    public pesquisar($event): void {
        this.loading = true;

        this.serviceDocumentoProcesso.consultarPorFiltro(this.filtro, $event.rows, $event.first).pipe(
            take<Pageable<DocumentoTipoProcesso>>(1)
        ).subscribe(res => {
            this.listaTotal = res.total;
            this.listaDocumentoProcesso = res.dados.map(d => ({
                ...d,
                documento: d.documento,
                idEstadoCivil: d.idEstadoCivil,
                descricaoInativo: d.inativo ? 'Sim' : 'Não',
                descricaoObrigatorio: d.obrigatorio ? 'Sim' : 'Não',
                sexo: d.sexo ? d.sexo == 'M' ? 'Masculino' : 'Feminino' : null
            }));
            this.loading = false;
        }, err => {
            this.showDangerMsg(err.error);
            this.loading = false;
        } );
        
    }

    public novo(): void {
        this.router.navigateByUrl('/manutencao/parametros/documento-pedido/novo');
    }

    public editar(documentoTipoProcesso: DocumentoTipoProcesso): void {
        this.router.navigateByUrl('manutencao/parametros/documento-pedido/editar/' + documentoTipoProcesso.id+'/'+documentoTipoProcesso.idTipoProcesso);
    }

    public voltar(): void {
        this.location.back();
    }

    applyGlobalFilter(evento:Event){
        const input = evento.target as HTMLInputElement
        const value = input.value
        this.caixaTableParametrizacaoDocumentoProcessoListar.filterGlobal(value,'contains')
    }
    
}
