import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {aplicarAcaoQuandoFormularioValido} from '../../../../shared/constantes';
import {ProfissionalFormModel} from '../models/profissional-form.model';
import {DadoComboDTO} from '../../../../shared/models/dto/dado-combo';
import {Municipio} from '../../../../shared/models/comum/municipio';
import {AscValidators} from '../../../../shared/validators/asc-validators';
import {Subject} from 'rxjs';
import {takeUntil} from "rxjs/operators";
import {DocumentoTipoProcesso} from '../../../../shared/models/dto/documento-tipo-processo';
import {CdkStepper} from "@angular/cdk/stepper";

@Component({
    selector: 'app-profissional',
    templateUrl: './profissional.component.html',
    styleUrls: ['./profissional.component.scss'],
})
export class ProfissionalComponent implements OnInit, OnDestroy {

    @Output() readonly profissional = new EventEmitter<ProfissionalFormModel>();
    @Output() readonly ufEstadoConselho = new EventEmitter<DadoComboDTO>();
    @Output() readonly municipioProfissional = new EventEmitter<Municipio>();
    @Output() readonly conselhoProfissionalSelecionado = new EventEmitter<DadoComboDTO>();

    readonly form = this.formBuilder.group({
        idConselhoProfissional: [null, [Validators.required]],
        numeroConselho: [null, [Validators.required]],
        idEstadoConselho: [null, [Validators.required]],
        cpfCnpj: [null, [Validators.required, AscValidators.cpfOuCnpj()]],
        nomeProfissional: [null, [Validators.required]],
        idEstadoProfissional: [null, [Validators.required]],
        idMunicipioProfissional: [null, [Validators.required]],
    });

    private readonly unsubscribeSubject = new Subject<void>();

    constructor(
        private readonly formBuilder: FormBuilder,
    ) {
    }

    private _pedidoProcedimentoVersao: number;
    documentos: DocumentoTipoProcesso[] = [];

    @Input()
    set pedidoProcedimentoVersao(versao: number) {
        if (this._pedidoProcedimentoVersao != versao) {
            this.form.reset();
        }
        this._pedidoProcedimentoVersao = versao;
    }

    @Input() stepper: CdkStepper;

    ngOnInit() {
        this.resetarMunicipioDoProfissionalAposTrocarUf();
    }

    resetarMunicipioDoProfissionalAposTrocarUf() {
        this.form.get('idEstadoProfissional').valueChanges.pipe(
            takeUntil(this.unsubscribeSubject)
        ).subscribe(() => {
            this.form.get('idMunicipioProfissional').reset();
            this.form.get('idMunicipioProfissional').updateValueAndValidity();
        });
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
    }
}
