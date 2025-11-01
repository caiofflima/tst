import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MessageService} from "../../../services/services";
import {BaseSelectComponent} from "../base-input.component";
import {SituacaoProcesso} from "../../../models/comum/situacao-processo";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";
import {isUndefinedNullOrEmpty} from "../../../constantes";
import { SituacaoProcessoService } from 'app/shared/services/comum/situacao-processo.service';

@Component({
    selector: 'asc-select-situacao-processo',
    templateUrl: 'asc-select.component.html'
})
export class AscSelectSituacaoProcessoComponent extends BaseSelectComponent<SituacaoProcesso> implements OnInit {

    constructor(
        override readonly messageService: MessageService,
        override readonly changeDetectorRef: ChangeDetectorRef,
        private readonly service: SituacaoProcessoService) {
        super(messageService, changeDetectorRef, (sp: SituacaoProcesso) => sp.nome, (sp: SituacaoProcesso) => sp.id);
    }

    protected override carregarListOperator(): Observable<SituacaoProcesso[]> {
        let operation: Observable<SituacaoProcesso[]>;
        operation = this.service.consultarTodos();

        return operation.pipe(this.defaultMessageWheNotFoundSituacaoProcesso());
    }

    private defaultMessageWheNotFoundSituacaoProcesso(): (source: Observable<SituacaoProcesso[]>) => Observable<SituacaoProcesso[]> {
        return (source: Observable<SituacaoProcesso[]>): Observable<SituacaoProcesso[]> => source.pipe(tap((tipos: SituacaoProcesso[]) => {
            if (isUndefinedNullOrEmpty(tipos))
                this.messageService.addMsgDanger('Não foi encontrando nenhum processo');
        }))
    }
}
