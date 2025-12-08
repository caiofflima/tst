import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {AscSelectComponentProcedimentosParams} from '../../../../shared/components/asc-select/models/asc-select-component-procedimentos.params';
import {TipoAcaoProcedimentoEngine} from '../../../../shared/components/asc-select/models/tipo-acao-procedimento-engine';
import {Procedimento} from '../../../../shared/models/comum/procedimento';
import {FormBuilder, FormControl, FormGroupDirective, Validators} from '@angular/forms';
import {PedidoProcedimento} from '../../../../shared/models/comum/pedido-procedimento';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {AscSelectGrausProcedimentoParams} from '../../../../shared/components/asc-select/models/asc-select-graus-procedimento.params';
import {GrauProcedimento} from '../../../../shared/models/comum/grau-procedimento';
import {
    aplicarAcaoQuandoFormularioValido,
    isNotUndefinedOrNull,
    isUndefinedNullOrEmpty
} from '../../../../shared/constantes';
import {PedidoProcedimentoFormModel} from '../models/pedido-procedimento-form.model';
import {BaseComponent} from '../../../../../app/shared/components/base.component';
import {MessageService} from '../../../../../app/shared/components/messages/message.service';
import {AscValidators} from "../../../../shared/validators/asc-validators";
import {TipoProcessoEnum} from "../../../../shared/components/asc-pedido/models/tipo-processo.enum";
import {ProcedimentoService} from "../../../../../app/shared/services/comum/procedimento.service";
import {Beneficiario} from "../../../../shared/models/entidades";

