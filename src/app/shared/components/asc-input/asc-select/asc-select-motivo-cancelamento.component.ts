import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MessageService} from "../../../services/services";
import {BaseSelectComponent} from "../base-input.component";
import {MotivoCancelamento} from "../../../models/comum/motivo-cancelamento";
import {Observable} from 'rxjs';
import {tap} from "rxjs/operators";
import {isUndefinedNullOrEmpty} from "../../../constantes";
import { MotivoCancelamentoService } from 'app/shared/services/comum/motivo-cancelamento.service';

type FuncaoValor = (b: MotivoCancelamento) => any;

@Component({
    selector: 'asc-select-motivo-cancelamento',
    templateUrl: 'asc-select.component.html'
})
export class AscSelectMotivoCancelamentoComponent extends BaseSelectComponent<MotivoCancelamento> implements OnInit {

    constructor(
        override readonly messageService: MessageService,
        override readonly changeDetectorRef: ChangeDetectorRef,
        private readonly service: MotivoCancelamentoService
    ) {
        super(messageService, changeDetectorRef, (mc: MotivoCancelamento) => mc.descricao, (mc: MotivoCancelamento) => mc.id);
    }

    public carregarListaTodas(fValor?: FuncaoValor): void {
        this.carregarLista(this.service.consultarTodos(), fValor);
    }

    protected override carregarListOperator(): Observable<MotivoCancelamento[]> {
        let operation: Observable<MotivoCancelamento[]>;
        operation = this.service.consultarTodos();

        return operation.pipe(this.defaultMessageWheNotFoundMotivoCancelamento());
    }

    private defaultMessageWheNotFoundMotivoCancelamento(): (source: Observable<MotivoCancelamento[]>) => Observable<MotivoCancelamento[]> {
        return (source: Observable<MotivoCancelamento[]>): Observable<MotivoCancelamento[]> => source.pipe(tap((tipos: MotivoCancelamento[]) => {
            if (isUndefinedNullOrEmpty(tipos))
                this.messageService.addMsgDanger('Não foi encontrando nenhum motivo cancelamento');
        }))
    }
}
