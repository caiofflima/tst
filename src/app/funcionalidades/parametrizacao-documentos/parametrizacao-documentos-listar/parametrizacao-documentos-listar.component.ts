import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TipoDocumento} from "../../../shared/models/comum/tipo-documento";
import {FiltroConsultaDocumento} from "../../../shared/models/filtro/filtro-consulta-documento";
import {DocumentoService} from "../../../shared/services/comum/documento.service";
import {Documento} from "../../../shared/models/comum/documento";
import {MessageService} from "../../../shared/components/messages/message.service";
import {BaseComponent} from "../../../shared/components/base.component";
import {take} from "rxjs/operators";
import {Location} from "@angular/common";

class ResultadoPesquisa {
    tipoDocumento: TipoDocumento
    nome: string;
    descricao: string;
    opme: string;
    inativo: string;
}

@Component({
    selector: 'asc-parametrizacao-documentos-listar',
    templateUrl: './parametrizacao-documentos-listar.component.html',
    styleUrls: ['./parametrizacao-documentos-listar.component.scss'],
})
export class ParametrizacaoDocumentosListarComponent extends BaseComponent implements OnInit {
    @ViewChild('caixaTableParametrizacaoDocumentosListar')caixaTableParametrizacaoDocumentosListar:any
    filtroDocumento: FiltroConsultaDocumento;
    listaDocumento: ResultadoPesquisa[];
    documento: string;
    loading = false;

    constructor(
        override readonly messageService: MessageService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly documentoService: DocumentoService,
        private readonly router: Router,
        private readonly location: Location
    ) {
        super(messageService);
    }

    ngOnInit(): void {
        this.pesquisar();
    }


    applyGlobalFilter(evento:Event){
        const input = evento.target as HTMLInputElement
        const value = input.value
        this.caixaTableParametrizacaoDocumentosListar.filterGlobal(value,'contains')
    }
    

    private montaFiltro(): FiltroConsultaDocumento {
        this.filtroDocumento = new FiltroConsultaDocumento();

        this.documento = this.activatedRoute.snapshot.queryParams['documento'];
        this.filtroDocumento.id = this.activatedRoute.snapshot.queryParams['id'];
        this.filtroDocumento.idTipoDocumento = this.activatedRoute.snapshot.queryParams['idTipoDocumento'];
        this.filtroDocumento.nome = this.activatedRoute.snapshot.queryParams['nome'];
        this.filtroDocumento.opme = this.activatedRoute.snapshot.queryParams['opme'];
        this.filtroDocumento.ativo = this.activatedRoute.snapshot.queryParams['ativo'];
        this.filtroDocumento.link = this.activatedRoute.snapshot.queryParams['link'];

        return this.filtroDocumento;
    }

    public pesquisar(): void {
        this.loading = true;
        this.documentoService.consultarPorFiltro(this.montaFiltro()).pipe(
            take<Documento[]>(1)
        ).subscribe(res => {
            this.listaDocumento = res.map(d => ({
                tipoDocumento: d.tipoDocumento,
                nome: d.nome,
                descricao: d.descricao,
                opme: d.opme == "SIM" ? "Sim" : "Não",
                inativo: d.inativo == "SIM" ? "Sim" : "Não",
                id: d.id
            }));
            this.loading = false;
        }, err => {
            this.loading = false;
            this.showDangerMsg(err.error)
        });

    }

    isNaoPossuiFiltros(): boolean {
        return !this.filtroDocumento.idTipoDocumento && !this.filtroDocumento.nome &&
            !this.filtroDocumento.opme && !this.filtroDocumento.ativo && !this.filtroDocumento.link;
    }

    gerarTextoSimNao(dado:any):string{
        let retorno:string = '';

        if(dado!=='' && dado!==null && dado!==undefined){
            if(dado==='S' || dado===true){
                retorno = "Sim";
            }else{
                retorno = "Não";
            }
        }
        return retorno;
    }

    voltar(): void {
        this.location.back();
    }
}
