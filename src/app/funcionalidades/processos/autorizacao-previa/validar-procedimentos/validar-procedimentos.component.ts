import {Component, EventEmitter, Output} from '@angular/core';
import {SelectItem} from 'primeng/api';
import {BaseComponent} from '../../../../shared/components/base.component';
import {MessageService} from '../../../../shared/components/messages/message.service';
import {MotivoNegacaoService} from '../../../../shared/services/comum/motivo-negacao.service';
import {
    SituacaoPedidoProcedimentoService
} from '../../../../shared/services/comum/situacao-pedido-procedimento.service';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AscValidators} from '../../../../shared/validators/asc-validators'
import * as constantes from '../../../../shared/constantes';
import {take} from "rxjs/operators";
import {SituacaoPedidoProcedimento} from "../../../../shared/models/dto/situacao-pedido-procedimento";

@Component({
    selector: 'asc-validar-procedimentos',
    templateUrl: 'validar-procedimentos.component.html',
    styleUrls: ['validar-procedimentos.component.scss']
})
export class ValidarProcedimentosComponent extends BaseComponent {

    @Output('onUpdate')
    emitter: EventEmitter<any>;
    ultimaSituacao: any;
    possivelAutorizar: boolean;
    pedidoProcedimento: any;
    display: boolean = false;
    form: FormGroup;
    itensMotivoNegacao: SelectItem[];
    idTipoProcesso: number;

    constructor(private fb: FormBuilder, protected override messageService: MessageService,
                private motivoNegacaoService: MotivoNegacaoService, private situacaoPedidoProcedimentoService: SituacaoPedidoProcedimentoService) {
        super(messageService);
        this.emitter = new EventEmitter<any>();
        this.itensMotivoNegacao = [];
        this.initForm();
    }

    get idMotivoNegacao(): AbstractControl {
        return this.form.get('idMotivoNegacao');
    }

    get idPedidoProcedimento(): AbstractControl {
        return this.form.get('idPedidoProcedimento');
    }

    get qtdAutorizada(): AbstractControl {
        return this.form.get('qtdAutorizada');
    }

    get validado(): boolean {
        return this.pedidoProcedimento ? this.pedidoProcedimento.validado : false;
    }

    get headerText(): string {
        let bText = 'Validar ';
        if (this.validado) {
            bText = 'Detalhar ';
        }
        return bText + 'Procedimento';
    }

    override get constantes(): any {
        return constantes;
    }

    public atualizarItensMotivoNegacao(): void {
        this.motivoNegacaoService.consultarMotivosNegacaoProcedimentoPorPedido(this.pedidoProcedimento.idPedido).subscribe(res => {
            this.itensMotivoNegacao = [];
            for (let mn of res) {
                this.itensMotivoNegacao.push({label: mn.titulo, value: mn.id});
            }
        }, error => this.showDangerMsg(error.error));
    }

    public show(pedidoProcedimento: any, possivelAutorizar: boolean = false) {
        this.pedidoProcedimento = pedidoProcedimento;
        this.possivelAutorizar = possivelAutorizar;
        if (pedidoProcedimento) {
            if (!pedidoProcedimento.validado) {
                this.form.reset();
                this.idPedidoProcedimento.setValue(pedidoProcedimento.id);
                this.atualizarItensMotivoNegacao();
                this.display = true;
            } else {
                this.situacaoPedidoProcedimentoService.consultarUltimaSituacaoPedidoProcedimento(pedidoProcedimento.id).pipe(
                    take<SituacaoPedidoProcedimento>(1)
                ).subscribe(res => {
                    this.ultimaSituacao = res;
                    if (!constantes.isUndefinedOrNull(this.ultimaSituacao.pedido)) {
                        this.idTipoProcesso = this.ultimaSituacao.pedido.idTipoProcesso;
                    } else if (!constantes.isUndefinedOrNull(this.ultimaSituacao.pedidoProcedimento)
                        && !constantes.isUndefinedOrNull(this.ultimaSituacao.pedidoProcedimento.pedido)) {
                        this.idTipoProcesso = this.ultimaSituacao.pedidoProcedimento.pedido.idTipoProcesso;
                    }
                }, error => this.messageService.addMsgDanger(error.error));
                this.display = true;
            }
        } else {
            this.display = false;
        }
    }

    public enviarValidacao(): void {

        if (this.form.valid) {
            if (this.dadosValidos()) {
                this.situacaoPedidoProcedimentoService.post(this.form.value).subscribe(() => {
                    this.emitter.emit();
                    this.showSuccessMsg('MA00I');
                }, error => {
                    this.emitter.emit();
                    this.showDangerMsg(error.error);
                });
                this.display = false;
            } else {
                this.showDangerMsg('MA012');
                this.validateAllFormFields(this.form);
            }
        } else {
            this.showDangerMsg('MA007');
            this.validateAllFormFields(this.form);
        }
    }

    public isAutorizacaoODT(): boolean {
        return constantes.tipoProcesso.autorizacaoPrevia.isODT(this.idTipoProcesso);
    }

    private configurarMotivoNegacao(): void {
        let flg = true;
        if (this.pedidoProcedimento) {
            if (this.qtdAutorizada != undefined && this.qtdAutorizada.value != undefined
                && this.qtdAutorizada.value.length > 0) {
                flg = this.qtdAutorizada.value >= this.pedidoProcedimento.qtdSolicitada;
            }
        }
        this.atualizarValidadoresMotivoNegacao(flg);
    }

    private atualizarValidadoresMotivoNegacao(disabled: boolean) {
        if (disabled) {
            this.idMotivoNegacao.disable();
            this.idMotivoNegacao.reset();
            this.idMotivoNegacao.setValidators([]);
        } else {
            this.idMotivoNegacao.enable();
            this.idMotivoNegacao.setValidators([Validators.required]);
            this.atualizarItensMotivoNegacao();
        }
        this.idMotivoNegacao.updateValueAndValidity();
    }

    private initForm(): void {
        this.form = this.fb.group({
            idMotivoNegacao: this.fb.control(''),
            idPedidoProcedimento: this.fb.control('', Validators.required),
            qtdAutorizada: this.fb.control('', [Validators.required, AscValidators.somenteNumeros()])
        });
        this.qtdAutorizada.valueChanges.subscribe(() => {
            if (this.qtdAutorizada.valid)
                this.configurarMotivoNegacao();
        });
    }

    private dadosValidos(): boolean {
        let flg = true;
        let qtdSol = this.pedidoProcedimento.qtdSolicitada;
        let qtdAut = this.qtdAutorizada.value;
        if (qtdAut > qtdSol) {
            flg = false;
            this.showDangerMsg('MA094');
        } else if (qtdAut < qtdSol && !this.idMotivoNegacao.value) {
            flg = false;
            this.showDangerMsg('MA00P');
        }
        return flg;
    }
}
