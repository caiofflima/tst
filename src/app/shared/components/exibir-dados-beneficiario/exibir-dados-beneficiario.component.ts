import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageService } from '../../../../app/shared/components/messages/message.service';
import { Beneficiario } from '../../../../app/shared/models/comum/beneficiario';
import * as constantes from '../../../../app/shared/constantes';

@Component( {
    selector: 'asc-exibir-dados-beneficiario',
    templateUrl: './exibir-dados-beneficiario.component.html',
    styleUrls: ['./exibir-dados-beneficiario.component.scss']
} )
export class AscExibirDadosBeneficiarioComponent {

    @Input()
    beneficiario: Beneficiario;

    constructor( protected messageService: MessageService ) {

    }


}
