import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FinalidadeFormModel} from '../models/finalidade-form-model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TipoProcesso} from '../../../../shared/models/comum/tipo-processo';
import {MotivoSolicitacao} from '../../../../shared/models/comum/motivo-solicitacao';
import {TipoBuscaProcesso} from '../../../../shared/models/tipo-busca-processo';
import {take} from "rxjs/operators";
import {TipoBuscaMotivoSolicitacao} from "../../../../shared/models/tipo-busca-motivo-solicitacao";
import {MessageService} from "../../../../shared/components/messages/message.service";
import {aplicarAcaoQuandoFormularioValido} from "../../../../shared/constantes";
import {Subject, Subscription} from "rxjs";
import { AutorizacaoPreviaService, SessaoService } from '../../../../../app/shared/services/services';
import { Pedido } from '../../../../../app/shared/models/entidades';
import {CdkStepper} from "@angular/cdk/stepper";

@Component({
    selector: 'app-finalidade-beneficiario',
    templateUrl: './finalidade-beneficiario.component.html',
    styleUrls: ['./finalidade-beneficiario.component.scss']
})
export class FinalidadeBeneficiarioComponent implements OnInit, OnDestroy {

    @Output()
    readonly beneficiario = new EventEmitter<FinalidadeFormModel>();

    @Output()
    readonly tipoProcesso = new EventEmitter<TipoProcesso>();

    @Output()
    readonly motivoSolicitacao = new EventEmitter<MotivoSolicitacao>();

    @Output()
    readonly pedido = new EventEmitter<Pedido>();

    @Input() set idBeneficiario(idBeneficiario: number) {
        if (this._idBeneficiario !== idBeneficiario) {
            this.finalidadeForm.get('idTipoProcesso').setValue(null);
        }
        this._idBeneficiario = idBeneficiario;
    }

    @Input()
    checkRestart: Subject<void>;

    @Input()
    stepper: CdkStepper;

    private eventsSubscription: Subscription;

    tipoProcessoEntidade: TipoProcesso = null;

    _motivoSolicitacao: MotivoSolicitacao;
    private _idBeneficiario: number;

    readonly finalidadeForm = new FormGroup({
        idTipoProcesso: new FormControl(null, [Validators.required]),
        idMotivoSolicitacao: new FormControl(null, [Validators.required]),
    });

    readonly CARREGAR_POR_TIPO_PROCESSO = TipoBuscaMotivoSolicitacao.CARREGAR_LISTA_POR_TIPO_PROCESSO;
    readonly CONSULTAR_TIPO_PROCESSO_AUTORIZACAO_PREVIA = TipoBuscaProcesso.CONSULTAR_TIPO_PROCESSO_AUTORIZACAO_PREVIA;
    readonly CONSULTAR_TIPO_PROCESSO_AUTORIZACAO_PREVIA_NOVO_PEDIDO = TipoBuscaProcesso.CONSULTAR_TIPO_PROCESSO_AUTORIZACAO_PREVIA_NOVO_PEDIDO;

    constructor(
        private messageService: MessageService, 
        private autorizacaoPreviaService: AutorizacaoPreviaService,
        private sessaoService: SessaoService
    ) {
    }

    ngOnInit(): void {
        this.finalidadeForm.get('idTipoProcesso').valueChanges.pipe(
            take(1)
        ).subscribe(() => {
            const idMotivoSolicitacao = this.finalidadeForm.get('idMotivoSolicitacao');
            idMotivoSolicitacao.setValue(null);
            idMotivoSolicitacao.markAsUntouched();
        }, error => this.messageService.addMsgDanger(error.error));

        this.eventsSubscription = this.checkRestart.subscribe(() => {
            this.finalidadeForm.reset();
        });
    }

    ngOnDestroy() {
        this.eventsSubscription.unsubscribe();
    }


    get idBeneficiario() {
        return this._idBeneficiario;
    }

    onSubmit(): void {
        aplicarAcaoQuandoFormularioValido(this.finalidadeForm,
            (value: FinalidadeFormModel) => {
                this.beneficiario.emit(value);
                this.tipoProcesso.emit(this.tipoProcessoEntidade);
                this.motivoSolicitacao.emit(this._motivoSolicitacao);
                
                if (this.tipoProcessoEntidade.id === 4) {
                    let pedido: any = {
                        beneficiario: {id: this.idBeneficiario},
                        tipoProcesso: this.tipoProcessoEntidade,
                        idMotivoSolicitacao: this._motivoSolicitacao.id
                    };

                    this.autorizacaoPreviaService.incluirPedidoModoRascunho(pedido).subscribe( res => {
                        console.log('Pedido');
                        console.log(res);
                        this.pedido.emit(res);
                    }, (err) => {
    
                       this.messageService.addMsgDanger(err.message);
                    });
                }
                this.stepper?.next();
            },
        );
    }

    previousStep(): void {
        this.stepper?.previous();
    }

    tipoProcessoSelecionado(tipoProcesso: TipoProcesso) {
        this.tipoProcessoEntidade = tipoProcesso;
    }

    motivoSolicitacaoSelecionado(motivoSolicitacao: MotivoSolicitacao) {
        this._motivoSolicitacao = motivoSolicitacao;
    }

    onChangeTipo() {
        this.finalidadeForm.get('idMotivoSolicitacao').setValue(null);
    }
}