@Component({
    selector: 'asc-procedimento-form',
    templateUrl: './procedimento-form.component.html',
    styleUrls: ['./procedimento-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProcedimentoFormComponent extends BaseComponent implements OnInit, OnDestroy, OnChanges {

    @Input() inResumo = false;
    @Input() parametroSelectProcedimento: AscSelectComponentProcedimentosParams = {};
    @Input() showButtonResumo = false;

    @Output() readonly procedimento = new EventEmitter<Procedimento>();
    @Output() readonly pedidoProcedimentos = new EventEmitter<PedidoProcedimento[]>();

    @Output() readonly pedidoProcedimentoForm = new EventEmitter<PedidoProcedimento>();
    @Output() readonly cancelarProcedimento = new EventEmitter();
    @Output() readonly isEditingForm = new EventEmitter<boolean>();

    @Input() beneficiario: Beneficiario;

    isToShowForm = false;
    isToShowQtdSolicitada = false;
    grauSelecionadoAsObject: GrauProcedimento;
    procedimentoAsObject: Procedimento;

    idProcedimento = new FormControl(null, Validators.required);
    idGrauProcedimento = new FormControl(null, Validators.required);

    readonly CONSULTAR_PROCEDIMENTO_POR_TIPO_PROCESSO = TipoAcaoProcedimentoEngine.CONSULTAR_PROCEDIMENTO_POR_TIPO_PROCESSO;

    readonly form = this.formBuilder.group({
        idProcedimento: this.idProcedimento,
        idGrauProcedimento: this.idGrauProcedimento,
        qtdSolicitada: [null, [Validators.required, Validators.min(1), AscValidators.onlyNumbers]],
        tsOperacao: [new Date()],
        index: [null],
    });

    isEditing = false;

    parametrosSelectGrauProcedimento: AscSelectGrausProcedimentoParams;

    disableButtonAdicionarProcedimento = true;
    private readonly subjectUnsubscription = new Subject<void>();

    constructor(
        private readonly formBuilder: FormBuilder,
        messageService: MessageService,
        readonly procedimentoService: ProcedimentoService
    ) {
        super(messageService);
    }

    ngOnInit() {
        this.atualizarGrauProcimentoComBaseNoIdProcedimento();
        this.exibirFormulario();
        this.exibirQuantidadeSolicitada();
        this.bloquearBotaoAdicionarProcedimentoQuandoGrauProcedimentoInvalido();
    }

    private exibirQuantidadeSolicitada() {
        this.idGrauProcedimento.valueChanges.pipe(
            takeUntil(this.subjectUnsubscription)
        ).subscribe((idGrauProcedimento: number) => {
            if (idGrauProcedimento && idGrauProcedimento > 0) {
                this.isToShowQtdSolicitada = true;
            } else {
                this.isToShowQtdSolicitada = false;
            }
        });
    }

    private exibirFormulario() {
        this.idProcedimento.valueChanges.pipe(
            takeUntil(this.subjectUnsubscription)
        ).subscribe((idProcedimento: number) => {
            if (idProcedimento && idProcedimento > 0) {
                this.isToShowForm = true;
                this.cleanControIdGrauProcedimentoFromControl();
            } else {
                this.isToShowForm = false;
            }
        });
    }

    private cleanControIdGrauProcedimentoFromControl() {
        const idGrauProcedimento = this.idGrauProcedimento;
        idGrauProcedimento.reset();
        idGrauProcedimento.markAsUntouched();
        idGrauProcedimento.markAsPristine();
    }

    ngOnChanges(changes: SimpleChanges): void {
        // Se trocar o tipo de processo ou parâmetros, limpar o formulário para evitar estados cruzados
        if (changes['parametroSelectProcedimento'] && !changes['parametroSelectProcedimento'].firstChange) {
            this.resetarFormCompleto();
        }
    }

    private atualizarGrauProcimentoComBaseNoIdProcedimento() {
        this.idProcedimento.valueChanges.pipe(
            takeUntil(this.subjectUnsubscription)
        ).subscribe((idProcedimento: number) => {
            this.parametrosSelectGrauProcedimento = {idProcedimento};
        });
    }

    private bloquearBotaoAdicionarProcedimentoQuandoGrauProcedimentoInvalido() {
        this.idGrauProcedimento.statusChanges.pipe(takeUntil(this.subjectUnsubscription)).subscribe(status => {
            this.disableButtonAdicionarProcedimento = status === 'INVALID';
        });
    }

    grauProcedimentoCarregado(grauProcedimento: GrauProcedimento[]) {
        const idGrauProcedimentoControl = this.idGrauProcedimento;

        if (isUndefinedNullOrEmpty(grauProcedimento)) {
            this.disableButtonAdicionarProcedimento = false;
            idGrauProcedimentoControl.clearValidators();
        } else {
            this.disableButtonAdicionarProcedimento = true;
            idGrauProcedimentoControl.setValidators(Validators.required);

            // Reatribui o valor do grau ao campo do formulário, se já existir um selecionado
            const grauSelecionado = this.idGrauProcedimento.value;
            if (grauSelecionado) {
                idGrauProcedimentoControl.setValue(grauSelecionado);
                this.grauSelecionadoAsObject = grauProcedimento.find(grau => grauSelecionado === grau.id);
            }
        }
        idGrauProcedimentoControl.updateValueAndValidity();
    }

    procedimentoSelecionando(procedimento?: Procedimento) {
        this.procedimentoAsObject = procedimento;
        this.procedimento.emit(procedimento);
    }

    grauProcedimentoSelecionado(grauProcedimentoSelecionado?: GrauProcedimento) {
        this.grauSelecionadoAsObject = grauProcedimentoSelecionado;
    }

    override ngOnDestroy(): void {
        this.subjectUnsubscription.next();
        this.subjectUnsubscription.complete();
    }

    adicionarProcedimento(formDirective: FormGroupDirective): void {

        aplicarAcaoQuandoFormularioValido(this.form, () => {
            const pedidoProcedimento = this.form.value as PedidoProcedimento;
            pedidoProcedimento.grauProcedimento = this.grauSelecionadoAsObject;
            pedidoProcedimento.procedimento = this.procedimentoAsObject;

            // console.log("adicionarProcedimento(formDirective: FormGroupDirective): void { ==== form - beneficiario");
            // console.log(this.form.value);
            // console.log("this.beneficiario =================");
            // console.log(this.beneficiario);

            this.procedimentoService.consultarProcedimentoPorId(pedidoProcedimento.procedimento.id).subscribe(procedimento => {

                if(this.beneficiario !== null && this.beneficiario !== undefined){
                    const idade = this.calculaIdade(this.beneficiario.matricula.dataNascimento);
                    // console.log("procedimento ============== ");
                    // console.log(procedimento);
                    // console.log(this.beneficiario.matricula.sexo + " --- " + this.beneficiario.matricula.dataNascimento +" - idade= "+idade);
                    // console.log("[FIM] procedimento ============== ");

                    if((this.beneficiario.matricula.sexo !== procedimento.sexo) && procedimento.sexo !=="A"){
                        this.messageService.addMsgDanger("Procedimento incompatível com o sexo do(a) beneficiário(a).");
                    }else if(idade < procedimento.idadeMinima || idade > procedimento.idadeMaxima){
                        this.messageService.addMsgDanger("Procedimento incompatível com a idade do(a) beneficiário(a).");
                    }else{
                        this.pedidoProcedimentoForm.emit(pedidoProcedimento);
                        this.isToShowForm = false;
                        this.isToShowQtdSolicitada = false;
                        this.isEditing = false;
                        this.isEditingForm.emit(this.isEditing)
                        formDirective.resetForm();
                        this.resetarForm();
                    }
                }else{
                    console.log(" Nenhum beneficiario selecionado.");
                }

            }, error => {
                this.messageService.addMsgDanger(error.message);
            })  

        });
    }

    calculaIdade(strDataNascimento:string):number{
        const dataAtual:Date = new Date();
        const dataArray = strDataNascimento.split("-");

        const ano = parseInt(dataArray[0]);
        const mes = parseInt(dataArray[1])-1;
        const dia = parseInt(dataArray[2]);

        const dataNascimento:Date = new Date(ano, mes, dia);
        const diferencaEmMiliSegundos = dataAtual.getTime() - dataNascimento.getTime();
        const idadeEmAnos = diferencaEmMiliSegundos/(1000*60*60*24*365);

        return idadeEmAnos;
    }

    carregarProcedimentosAutorizacaoPrevia(idProcedimento:number) {
		this.procedimentoService.consultarProcedimentoPorId(idProcedimento)
                                            .subscribe(procedimento => {
            console.log("procedimento ============== ");
            console.log(procedimento);
            console.log("[FIM] procedimento ============== ");
        }, error => {
            this.messageService.addMsgDanger(error.message);
		})
	}	

    @Input()
    set pedidoProcedimentoFormInput(pedidoProcedimento: any) {
        if (pedidoProcedimento && pedidoProcedimento.idProcedimento) {
            this.form.setValue(pedidoProcedimento);

            Object.keys(this.form.controls).forEach(key => {
                let field = this.form.get(key);
                if (field) {
                    field.setValue(pedidoProcedimento[key]);
                    field.markAsTouched();
                    field.markAsDirty();
                    field.updateValueAndValidity();
                }
            });

            this.parametrosSelectGrauProcedimento = {idProcedimento: pedidoProcedimento.idProcedimento}
            this.isToShowForm = true;
            this.isEditing = isNotUndefinedOrNull(pedidoProcedimento.index);
            this.isEditingForm.emit(this.isEditing);
        }
    }

    private resetarForm() {
        this.form.reset();
    }

    isTipoProcessoOdontologico() {
        return this.parametroSelectProcedimento.idTipoProcesso === TipoProcessoEnum.AUTORIZACAO_PREVIA_ODONTOLOGICA;
    }

    clickButtonCancelarProcedimento(formDirective: FormGroupDirective) {
        this.isToShowForm = false;
        this.isToShowQtdSolicitada = false;
        formDirective.resetForm();
        this.resetarFormCompleto();
        this.isEditing = false;
        this.isEditingForm.emit(this.isEditing)
        this.cancelarProcedimento.emit();
    }

    private resetarFormCompleto() {
        this.isToShowForm = false;
        this.isToShowQtdSolicitada = false;
        this.procedimentoAsObject = null;
        this.grauSelecionadoAsObject = null;
        this.parametrosSelectGrauProcedimento = { idProcedimento: null };
        this.resetarForm();
    }
}
