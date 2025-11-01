import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, AfterViewChecked, Output, ChangeDetectorRef} from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';
import {CdkStepper} from "@angular/cdk/stepper";
import {Subject} from 'rxjs';

import { fadeAnimation } from 'app/shared/animations/faded.animation';
import { DadoComboDTO } from 'app/shared/models/dto/dado-combo';
import { AscValidators } from 'app/shared/validators/asc-validators';
import {TipoDeficiencia} from 'app/shared/models/comum/tipo-deficiencia';
import { ComplementoDependenteFormModel } from 'app/funcionalidades/dependente/models/complemento-dependente.form.model';
import { DadosDependenteFormModel } from 'app/funcionalidades/dependente/models/dados-dependente-form.model';
import { BaseComponent } from 'app/shared/components/base.component';
import {SelectItem} from "primeng/api";
import { Municipio } from 'app/shared/models/entidades';
import { MessageService, TipoDeficienciaService } from 'app/shared/services/services';

@Component({
    selector: 'asc-etapa-complemento-titular',
    templateUrl: './etapa-complemento-titular.component.html',
    styleUrls: ['./etapa-complemento-titular.component.scss'],
    animations: [...fadeAnimation],
    changeDetection: ChangeDetectionStrategy.Default
})
export class EtapaComplementotitularComponent extends BaseComponent implements OnInit, AfterViewChecked {

    @Output()
    readonly complementoDependenteModel = new EventEmitter<ComplementoDependenteFormModel>();

    @Output()
    readonly tipoDeficienciaModel = new EventEmitter<TipoDeficiencia>();

    @Output()
    readonly municipioSelecionado = new EventEmitter<Municipio>();

    @Output()
    readonly ufSelecionada = new EventEmitter<DadoComboDTO>();

    @Input()
    tipoDeficiencia: TipoDeficiencia

    @Input()
    complementoDependente: ComplementoDependenteFormModel

    @Input()
    dadoDependente: DadosDependenteFormModel;

    @Input()
    routerLinkToBack: string

    @Input()
    stepper: CdkStepper;

    @Input()
    set checkRestart(subject: Subject<void>) {
        subject.subscribe(() => this.formularioComplemento.reset());
    }

    @Input() tipoDependente: any;

    showProgress = false;
    tipoDeficiencias: SelectItem[];

    readonly formularioComplemento:any = this.formBuilder.group({
        rg: new FormControl(null, AscValidators.somenteAlfaNumericos()),
        orgaoEmissor: new FormControl(null),
        dataExpedicaoRg: new FormControl(null, AscValidators.dataMenorIgualAtual),
        estado: new FormControl(null),
        municipio: new FormControl(null),
        idTipoDeficiencia: new FormControl(null),
        cartaoNacionalSaude: new FormControl(null, AscValidators.somenteNumeros()),
        cartaoUnimed: new FormControl(null, AscValidators.somenteNumeros()),
        renda: new FormControl(null),
        emailDependente: new FormControl(null, AscValidators.email()),
    });

    constructor(
        private readonly formBuilder: FormBuilder,
        private service: TipoDeficienciaService,
        messageService: MessageService,
        readonly changeDetectorRef: ChangeDetectorRef) {
        super(messageService);
        this.getTipoDeficiencia();
    }

    getTipoDeficiencia() {
        this.service.consultarTodos().subscribe(result => {
            this.tipoDeficiencias = result.map(item => ({
                label: item.descricao,
                value: item
            }));
        });
    }

    ngOnInit(): void {
        this.iniciar();
    }

    ngAfterViewChecked(): void {
        this.changeDetectorRef.detectChanges();
    }

    iniciar():void{
        if (this.complementoDependente) {
            if (this.dadoDependente && this.dadoDependente.emailDependente) {
                this.formularioComplemento.setValue({
                    ...this.formularioComplemento.value,
                    emailDependente: this.dadoDependente.emailDependente
                  });
            }
            this.formularioComplemento.patchValue(this.complementoDependente);
        }else{
            if (this.dadoDependente && this.dadoDependente.emailDependente) {
                this.formularioComplemento.patchValue({
                    emailDependente: this.dadoDependente.emailDependente
                  });
            }
        }
    }

    onSubmit(): void {
        this.submeter();
    }
    
    submeter(){
        if (this.formularioComplemento && this.formularioComplemento.valid) {
            this.showProgress = true;
            const complemento = this.formularioComplemento.getRawValue() as ComplementoDependenteFormModel;
            this.showProgress = false;
            this.complementoDependenteModel.emit({
                ...complemento,
                idTipoDeficiencia: this.formularioComplemento.get('idTipoDeficiencia').value
            });
            this.stepper.next();
        }
    }

    previousStep(_: MouseEvent) {
        this.stepper.previous();
    }

    get rgRequired(): boolean {
        return this.formularioComplemento.get('rg').value || this.formularioComplemento.get('orgaoEmissor').value
            || this.formularioComplemento.get('dataExpedicaoRg').value;
    }

    get complementoRequired(): boolean {
        if(this.tipoDependente !== null && this.tipoDependente !== undefined) 
            return this.tipoDependente.pdpi;
        else
            return false;
    }

    ufSelecionado(uf: DadoComboDTO) {
        this.ufSelecionada.emit(uf);
        this.formularioComplemento.get('municipio').reset();
        this.selectMunicipio(null);
    }

    tipoDeficienciaSelecionado(event) {
        this.tipoDeficienciaModel.emit(event);
        this.tipoDeficiencia = event;
    }

    selectMunicipio(municipio: Municipio) {
        this.municipioSelecionado.emit(municipio);
    }
}
