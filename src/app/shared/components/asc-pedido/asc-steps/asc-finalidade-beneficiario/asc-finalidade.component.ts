import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FinalidadeFormModel} from '../../models/finalidade-form-model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TipoBuscaMotivoSolicitacao} from '../../../../models/tipo-busca-motivo-solicitacao';
import {aplicarAcaoQuandoFormularioValido, isNotUndefinedOrNull} from '../../../../constantes';
import {TipoProcesso} from '../../../../models/comum/tipo-processo';
import {MotivoSolicitacao} from '../../../../models/comum/motivo-solicitacao';
import {TipoBuscaProcesso} from '../../../../models/tipo-busca-processo';
import {Subject, Subscription} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {CdkStepper} from "@angular/cdk/stepper";
import {isTipoProcessoReembolsoById} from "../../models/tipo-processo.enum";
import {fadeAnimation} from "../../../../animations/faded.animation";

const ID_TIPO_REEMBOLSO = 9;

@Component({
    selector: 'asc-finalidade-pedido',
    templateUrl: './asc-finalidade.component.html',
    styleUrls: ['./asc-finalidade.component.scss'],
    animations: [...fadeAnimation]
})
export class AscFinalidadeComponent implements OnInit, OnDestroy {

    @Input()
    consultarMotivoSolicitacaoPara = TipoBuscaMotivoSolicitacao.CARREGAR_LISTA_POR_TIPO_PROCESSO;

    @Input()
    consultarTipoProcessoPara = TipoBuscaProcesso.CONSULTAR_TODOS;

    @Input()
    stepper: CdkStepper;

    @Input()
    checkRestart: Subject<void>;

    @Input() set idBeneficiario(idBeneficiario: number) {
        if (this._idBeneficiario !== idBeneficiario) {
            this.finalidadeForm.get('idTipoProcesso').setValue(null);
        }
        this._idBeneficiario = idBeneficiario;
    }

    @Output()
    beneficiario = new EventEmitter<FinalidadeFormModel>();

    @Output()
    tipoProcesso = new EventEmitter<TipoProcesso>();

    tipoProcessoEntidade: TipoProcesso = null;
    loading = false;
    private eventsSubscription: Subscription;

    readonly finalidadeForm = new FormGroup({
        idTipoProcesso: new FormControl(null, [Validators.required]),
        idMotivoSolicitacao: new FormControl(null, [Validators.required]),
        nome: new FormControl(null)
    });

    private readonly unsubscribeSubject = new Subject<void>();
    isReembolso = false;
    private _idBeneficiario: number;

    ngOnInit(): void {
        this.finalidadeForm.get('idTipoProcesso').valueChanges.pipe(
            takeUntil(this.unsubscribeSubject)
        ).subscribe((value) => {
            // Só reseta idMotivoSolicitacao se o valor mudou de um valor existente para outro
            // e não é a emissão inicial do tipoProcessoSelecionado
            if (!this.tipoProcessoEntidade || this.tipoProcessoEntidade.id !== value) {
                const idMotivoSolicitacao = this.finalidadeForm.get('idMotivoSolicitacao');
                if (idMotivoSolicitacao.value !== null) {
                    idMotivoSolicitacao.setValue(null);
                    idMotivoSolicitacao.markAsUntouched();
                }
            }
        });

        this.eventsSubscription = this.checkRestart.subscribe(() => {
            this.finalidadeForm.reset();
            this.tipoProcessoEntidade = null;
            this.isReembolso = false;
        });
    }

    ngOnDestroy(): void {
        this.eventsSubscription.unsubscribe();

        this.unsubscribeSubject.next();
        this.unsubscribeSubject.complete();
    }


    get idBeneficiario() {
        return this._idBeneficiario;
    }

    onSubmit(): void {
        aplicarAcaoQuandoFormularioValido(this.finalidadeForm, (value: FinalidadeFormModel) => {
                this.loading = false;
                this.beneficiario.emit(value);
                this.tipoProcesso.emit(this.tipoProcessoEntidade);
                this.stepper.next();
            },
        );
    }

    finalidadeSelecionado(motivo: MotivoSolicitacao): void {
        console.log("🚀 ~ AscFinalidadeComponent ~ motivo:", motivo)
        if (motivo) {
            this.finalidadeForm.get('nome').setValue(motivo.nome);
        } else {
            this.finalidadeForm.get('nome').setValue(null);
        }
    }

    tipoProcessoSelecionado(tipoProcesso: TipoProcesso) {
        console.log("🚀 ~ AscFinalidadeComponent ~ tipoProcesso:", tipoProcesso)
        if (isNotUndefinedOrNull(tipoProcesso)) {
            this.tipoProcessoEntidade = tipoProcesso;
            this.isReembolso = isTipoProcessoReembolsoById(tipoProcesso.idTipoPedido) || (tipoProcesso && tipoProcesso.idTipoPedido === ID_TIPO_REEMBOLSO);
            if (tipoProcesso.id === 8) {
                this.finalidadeForm.get('idMotivoSolicitacao').setValue(42);
            } else {
                this.finalidadeForm.get('idMotivoSolicitacao').setValue(35);
            }
        } else {
            this.finalidadeForm.get('idMotivoSolicitacao').setValue(null)
        }
    }

    previousStep() {
        this.stepper.previous();
    }
}
