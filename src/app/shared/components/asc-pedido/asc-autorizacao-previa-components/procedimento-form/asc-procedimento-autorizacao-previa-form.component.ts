import { Pedido } from 'app/shared/models/comum/pedido';
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {BaseComponent} from "../../../base.component";
import {AscSelectComponentProcedimentosParams} from "../../../asc-select/models/asc-select-component-procedimentos.params";
import {GrauProcedimento, MotivoNegacao, PedidoProcedimento, Procedimento} from "../../../../models/entidades";
import {TipoAcaoProcedimentoEngine} from "../../../asc-select/models/tipo-acao-procedimento-engine";
import {FormBuilder, FormGroupDirective, Validators} from "@angular/forms";
import {AscValidators} from "../../../../validators/asc-validators";
import {AscSelectGrausProcedimentoParams} from "../../../asc-select/models/asc-select-graus-procedimento.params";
import {Subject} from "rxjs";
import {MessageService} from "../../../../services/services";
import {takeUntil} from "rxjs/operators";
import {
    aplicarAcaoQuandoFormularioValido,
    isNotUndefinedOrNull,
    isUndefinedNullOrEmpty
} from "../../../../constantes";
import {PedidoProcedimentoFormModel} from "../../models/pedido-procedimento-form.model";
import {ObjectUtils} from "../../../../util/object-utils";
import {TipoProcessoEnum} from "../../models/tipo-processo.enum";
import {ProcedimentoService} from "app/shared/services/comum/procedimento.service";
import { SituacaoPedidoProcedimento } from 'app/shared/models/dto/situacao-pedido-procedimento';

@Component({
    selector: 'asc-procedimento-autorizacao-previa-form',
    templateUrl: './asc-procedimento-autorizacao-previa-form.component.html',
    styleUrls: ['./asc-procedimento-autorizacao-previa-form.component.scss'],
})
export class AscProcedimentoAutorizacaoPreviaFormComponent extends BaseComponent implements OnInit, OnDestroy {

    @Input() parametroSelectProcedimento: AscSelectComponentProcedimentosParams = {};
    @Input() showButtonResumo = false;
    @Input() processo: Pedido;

    @Output() readonly procedimento = new EventEmitter<Procedimento>();
    @Output() readonly grauSelecionado = new EventEmitter<GrauProcedimento>();
    @Output() readonly pedidoProcedimentos = new EventEmitter<PedidoProcedimento[]>();
    @Output() readonly pedidoProcedimentoForm = new EventEmitter<PedidoProcedimento>();
    @Output() readonly qtdAutorizadaEmitida = new EventEmitter<number | null>(); // Novo
    @Output() readonly motivoNegacaoEmitido = new EventEmitter<MotivoNegacao | null>(); // Novo
    @Output() readonly isToshowPanel = new EventEmitter<boolean>();
    @Output() readonly cancelarProcedimento = new EventEmitter();
    @Output() readonly isEditingForm = new EventEmitter<boolean>();

    isToShowForm = false;
    grauSelecionadoAsObject: GrauProcedimento;
    procedimentoAsObject: Procedimento;
    
    isEdicao: boolean = false;
    procedimentoEditado: PedidoProcedimento | null = null;

    readonly CONSULTAR_PROCEDIMENTO_POR_TIPO_PROCESSO = TipoAcaoProcedimentoEngine.CONSULTAR_PROCEDIMENTO_POR_TIPO_PROCESSO;

