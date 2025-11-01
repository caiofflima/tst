import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {MessageService} from '../../../services/services';
import {Patologia} from '../../../models/comum/patologia';
import {BaseSelectComponent} from '../base-input.component';
import {Observable} from 'rxjs';
import {AscSelectPatologiaParam} from "../asc-select-patologia.param";
import {tap} from "rxjs/operators";
import {isUndefinedNullOrEmpty} from "../../../constantes";
import { PatologiaService } from 'app/shared/services/comum/patologia.service';

@Component({
    selector: 'asc-select-patologia',
    templateUrl: 'asc-select.component.html'
})
export class AscSelectPatologiaComponent extends BaseSelectComponent<Patologia> implements OnInit {

    constructor(
        override readonly messageService: MessageService,
        override readonly changeDetectorRef: ChangeDetectorRef,
        private readonly patologiaService: PatologiaService
    ) {
        super(messageService, changeDetectorRef, (patologia: Patologia) => patologia.nome, (patologia: Patologia) => patologia.id, '');
    }

    @Input() private _parametro: AscSelectPatologiaParam;

    get parametro(): AscSelectPatologiaParam {
        return this._parametro;
    }

    @Input() set parametro(v: AscSelectPatologiaParam) {
        this._parametro = v;
        this.ngOnInit();
    }

    protected override carregarListOperator(): Observable<Patologia[]> {
        let operation: Observable<Patologia[]>;
        if (this.parametro && this.parametro.idBeneficiario) {
            operation = this.patologiaService.consultarTodasPatologiasEmInscriacaoDeProgramasPor(this.parametro.idBeneficiario);
        } else {
            operation = this.patologiaService.consultarTodos();
        }

        return operation.pipe(this.defaultMessageWheNotFoundPatologia());
    }

    private defaultMessageWheNotFoundPatologia(): (source: Observable<Patologia[]>) => Observable<Patologia[]> {
        return (source: Observable<Patologia[]>): Observable<Patologia[]> => source.pipe(tap((patologias: Patologia[]) => {
            if (isUndefinedNullOrEmpty(patologias))
                this.messageService.addMsgDanger('Não foi encontrando nenhuma patologia para o beneficiário em inscrição de programas');
        }))
    }
}
