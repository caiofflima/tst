import {Component, forwardRef} from '@angular/core';
import {TipoOcorrencia} from "../../../models/dto/tipo-ocorrencia";
import {BaseSelectControlValueAcessor} from "../models/base-select-control-value-acessor";
import {TipoAcaoService} from "../models/tipo-acao-service";
import {TipoAcaoDoService} from "../models/tipo-acao-do-service";
import {Observable} from "rxjs";
import {TipoOcorrenciaService} from "../../../services/comum/tipo-ocorrencia.service";
import {MessageService} from "../../../services/services";
import {SelectItem} from "primeng/api";
import {NG_VALUE_ACCESSOR} from "@angular/forms";

type TipoAcaoComBackend = TipoAcaoService<TipoOcorrenciaService,
    TipoAcaoDoService<any, TipoOcorrencia>>;

@Component({
    selector: 'asc-select-tipo-ocorrencia',
    templateUrl: './asc-select-tipo-ocorrencia.component.html',
    styleUrls: ['./asc-select-tipo-ocorrencia.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => AscSelectTipoOcorrenciaComponent),
        multi: true,
    }],
})
export class AscSelectTipoOcorrenciaComponent
    extends BaseSelectControlValueAcessor<TipoOcorrencia, any, TipoAcaoComBackend> {

    constructor(private service: TipoOcorrenciaService, protected msgService: MessageService) {
        super(msgService);
    }

    override getServiceObservable(p?: any): Observable<TipoOcorrencia[]> {
        return this.service.consultarTiposOcorrenciaManuais();
    }

    transformarObjetosParaSelectItems(data: TipoOcorrencia[]): SelectItem[] {
        return data.map(to => ({label: to.nome, value: to}));
    }

}
