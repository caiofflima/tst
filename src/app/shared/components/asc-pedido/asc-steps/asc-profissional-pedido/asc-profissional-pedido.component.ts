import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {ProfissionalFormModel} from "../../models/profissional-form.model";
import {DadoComboDTO} from "../../../../models/dtos";
import {Municipio} from "../../../../models/entidades";
import {AscValidators} from "../../../../validators/asc-validators";
import {aplicarAcaoQuandoFormularioValido} from "../../../../constantes";
import {CdkStepper} from "@angular/cdk/stepper";
import {fadeAnimation} from "../../../../animations/faded.animation";

@Component({
    selector: 'asc-profissional-pedido',
    templateUrl: './asc-profissional-pedido.component.html',
    styleUrls: ['./asc-profissional-pedido.component.scss'],
    animations: [...fadeAnimation]
})
export class AscProfissionalPedidoComponent implements  OnDestroy {

    @Output()
    readonly profissional = new EventEmitter<ProfissionalFormModel>();

    @Output()
    readonly ufEstadoConselho = new EventEmitter<DadoComboDTO>();

    @Output()
    readonly municipioProfissional = new EventEmitter<Municipio>();

    @Output()
    readonly conselhoProfissionalSelecionado = new EventEmitter<DadoComboDTO>();

    @Input()
    stepper: CdkStepper;

    @Input() set dadosIniciais(dados: ProfissionalFormModel) {
        if (dados && (dados.idConselhoProfissional || dados.numeroConselho || dados.idEstadoConselho)) {
            this.form.patchValue(dados);
            this.changeDetectorRef.detectChanges();
        }
    }

    private _pedidoProcedimentoVersao: number;

    @Input()
    set pedidoProcedimentoVersao(versao: number) {
        if (this._pedidoProcedimentoVersao != versao) {
            this.form.reset();
            this.changeDetectorRef.detectChanges();
        }

        this._pedidoProcedimentoVersao = versao;
    }

    readonly form = this.formBuilder.group({
        idConselhoProfissional: [null, [Validators.required]],
        numeroConselho: [null, [Validators.required, Validators.maxLength(10)]],
        idEstadoConselho: [null, [Validators.required]]
    });

    private readonly unsubscribeSubject = new Subject<void>();

    constructor(
        private readonly formBuilder: FormBuilder,
        readonly changeDetectorRef: ChangeDetectorRef
    ) {
    }

    onSubmit() {
        aplicarAcaoQuandoFormularioValido(this.form, () => {
            const profissionalFormModel = this.form.value as ProfissionalFormModel;
            this.profissional.emit(profissionalFormModel);
        });
    }

    ngOnDestroy() {
        this.unsubscribeSubject.next();
        this.unsubscribeSubject.complete();
    }

    ufEstadoConselhoSelecionado(ufEstadoConselho: DadoComboDTO) {
        this.ufEstadoConselho.emit(ufEstadoConselho);
    }

    municipioProfissionalSelecionado(municipio: Municipio) {
        this.municipioProfissional.emit(municipio);
    }

    conselhoSelecionado(conselho: DadoComboDTO) {
        this.conselhoProfissionalSelecionado.emit(conselho);
        this.changeDetectorRef.detectChanges();
    }

    buttonToNext(): void {
        if (this.form.valid) {
            this.stepper.next();
            this.onSubmit();
        }
    }

    buttonToPrevious(): void {
        this.stepper.previous();
    }
}

