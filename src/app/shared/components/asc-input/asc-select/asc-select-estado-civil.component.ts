import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MessageService} from "../../../services/services";
import {BaseSelectComponent} from "../base-input.component";
import {EstadoCivil} from "../../../models/comum/estado-civil";
import {Observable} from 'rxjs';
import {tap} from "rxjs/operators";
import {isUndefinedNullOrEmpty} from "../../../constantes";
import { EstadoCivilService } from 'app/shared/services/comum/estado-civil.service';

type FuncaoValor = (td: EstadoCivil) => any;

@Component({
    selector: 'asc-select-estado-civil',
    templateUrl: 'asc-select.component.html'
})
export class AscSelectEstadoCivilComponent extends BaseSelectComponent<EstadoCivil> implements OnInit {

    constructor(
        override readonly messageService: MessageService,
        override readonly changeDetectorRef: ChangeDetectorRef,
        private readonly service: EstadoCivilService) {
        super(messageService, changeDetectorRef, (td: EstadoCivil) => td.descricao, (td: EstadoCivil) => td.id);
    }

    public carregarListaTodas(fValor?: FuncaoValor): void {
        this.carregarLista(this.service.consultarTodos(), fValor);
    }

    protected override carregarListOperator(): Observable<EstadoCivil[]> {
        let operation: Observable<EstadoCivil[]> = this.service.consultarTodos();
        return operation.pipe(this.defaultMessageWheNotFoundEstadoCivil());
    }

    private defaultMessageWheNotFoundEstadoCivil(): (source: Observable<EstadoCivil[]>) => Observable<EstadoCivil[]> {
        return (source: Observable<EstadoCivil[]>): Observable<EstadoCivil[]> => source.pipe(tap((tipos: EstadoCivil[]) => {
            if (isUndefinedNullOrEmpty(tipos))
                this.messageService.addMsgDanger('Não foi encontrando nenhum tipo dependente');
        }))
    }

}
