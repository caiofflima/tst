import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FiltroDocumentoProcesso} from "../../../shared/models/filtro/filtro-documento-processo";
import {DocumentoTipoProcessoService} from "../../../shared/services/comum/documento-tipo-processo.service";
import {BaseComponent} from "../../../shared/components/base.component";
import {MessageService} from "../../../shared/components/messages/message.service";
import {DocumentoTipoProcesso} from "../../../shared/models/dto/documento-tipo-processo";
import {take} from "rxjs/operators";
import {Pageable} from "../../../shared/components/pageable.model";
import {Location} from "@angular/common";
import {NumberUtil} from "../../../shared/util/number-util";
import {ArrayUtil} from "../../../shared/util/array-util";
import { DuvidasService } from 'app/shared/services/comum/duvidas.service';
import { DocumentosTipoProcessoService } from '../documentos-tipo-processo.service';

@Component({
    selector: 'app-documentos-tipo-processo-result',
    templateUrl: './documentos-tipo-processo-result.component.html',
    styleUrls: ['./documentos-tipo-processo-result.component.scss'],
    providers: [
        DuvidasService,
        DocumentosTipoProcessoService
    ]
})
export class DocumentosTipoProcessoResultComponent extends BaseComponent implements AfterViewInit {
    id: number;
    loading = false;
    listaTotal: number = 0;
    filtro = new FiltroDocumentoProcesso();
    listaDocumentoProcesso: DocumentoTipoProcesso[];
    
    descricaoSexo: string;
    descricaoDocumentos: string;
    descricaoEstadoCivil: string;
    descricaoTiposProcesso: string;
    descricaoTiposBeneficiario: string;
    descricaoMotivoSolicitacao: string;
    descricaoTipoDeficiencia: string;
    public idade: any;
    public valorRenda: any;
    
    @ViewChild('routerDuvidas') routerDuvidas: ElementRef
    private routerDuvidasExists = false;
    
    constructor(
        override readonly messageService: MessageService,
        private readonly router: Router,
        private readonly location: Location,
        private readonly serviceDocumentoProcesso: DocumentoTipoProcessoService,
        private readonly route: ActivatedRoute,
        public readonly duvidasService: DuvidasService,
        public readonly docTpProcService: DocumentosTipoProcessoService  
    ) {
        super(messageService);
        this.id = this.route.snapshot.queryParams['id'];
        this.retornaValorFiltro();
    }
    
    private retornaValorFiltro(): void {
        this.filtro.id = this.id;
        this.filtro.sexo = ArrayUtil.get<string>(this.route.snapshot.queryParams['sexo']);
        this.filtro.idade =  this.route.snapshot.queryParams['idade'];
        this.filtro.idMotivoSolicitacao =  this.route.snapshot.queryParams['idMotivoSolicitacao'];
        this.filtro.idTipoDeficiencia =  this.route.snapshot.queryParams['idTipoDeficiencia'];
        this.filtro.valorRenda =  this.route.snapshot.queryParams['valorRenda'];
        this.filtro.estadoCivil = NumberUtil.getArray(this.route.snapshot.queryParams['estadoCivil']);
        this.filtro.tiposProcesso = NumberUtil.getArray(this.route.snapshot.queryParams['tiposProcesso']);
        this.filtro.tiposBeneficiario = NumberUtil.getArray(this.route.snapshot.queryParams['tiposBeneficiario']);
        this.descricaoSexo = this.route.snapshot.queryParams['descricaoSexo'] || 'Todas';
        this.descricaoEstadoCivil = this.route.snapshot.queryParams['descricaoEstadoCivil'] || 'Todas';
        this.descricaoTiposProcesso = this.route.snapshot.queryParams['descricaoTiposProcesso'] || 'Todas';
        this.descricaoTiposBeneficiario = this.route.snapshot.queryParams['descricaoTiposBeneficiario'] || 'Todas';
        this.descricaoMotivoSolicitacao = this.route.snapshot.queryParams['descricaoMotivoSolicitacao'] || 'Todas';
        this.descricaoTipoDeficiencia = this.route.snapshot.queryParams['descricaoMotivoSolicitacao'] || 'Todas'; 
        this.filtro.somenteAtivos = true;
    }
    
    ngOnInit(): void {
        this.pesquisar();
    }
    
    public pesquisar(): void {
        this.loading = true;
        
        this.serviceDocumentoProcesso.consultarPorFiltro(this.filtro, null, null).pipe(
            take<Pageable<DocumentoTipoProcesso>>(1)
        ).subscribe(res => {
            this.listaTotal = res.total;
            this.listaDocumentoProcesso = res.dados.map(d => ({
                ...d
            }));
            this.loading = false;
        }, err => {
            this.showDangerMsg(err.error);
            this.loading = false;
        } );
    }
    
    public voltar(): void {
        this.location.back();
    }
    
    public isMostrarInfoLabel(): boolean {
        // const idLabel = "router-duvidas";
        // const routeDuvidas = document.getElementById(idLabel).id;
        // return routeDuvidas == idLabel ? false : true;
        return !this.routerDuvidasExists
    }
    
    ngAfterViewInit() {
        // Verificar após a view ser inicializada
        this.routerDuvidasExists = !!this.routerDuvidas;
    }
    
}