    readonly form = this.formBuilder.group({
        id: [null], // Adicione o campo id (não obrigatório)
        idProcedimento: [null, Validators.required],
        idGrauProcedimento: [null, Validators.required],
        qtdSolicitada: [null, [Validators.required, Validators.min(1), AscValidators.onlyNumbers]],
        qtdAutorizada: [null, [AscValidators.onlyNumbers]], // Não obrigatório, mas deve ser um número
        motivoNegacao: [null], // Será usado apenas para capturar o dado temporariamente
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
        this.bloquearBotaoAdicionarProcedimentoQuandoGrauProcedimentoInvalido();
    
        // Regras para habilitar/desabilitar motivoNegacao
        this.configurarHabilitacaoMotivoNegacao();
    
        // Adiciona validação dinâmica para qtdAutorizada
        this.adicionarValidacaoQtdAutorizada();

        this.ajustarCampoMotivoNegacao(); // Para adição

    }
    
    private configurarHabilitacaoMotivoNegacao(): void {
        // Observa mudanças nos campos qtdAutorizada e qtdSolicitada
        const qtdAutorizadaControl = this.form.get('qtdAutorizada');
        const qtdSolicitadaControl = this.form.get('qtdSolicitada');

        if (qtdAutorizadaControl) {
            qtdAutorizadaControl.valueChanges.pipe(
                takeUntil(this.subjectUnsubscription)
            ).subscribe(() => {
                this.ajustarCampoMotivoNegacao();
            });
        }
    
        if (qtdSolicitadaControl) {
            qtdSolicitadaControl.valueChanges.pipe(
                takeUntil(this.subjectUnsubscription)
            ).subscribe(() => {
                this.ajustarCampoMotivoNegacao();
            });
        }
    }
    
    private ajustarCampoMotivoNegacao(): void {
        const qtdAutorizadaControl = this.form.get('qtdAutorizada');
        const qtdSolicitadaControl = this.form.get('qtdSolicitada');
        const motivoNegacaoControl = this.form.get('motivoNegacao');

        if (!qtdAutorizadaControl || !qtdSolicitadaControl || !motivoNegacaoControl) {
            return; // Sai se algum controle não for encontrado
        }

        const qtdAutorizada = qtdAutorizadaControl.value ?? 0;
        const qtdSolicitada = qtdSolicitadaControl.value ?? 0;

        if (qtdAutorizada < qtdSolicitada) {
            motivoNegacaoControl.enable();
            motivoNegacaoControl.setValidators([Validators.required]);
        } else {
            if (motivoNegacaoControl.value) {
                motivoNegacaoControl.setValue(null, { emitEvent: false });
            }
            motivoNegacaoControl.disable();
            motivoNegacaoControl.clearValidators();
        }
        motivoNegacaoControl.updateValueAndValidity();
    }

    private adicionarValidacaoQtdAutorizada(): void {
        const qtdAutorizadaControl = this.form.get('qtdAutorizada');
        const qtdSolicitadaControl = this.form.get('qtdSolicitada');

        if (!qtdAutorizadaControl || !qtdSolicitadaControl) {
            return; // Sai se algum controle não for encontrado
        }

        // Adiciona validação dinâmica para garantir que qtdAutorizada <= qtdSolicitada
        qtdAutorizadaControl.setValidators([
            AscValidators.onlyNumbers,
            (control) => {
                const qtdSolicitada = qtdSolicitadaControl.value ?? 0;
                const qtdAutorizada = control.value ?? 0;

                if (qtdAutorizada > qtdSolicitada) {
                    return { qtdAutorizadaInvalida: true }; // Retorna erro se qtdAutorizada > qtdSolicitada
                }

                return null;
            }
        ]);

        // Sempre atualiza a validação ao alterar qtdSolicitada
        qtdSolicitadaControl.valueChanges.pipe(
            takeUntil(this.subjectUnsubscription)
        ).subscribe(() => {
            qtdAutorizadaControl.updateValueAndValidity();
        });
    }

    private exibirFormulario() {
        this.form.get('idProcedimento').valueChanges.pipe(
            takeUntil(this.subjectUnsubscription),
        ).subscribe(() => {
            this.isToShowForm = true;
            this.isToshowPanel.emit(this.isToShowForm);
            this.cleanControIdGrauProcedimentoFromControl();
        });
    }


    private atualizarGrauProcimentoComBaseNoIdProcedimento() {
        this.form.get('idProcedimento').valueChanges.pipe(
            takeUntil(this.subjectUnsubscription)
        ).subscribe((idProcedimento: number) => {
            this.parametrosSelectGrauProcedimento = {idProcedimento};
            this.cleanControIdGrauProcedimentoFromControl();
        });
    }

    private cleanControIdGrauProcedimentoFromControl() {
        const idGrauProcedimento = this.form.get('idGrauProcedimento');
        idGrauProcedimento.reset();
        idGrauProcedimento.markAsUntouched();
        idGrauProcedimento.markAsPristine();
    }

    private bloquearBotaoAdicionarProcedimentoQuandoGrauProcedimentoInvalido() {
        this.form.get('idGrauProcedimento').statusChanges.pipe(
            takeUntil(this.subjectUnsubscription)
        ).subscribe(status => {
            this.disableButtonAdicionarProcedimento = status === 'INVALID';
        });
    }

    grauProcedimentoCarregado(grauProcedimento: GrauProcedimento[]) {
        const idGrauProcedimentoControl = this.form.get('idGrauProcedimento');
        if (isUndefinedNullOrEmpty(grauProcedimento)) {
            this.disableButtonAdicionarProcedimento = false;
            idGrauProcedimentoControl.clearValidators();
        } else {
            this.disableButtonAdicionarProcedimento = true;
            idGrauProcedimentoControl.setValidators(Validators.required);
    
            // Reatribui o valor do grau ao campo do formulário, se já existir um selecionado
            const grauSelecionado = this.form.get('idGrauProcedimento').value;
            if (grauSelecionado) {
                idGrauProcedimentoControl.setValue(grauSelecionado);
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
        this.grauSelecionado.emit(grauProcedimentoSelecionado);
    }

    override ngOnDestroy(): void {
        this.isToShowForm = false;
        this.isToshowPanel.emit(this.isToShowForm);
        this.subjectUnsubscription.next();
        this.subjectUnsubscription.complete();
    }

    adicionarProcedimento(formDirective: FormGroupDirective): void {
        aplicarAcaoQuandoFormularioValido(this.form, () => {
    
            // Cria o PedidoProcedimento a partir do formulário
            const pedidoProcedimento = this.form.value as PedidoProcedimento;
            pedidoProcedimento.grauProcedimento = this.grauSelecionadoAsObject;
            pedidoProcedimento.procedimento = this.procedimentoAsObject;
    
            // Coleta os valores de qtdAutorizada e motivoNegacao
            const qtdAutorizada = this.form.get('qtdAutorizada').value;
            const motivoNegacaoId = this.form.get('motivoNegacao').value;
            const motivoNegacao = motivoNegacaoId ? { id: motivoNegacaoId } as MotivoNegacao : null;
    
            // Temporariamente encapsula qtdAutorizada e motivoNegacao dentro do PedidoProcedimento
            (pedidoProcedimento as any).qtdAutorizada = qtdAutorizada;
            (pedidoProcedimento as any).motivoNegacao = motivoNegacao;
    
            // Beneficiário associado ao processo
            const beneficiario = this.processo.beneficiario;
    
            // Validações de idade, sexo e compatibilidade
            this.procedimentoService.consultarProcedimentoPorId(pedidoProcedimento.procedimento.id).subscribe(procedimento => {
                if (beneficiario !== null && beneficiario !== undefined) {
                    const idade = this.calculaIdade(beneficiario.matricula.dataNascimento);
    
                    if ((beneficiario.matricula.sexo !== procedimento.sexo) && procedimento.sexo !== "A") {
                        this.messageService.addMsgDanger("Procedimento incompatível com o sexo do(a) beneficiário(a).");
                    } else if (idade < procedimento.idadeMinima || idade > procedimento.idadeMaxima) {
                        this.messageService.addMsgDanger("Procedimento incompatível com a idade do(a) beneficiário(a).");
                    } else {
                        // Emite o PedidoProcedimento para o pai (com qtdAutorizada e motivoNegacao encapsulados)
                        this.pedidoProcedimentoForm.emit(pedidoProcedimento);
    
                        // Reseta o estado do formulário
                        this.isToShowForm = true;
                        this.isEditing = false;
                        this.isEditingForm.emit(this.isEditing);
                        formDirective.resetForm();
                        this.resetarForm();
                    }
                } else {
                    console.log("Nenhum beneficiário selecionado.");
                }
            }, error => {
                this.messageService.addMsgDanger(error.message);
            });
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

    @Input()
    set pedidoProcedimentoFormInput(pedidoProcedimento: PedidoProcedimentoFormModel) {
        ObjectUtils.applyWhenIsNotEmpty(pedidoProcedimento, () => {
            // Habilita motivoNegacao se vier valor (edição)
            const motivoNegacaoControl = this.form.get('motivoNegacao');
            if (pedidoProcedimento.motivoNegacao) {
                motivoNegacaoControl.enable({ emitEvent: false });
            } else {
                motivoNegacaoControl.disable({ emitEvent: false });
            }
    
            // Seta os outros valores
            Object.keys(this.form.controls).forEach(key => {
                if (pedidoProcedimento.hasOwnProperty(key)) {
                    this.form.get(key).setValue(pedidoProcedimento[key], { emitEvent: false });
                }
            });
            this.form.updateValueAndValidity();
    
            this.parametrosSelectGrauProcedimento = { idProcedimento: pedidoProcedimento.idProcedimento };
            this.isToShowForm = true;
            this.isEditing = isNotUndefinedOrNull(pedidoProcedimento.index);
            this.isEditingForm.emit(this.isEditing);
    
            // Ajusta lógica de habilitação para casos de alteração pelo usuário
            this.ajustarCampoMotivoNegacao();
        });
    }

    private resetarForm() {
        this.form.reset();
    }

    isTipoProcessoOdontologico() {
        return this.parametroSelectProcedimento.idTipoProcesso === TipoProcessoEnum.AUTORIZACAO_PREVIA_ODONTOLOGICA;
    }

    clickButtonCancelarProcedimento(formDirective: FormGroupDirective): void {
        formDirective.resetForm();
        this.resetarForm();
        this.isEditing = false;
        this.isEditingForm.emit(this.isEditing);
        this.cancelarProcedimento.emit();
        this.isEdicao = false;
        this.procedimentoEditado = null;
    }

}



