import {ActivatedRoute} from '@angular/router';
import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {tap} from "rxjs/operators";

import {MessageService, SessaoService,} from "../../../services/services";
import {BaseSelectComponent} from "../base-input.component";
import {TipoDependente} from "../../../models/comum/tipo-dependente";
import {AscSelectRelacaoDependenteParam} from "../asc-select-relacao-dependente.param";
import {isUndefinedNullOrEmpty} from "../../../constantes";
import { TipoDependenteService } from 'app/shared/services/comum/tipo-dependente.service';

@Component({
    selector: 'asc-select-tipo-dependente',
    templateUrl: 'asc-select.component.html'
})
export class AscSelectTipoDependenteComponent extends BaseSelectComponent<TipoDependente> implements OnInit {

    @Input()
    titular = true;

    @Input()
    inclusao;

    @Input()
    idTipoProcesso: number

    constructor(
        override readonly messageService: MessageService,
        override readonly changeDetectorRef: ChangeDetectorRef,
        private readonly service: TipoDependenteService,
        private route: ActivatedRoute
        ) {
        super(messageService, changeDetectorRef, (td: TipoDependente) => td.descricao, (td: TipoDependente) => td.id);
    }

    @Input()
    private _parametro: AscSelectRelacaoDependenteParam;

    get parametro(): AscSelectRelacaoDependenteParam {
        return this._parametro;
    }

    @Input() set parametro(v: AscSelectRelacaoDependenteParam) {
        this._parametro = v;
        this.ngOnInit();
    }

    protected override carregarListOperator(): Observable<TipoDependente[]> {
        let operation: Observable<TipoDependente[]>;
            if (this.carregarParametro()) {
                const idBeneficiario = this.parametro.id;
                operation = this.service.consultarTodosIdBeneficiario(this.titular, idBeneficiario, this.inclusao);
            } else {
                const matricula: any = SessaoService.getMatriculaFuncional();
                operation = this.service.consultarTodos(this.titular, matricula, this.inclusao,this.idTipoProcesso);
            }
        return operation.pipe(this.defaultMessageWheNotFoundPatologia());
    }

    carregarParametro():number{
        if (this.parametro && this.parametro.id) {
            return this.parametro.id;
        }else{ 
            this.route.params.subscribe(
                (params: any) => {
                    if(params && params['idBeneficiario']){
                        this.parametro.id = params['idBeneficiario'];
                    }
                }
            ); 
        }
        if (this.parametro && this.parametro.id) {
            return this.parametro.id;
        }
        return null;
    }

    private defaultMessageWheNotFoundPatologia(): (source: Observable<TipoDependente[]>) => Observable<TipoDependente[]> {
        return (source: Observable<TipoDependente[]>): Observable<TipoDependente[]> => source.pipe(tap((tipos: TipoDependente[]) => {
            if (isUndefinedNullOrEmpty(tipos))
                this.messageService.addMsgDanger('Não foi encontrando nenhum tipo dependente');
        }))
    }
}
