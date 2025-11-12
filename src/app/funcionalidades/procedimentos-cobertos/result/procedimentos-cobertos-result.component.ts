import {Component, ViewChild} from '@angular/core';
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
import { ProcedimentoService } from 'app/shared/services/services';
import { Procedimento } from 'app/shared/models/entidades';

@Component({
    selector: 'app-procedimentos-cobertos-result',
    templateUrl: './procedimentos-cobertos-result.component.html',
    styleUrls: ['./procedimentos-cobertos-result.component.scss']
})
export class ProcedimentosCobertosResultComponent extends BaseComponent {
    
    @ViewChild('caixaTableProcedimentosCobertosResult')caixaTableProcedimentosCobertosResult:any
    id: number;
    loading = false;
    listaTotal: number = 0;
    idTipoProcesso: number = null;
    procedimentos: Procedimento[];
    descricaoTiposProcesso: string;
    registrosSelecionados: any[] = [];
  
    constructor(
        override readonly messageService: MessageService,
        private readonly router: Router,
        private readonly location: Location,
        private readonly procedimentoService: ProcedimentoService,
        private readonly route: ActivatedRoute
    ) {
       super(messageService);
    }


    ngOnInit(): void {
        this.idTipoProcesso = this.route.snapshot.queryParams['tiposProcesso'];
        this.descricaoTiposProcesso = this.route.snapshot.queryParams['descricaoTiposProcesso'] || 'Todas';
        
        if (this.idTipoProcesso) {

            this.pesquisar();
        }
    }

    public pesquisar(): void {
        this.loading = true;

        this.procedimentoService.consultarProcedimentosPorTipoProcesso(this.idTipoProcesso, null, false).subscribe(res =>{
                this.listaTotal = res.total;
                this.procedimentos = res.map(p => ({
                    ...p,
                    noTipoProcesso: this.descricaoTiposProcesso,
                }));
                this.loading = false;
            }, (err) => {
                this.messageService.addMsgDanger(err.error);
                this.loading = false;
            });
    }

    public voltar(): void {
        this.location.back();
    }
        applyGlobalFilter(evento:Event){
        const input = evento.target as HTMLInputElement
        const value = input.value
        this.caixaTableProcedimentosCobertosResult.filterGlobal(value,'contains')
    }

}
