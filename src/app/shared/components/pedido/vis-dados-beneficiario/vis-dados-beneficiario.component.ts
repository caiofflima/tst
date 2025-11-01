import { Component, Input, OnInit, Output } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { BaseComponent } from '../../../../../app/shared/components/base.component';
import { BeneficiarioService } from '../../../../../app/shared/services/comum/beneficiario.service';
import { MotivoSolicitacaoService } from '../../../../../app/shared/services/comum/motivo-solicitacao.service';
import * as constantes from '../../../../../app/shared/constantes';
import { MessageService } from 'app/shared/services/services';

@Component( {
    selector: 'asc-vis-dados-beneficiario',
    templateUrl: './vis-dados-beneficiario.component.html',
    styleUrls: ['./vis-dados-beneficiario.component.scss']
} )
export class AscVisDadosBeneficiarioComponent extends BaseComponent implements OnInit {

    @Input( 'form' )
    form: FormGroup;
    @Input( 'beneficiario' )
    public beneficiario: any;
    @Input( 'tipoProcesso' )
    tipoProcesso: any;
    @Input( 'motivoSolicitacao' )
    motivoSolicitacao: any;
    itensFinalidade: any[];

    constructor( protected override messageService: MessageService, private beneficiarioService: BeneficiarioService,
        private motivoSolicitacaoService: MotivoSolicitacaoService ) {
        super( messageService );
        this.itensFinalidade = [];
    }

    public ngOnInit(): void {
        if ( this.tipoProcesso ) {
            this.itensFinalidade = [];
        }
    }

    get idMotivoSolicitacao(): AbstractControl {
        return this.form.get( 'idMotivoSolicitacao' );
    }


}
