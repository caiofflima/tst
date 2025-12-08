import {AfterViewInit, ChangeDetectionStrategy, Component, forwardRef, Input} from '@angular/core';
import {Observable} from 'rxjs';
import {isNotUndefinedNullOrEmpty, isUndefinedNullOrEmpty} from '../../../constantes';
import {Procedimento} from '../../../models/entidades';
import {MessageService, ProcedimentoService} from '../../../services/services';
import {AscSelectComponentProcedimentosParams} from '../models/asc-select-component-procedimentos.params';
import {TipoAcaoService} from '../models/tipo-acao-service';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {BaseSelectControlValueAcessor} from '../models/base-select-control-value-acessor';
import {of} from 'rxjs';
import {TipoAcaoDoService} from "../models/tipo-acao-do-service";
import {SelectItem} from "primeng/api";
import {TipoProcessoEnum} from "../../asc-pedido/models/tipo-processo.enum";

type TipoAcaoComBackend = TipoAcaoService<ProcedimentoService, TipoAcaoDoService<AscSelectComponentProcedimentosParams, Procedimento>>;

@Component({
    selector: 'asc-select-procedimento',
    templateUrl: './asc-select-procedimento.component.html',
    styleUrls: ['./asc-select-procedimento.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => AscSelectProcedimentoComponent),
        multi: true,
    }]
})
export class AscSelectProcedimentoComponent extends BaseSelectControlValueAcessor<Procedimento, AscSelectComponentProcedimentosParams, TipoAcaoComBackend> {

    @Input()
    selectId: string;

    @Input()
    style: string = null;

    texto: string = null;

    constructor(
        private readonly procedimentoService: ProcedimentoService,
        protected override readonly messageService: MessageService,
    ) {
        super(messageService);
    }

    override updateValue(value: any) {
        const normalizedValue = value && typeof value === 'object' && 'value' in value
            ? (value as any).value
            : value;

        console.log('asc-select-procedimento updateValue chamado com:', normalizedValue);
        super.updateValue(normalizedValue);
    }

    override definirServico(): (params: AscSelectComponentProcedimentosParams) => Observable<Procedimento[]> {
        return (params: AscSelectComponentProcedimentosParams) => {
            if (isUndefinedNullOrEmpty(this.tipoAcaoService)) {
                throw new Error('É necessário informar ao menos uma ação para o componente');
            } else if (isUndefinedNullOrEmpty(params) || (isUndefinedNullOrEmpty(params) && isUndefinedNullOrEmpty(params.idTipoProcesso))) {
                return of([]);
            } else if (this.isProcessoLazy(params.idTipoProcesso) && (!params.texto || params.texto.length < 2)) {
                return of<Procedimento[]>([]);
            }

            let param: AscSelectComponentProcedimentosParams = {idTipoProcesso: params.idTipoProcesso, isIndisponibilidadeRedeCredenciada: params.isIndisponibilidadeRedeCredenciada};

            return this.tipoAcaoService.service(this.procedimentoService).action(param);
        };
    }

    override filtrarPor(param: AscSelectComponentProcedimentosParams): boolean {
        return isNotUndefinedNullOrEmpty(param) && isNotUndefinedNullOrEmpty(param.idTipoProcesso);
    }

    filter = (valor: string, tipo: number): void => {
        this.texto = valor;

        if (this.isProcessoLazy(tipo)) {
            this.params.texto = valor;
            this.paramsEmitter.next(this.params);
        }
    }

    //TODO: Remover esse método se não mais necessário
    isProcessoLazy(tipo: number): boolean {
        return false;

       // return tipo == TipoProcessoEnum.REEMBOLSO_CONSULTA
            //|| tipo == TipoProcessoEnum.REEMBOLSO_ASSISTENCIAL
           // || tipo == TipoProcessoEnum.REEMBOLSO_ODONTOLOGICO;
    }

    transformarObjetosParaSelectItems(procedimentos: Procedimento[]) {
        if (procedimentos && procedimentos.length) {
            return procedimentos.map(({id, descricaoProcedimento: d, estruturaNumerica: n}) => ({
                filtering: `${n.replace(/\./gi, '')} ${n} ${d}`,
                description: `<b>${n}</b> – ${d}`,
                label: `${n} – ${d}`,
                value: id,
            }) as SelectItem);
        }
        return [];
    }
}
