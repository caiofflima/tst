import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, AfterViewChecked, Output, ChangeDetectorRef} from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';
import {CdkStepper} from "@angular/cdk/stepper";
import {Subject} from 'rxjs';
import {fadeAnimation} from "../../../../shared/animations/faded.animation";
import {DadoComboDTO} from "../../../../shared/models/dto/dado-combo";
import {AscValidators} from '../../../../shared/validators/asc-validators';
import {TipoDeficiencia} from 'app/shared/models/comum/tipo-deficiencia';
import {ComplementoDependenteFormModel} from "../../models/complemento-dependente.form.model";
import {DadosDependenteFormModel} from "../../models/dados-dependente-form.model";
import {BaseComponent} from "../../../../shared/components/base.component";
import {SelectItem} from "primeng/api";
import {Municipio} from "../../../../shared/models/comum/municipio";
import {TipoBeneficiarioDTO} from 'app/shared/models/dto/tipo-beneficiario';
import {MessageService, MotivoSolicitacaoService, TipoDeficienciaService} from "../../../../shared/services/services";
import { MotivoSolicitacao } from 'app/shared/models/comum/motivo-solicitacao';
import { InscricaoDependenteService } from 'app/shared/services/comum/inscricao-dependente.service';

@Component({
    selector: 'asc-etapa-complemento-dependente',
    templateUrl: './etapa-complemento-dependente.component.html',
    styleUrls: ['./etapa-complemento-dependente.component.scss'],
    animations: [...fadeAnimation],
    changeDetection: ChangeDetectionStrategy.Default
})
export class EtapaComplementoDependenteComponent extends BaseComponent implements OnInit, AfterViewChecked {

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

    @Input() tipoDependente: TipoBeneficiarioDTO;

    showProgress = false;
    tipoDeficiencias: SelectItem[];

    motivoSolicitacaoselected: MotivoSolicitacao | null = null;

    readonly formularioComplemento: any = this.formBuilder.group({
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

    readonly ID_MOTIVO_SOLICITACAO_IPT = 9;
    readonly ID_MOTIVO_SOLICITACAO_PCD = 95;

    readonly TIPO_DEFICIENCIA_IPT = 1;
    readonly TIPO_DEFICIENCIA_PCD = 2;

    isDisabledTipoDeficiencia: boolean = false;

    constructor(
        private readonly formBuilder: FormBuilder,
        private service: TipoDeficienciaService,
        messageService: MessageService,
        private readonly motivoSolicitacaoService: MotivoSolicitacaoService,
        readonly changeDetectorRef: ChangeDetectorRef,
        protected inscricaoDependenteService: InscricaoDependenteService,) {
        super(messageService);
        this.getTipoDeficiencia();
    }

    getTipoDeficiencia() {
        this.service.consultarTodos().subscribe(result => {
            let itemFilter: number;

            if(this.motivoSolicitacaoselected !== null && this.inscricaoDependenteService.isEditMode()) {

                if(this.motivoSolicitacaoselected.id === this.ID_MOTIVO_SOLICITACAO_IPT) {
                    itemFilter = this.TIPO_DEFICIENCIA_IPT;
                    this.isDisabledTipoDeficiencia = true;

                    this.filtarComboTipoDeficiencia(itemFilter, result);
                } 
                if(this.motivoSolicitacaoselected.id === this.ID_MOTIVO_SOLICITACAO_PCD) {
                    itemFilter = this.TIPO_DEFICIENCIA_PCD;
                    this.isDisabledTipoDeficiencia = true;
                
                    this.filtarComboTipoDeficiencia(itemFilter, result);

                } 
            } else {
                this.tipoDeficiencias = result.map(item => ({
                    label: item.descricao,
                    value: item
                }));

                this.isDisabledTipoDeficiencia = false;
            }
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
            this.complementoDependente = this.toUpperCaseComplementoDependente(this.complementoDependente);
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

        this.motivoSolicitacaoService.selectedOption$.subscribe(option => {
            this.motivoSolicitacaoselected = option;
        });
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
    }

    tipoDeficienciaSelecionado(event) {
        this.tipoDeficienciaModel.emit(event);
        this.tipoDeficiencia = event;
    }

    selectMunicipio(municipio: Municipio) {
        this.municipioSelecionado.emit(municipio);
    }

    protected toUpperCaseComplementoDependente(complementoDependente: ComplementoDependenteFormModel): ComplementoDependenteFormModel {
        const upperCaseComplementoDependente: ComplementoDependenteFormModel = { ...complementoDependente };
        for (const key in upperCaseComplementoDependente) {
            if (typeof upperCaseComplementoDependente[key] === 'string') {
                upperCaseComplementoDependente[key] = upperCaseComplementoDependente[key].toUpperCase();
            }
        }
        return upperCaseComplementoDependente;
    }

    filtarComboTipoDeficiencia(itemFilter: number, result: any) {
        const itensFiltrados = this.tipoDeficiencias = result
            .filter(item => item.id === itemFilter)
            .map(item => ({
                label: item.descricao,
                value: item
            }));

        this.formularioComplemento.patchValue({
            idTipoDeficiencia: itensFiltrados[0].value
        });
    }

}
