import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {MessageService} from '../../../services/services';
import {BaseSelectComponent} from '../base-input.component';
import {Observable} from 'rxjs';
import {isUndefinedNullOrEmpty} from '../../../constantes';
import { TipoOcorrenciaService } from 'app/shared/services/comum/tipo-ocorrencia.service';
import { TipoOcorrencia } from 'app/shared/models/entidades';

@Component({
    selector: 'asc-select-tipos-ocorrencia',
    templateUrl: 'asc-select.component.html'
})
export class AscSelectTiposOcorenciaComponent extends BaseSelectComponent<TipoOcorrencia> implements OnInit {

    @Input()
    tipoBusca: TipoOcorrenciaService;

    constructor(
        override readonly messageService: MessageService,
        override readonly changeDetectorRef: ChangeDetectorRef,
        private readonly service: TipoOcorrenciaService,
    ) {
        super(messageService, changeDetectorRef, tp => tp.nome, tp => tp.id, 'Tipo de Processo/Ocorrência');
    }

    protected override carregarListOperator(): Observable<TipoOcorrencia[]> {
        if (isUndefinedNullOrEmpty(this.tipoBusca)) {
            return this.service.consultarTiposOcorrenciaManuais();
        }
        return null;
    }

}
