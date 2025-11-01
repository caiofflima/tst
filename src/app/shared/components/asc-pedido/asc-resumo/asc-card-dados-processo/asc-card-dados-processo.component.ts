import {Component, Input} from '@angular/core';
import {TipoProcesso} from "../../../../models/comum/tipo-processo";
import {FinalidadeFormModel} from "../../models/finalidade-form-model";

@Component({
    selector: 'asc-card-dados-processo',
    templateUrl: './asc-card-dados-processo.component.html',
    styleUrls: ['./asc-card-dados-processo.component.scss']
})
export class AscCardDadosProcessoComponent {

    @Input()
    tipoProcesso: TipoProcesso;

    @Input()
    finalidade: FinalidadeFormModel;

}
