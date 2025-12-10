import {Component, forwardRef, Input} from '@angular/core';
import {MessageService} from "../../messages/message.service";
import {BaseSelectControlValueAcessor} from "../models/base-select-control-value-acessor";
import {Especialidade} from "../../../models/credenciados/especialidade";
import {AscSelectEspecialidadeParam} from "../models/asc-select-especialidade.param";
import {TipoAcaoService} from "../models/tipo-acao-service";
import {TipoAcaoDoService} from "../models/tipo-acao-do-service";
import {EspecialidadeService} from "../../../services/comum/pedido/especialidade.service";
import {SelectItem} from "primeng/api";
import {Observable} from "rxjs";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {isNotUndefinedNullOrEmpty} from "../../../constantes";
import {of} from "rxjs";

type TipoAcaoDePesquisa = TipoAcaoService<EspecialidadeService, TipoAcaoDoService<AscSelectEspecialidadeParam, Especialidade>>;

@Component({
    selector: 'asc-select-especialidade',
    templateUrl: './asc-select-especialidade.component.html',
    styleUrls: ['./asc-select-especialidade.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => AscSelectEspecialidadeComponent),
        multi: true,
    }],
})
export class AscSelectEspecialidadeComponent extends BaseSelectControlValueAcessor<Especialidade, AscSelectEspecialidadeParam, TipoAcaoDePesquisa> {

    @Input()
    selectId: string;

    override updateValue(value: any) {
        const normalizedValue = value && typeof value === 'object' && 'value' in value
            ? (value as any).value
            : value;
        super.updateValue(normalizedValue);
    }

    constructor(
        protected override readonly messageService: MessageService,
        private readonly especialidadeService: EspecialidadeService
    ) {
        super(messageService)
    }

    override definirServico(): (p: AscSelectEspecialidadeParam) => Observable<Especialidade[]> {
        return (param: AscSelectEspecialidadeParam) => {
            if (param.idProcedimento) {
                return this.especialidadeService.carregarPorProcedimento(param.idProcedimento);
            }
            return of([]);

        };
    }

    override filtrarPor(param: AscSelectEspecialidadeParam): boolean {
        return isNotUndefinedNullOrEmpty(param);
    }

    transformarObjetosParaSelectItems(especialidades: Especialidade[]): SelectItem[] {
        return especialidades.map(especialidade => ({
            value: especialidade.id || especialidade.codigo,
            label: especialidade.descricao
        }));
    }

}
