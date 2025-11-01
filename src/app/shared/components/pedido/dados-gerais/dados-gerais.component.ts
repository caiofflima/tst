import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, AbstractControl, FormControl, FormBuilder, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { ComponentePedidoComponent } from '../../../../../app/shared/components/pedido/componente-pedido.component';
import { CaraterSolicitacaoService } from '../../../../../app/shared/services/comum/carater-solicitacao.service';
import { ComposicaoPedidoService } from '../../../../../app/shared/services/components/composicao-pedido.service';
import { Pedido } from '../../../../../app/shared/models/comum/pedido';
import { Data } from '../../../../../app/shared/providers/data';
import * as constantes from '../../../../../app/shared/constantes';
import {MessageService} from '../../../../../app/shared/components/messages/message.service';

@Component( {
    selector: 'asc-dados-gerais',
    templateUrl: './dados-gerais.component.html',
    styleUrls: ['./dados-gerais.component.scss']
} )
export class AscDadosGeraisComponent extends ComponentePedidoComponent implements OnInit {

    @Input( 'form' )
    form: FormGroup;
    @Input( 'itensCaracteresSolicitacao' )
    itensCaracteresSolicitacao: SelectItem[];

    constructor( private fb: FormBuilder, protected override messageService: MessageService, protected override composicaoPedidoService: ComposicaoPedidoService,
        protected override router: Router, protected override data: Data, private caraterSolicitacaoService: CaraterSolicitacaoService ) {
        super( messageService, composicaoPedidoService, router, data );
    }

    get email(): AbstractControl {
        return this.form.get( 'email' );
    }

    get telefoneContato(): AbstractControl {
        return this.form.get( 'telefoneContato' );
    }

    get observacao(): AbstractControl {
        return this.form.get( 'observacao' );
    }

    get idCaraterSolicitacao(): AbstractControl {
        return this.form.get( 'idCaraterSolicitacao' );
    }

    override ngOnInit() {
        console.log('ngOnInit');
    }

    public somenteNumeros(): RegExp {
        return constantes.regExp.somenteNumeros;
    }

    public onBlurTelefone( control: AbstractControl ): void {
        this.formatarTelefone( control );
    }
    public onFocusTelefone( control: AbstractControl ): void {
        control.setValue( constantes.somenteNumeros( control.value ) );
    }
    public keyUpTelefone(): void {
        this.verificarDigitacaoTelefone();
    }
    public keyDownTelefone(): void {
        this.verificarDigitacaoTelefone();
    }

    private verificarDigitacaoTelefone() {
        let value = this.telefoneContato.value;
        this.telefoneContato.setValue( constantes.somenteNumeros( value ) );
    }

    private formatarTelefone( control: AbstractControl ): void {
        let value: string = control.value;
        if ( value ) {
            value = constantes.formatarTelefone( value );
            control.setValue( value );
        }
    }
    
    override get constantes(): any {
        return constantes;
    }
}
