import {Directive, EventEmitter, Input, OnDestroy, Output} from "@angular/core";
import {Beneficiario} from "../../../../models/comum/beneficiario";
import {PedidoProcedimento} from "../../../../models/comum/pedido-procedimento";
import {GrauProcedimento} from "../../../../models/comum/grau-procedimento";
import {
    AscSelectComponentProcedimentosParams
} from "../../../asc-select/models/asc-select-component-procedimentos.params";
import {Procedimento} from "../../../../models/comum/procedimento";
import {PedidoProcedimentoFormModel} from "../../models/pedido-procedimento-form.model";

import {AutorizacaoPreviaService} from "../../../../services/comum/pedido/autorizacao-previa.service";
import {MessageService} from "../../../messages/message.service";
import {isNotUndefinedNullOrEmpty, isUndefinedNullOrEmpty, isUndefinedOrNull} from "../../../../constantes";
import {ObjectUtils} from "../../../../util/object-utils";
import {ArrayUtil} from "../../../../util/array-util";
import {TipoProcessoEnum} from "../../models/tipo-processo.enum";
import {Observable, Subject} from "rxjs";
import {ProcessoService} from "../../../../services/services";
import {take} from "rxjs/operators";
import {
    Config,
    ConfiguracaoProcedimento,
    profileComponent,
    profileProcedimento
} from "../../asc-tipo-procedimento-form/models/asc-tipo-formulario-settings";
import {AscComponenteAutorizadoMessage} from "../../asc-componente-autorizado-message";
import {Pedido} from "../../../../models/comum/pedido";
import {MedicamentoPatologiaPedido} from "../../../../models/comum/medicamento-patologia-pedido";
import {MedicamentoPatologiaPedidoService} from "../../../../services/comum/medicamento-patologia-pedido.service";
import { ProcedimentoPedidoService } from "app/shared/services/comum/procedimento-pedido.service";

@Directive()
export abstract class AscProcedimentoPedidoCommon extends AscComponenteAutorizadoMessage implements OnDestroy {

    enableFormProcedimento: boolean;

    @Input()
    isEditing = false;

    @Input()
    isDisabled = false;

    @Input()
    enableAllAction = true;

    @Output()
    readonly pedidoProcedimentos$ = new EventEmitter<PedidoProcedimento[]>();

    @Output()
    readonly pedidoProcedimentosChanged = new EventEmitter<void>();

    @Output()
    readonly grauSelecionado = new EventEmitter<GrauProcedimento>();

    @Output()
    readonly regiaoOdontologica = new EventEmitter<GrauProcedimento>();
    showTable = true;
    isToShowComponent = true;
    configurations: ConfiguracaoProcedimento = {
        isShowInfo: true,
        isShowTable: true
    };

    parametroSelectProcedimento: AscSelectComponentProcedimentosParams = {};
    procedimento: Procedimento;
    showProgress = false;
    pedidoProcedimentoForm: PedidoProcedimentoFormModel = null;
    isToShowForm = false;
    profile: Config;
    notIsToCleanTable = true;
    isToCleanForm = false;
    formValido = false;
    protected readonly idTipoProcesso$ = new Subject<number>();
    protected innerPedido: Pedido;
    protected readonly unsubscription$ = new Subject<void>()

    protected constructor(
        protected readonly autorizacaoPreviaService: AutorizacaoPreviaService,
        protected override readonly messageService: MessageService,
        protected readonly procedimentoPedidoService: ProcedimentoPedidoService,
        protected readonly medicamentoPatologiaPedidoService: MedicamentoPatologiaPedidoService,
        protected readonly processoService: ProcessoService,
    ) {
        super(messageService);
    }

    private _idMotivoSolicitacao: number;

    public get idMotivoSolicitacao(): number {
        return this._idMotivoSolicitacao;
    }

    @Input()
    public set idMotivoSolicitacao(value: number) {
        if (this._idMotivoSolicitacao !== value && this._idMotivoSolicitacao) {
            this.pedidoProcedimentoForm = null;
            this.limparPedidoProcedimentoOuMedicamentoPatologiaPedido();
            this.isToCleanForm = true;
            this.pedidoProcedimentos$.emit(this._pedidoProcedimentosTabela);
        }
        this._idMotivoSolicitacao = value;
        setTimeout(() => this.isToCleanForm = false, 0);
    }

    protected _idTipoProcesso: number;

    @Input()
    set idTipoProcesso(idTipoProcesso: number) {
        ObjectUtils.applyWhenIsNotEmpty(idTipoProcesso, () => {
            if (idTipoProcesso !== this._idTipoProcesso && this._idTipoProcesso) this.limparDadosTela();
            this._idTipoProcesso = idTipoProcesso;
            this.idTipoProcesso$.next(idTipoProcesso);
            this.showTable = ![TipoProcessoEnum.REEMBOLSO_CONSULTA].includes(idTipoProcesso);
            this.parametroSelectProcedimento = {idTipoProcesso};
            if (isNotUndefinedNullOrEmpty(this.pedidoProcedimentosTabela)) {
                this.pedidoProcedimentosTabela = this.pedidoProcedimentosTabela
                .filter(pedidoProcedimento => pedidoProcedimento.id === idTipoProcesso);
            }
            this.definirProfileDeConfiguracaoParaOFormularioDeProcedimento(idTipoProcesso);
        });
    }

    get idTipoProcesso(): number {
        return this._idTipoProcesso;
    }

    private _beneficiario: Beneficiario;

    get beneficiario() {
        return this._beneficiario;
    }

    @Input() set beneficiario(beneficiario: Beneficiario) {
        this.isToShowComponent = true;
        if (this._beneficiario && beneficiario && (this._beneficiario.id !== beneficiario.id || beneficiario.matricula !== this._beneficiario.matricula)) {
            this.limparDadosTela();
            this.isToShowComponent = false;
            setTimeout(() => this.isToShowComponent = true, 0)
        }
        this._beneficiario = beneficiario;
    }

    _pedidoProcedimentosTabela: PedidoProcedimento[] = [];

    get pedidoProcedimentosTabela() {
        return this._pedidoProcedimentosTabela;
    }

    @Input()
    set pedidoProcedimentosTabela(pedidoProcedimentosTabela: PedidoProcedimento[]) {
        if (isNotUndefinedNullOrEmpty(pedidoProcedimentosTabela)) {
            this._pedidoProcedimentosTabela = pedidoProcedimentosTabela;
        }
    }

    editar(pedidoProcedimento: PedidoProcedimento, index: number): void {
        console.log('editando 22')
        console.log(pedidoProcedimento);
        this.isToShowForm = true
        this.pedidoProcedimentoForm = {
            pedidoProcedimento: pedidoProcedimento,
            idProcedimento: pedidoProcedimento.idProcedimento,
            idGrauProcedimento: pedidoProcedimento.idGrauProcedimento || (pedidoProcedimento.grauProcedimento ? pedidoProcedimento.grauProcedimento.id : null),
            qtdSolicitada: pedidoProcedimento.qtdSolicitada ? pedidoProcedimento.qtdSolicitada : pedidoProcedimento.qtdMedicamento,
            dataAtendimento: pedidoProcedimento.dataAtendimento,
            valorUnitarioPago: pedidoProcedimento.valorUnitarioPago,
            idAutorizacaoPrevia: pedidoProcedimento.idAutorizacaoPrevia,
            idLaboratorio: pedidoProcedimento.medicamento && pedidoProcedimento.medicamento.idLaboratorio ? pedidoProcedimento.medicamento.idLaboratorio : pedidoProcedimento.idLaboratorio,
            idVacina: pedidoProcedimento.idVacina,
            idEspecialidade: pedidoProcedimento.idEspecialidade,
            idRegiaoOdontologica: pedidoProcedimento.idRegiaoOdontologica,
            idPatologia: pedidoProcedimento.idPatologia,
            idMedicamento: ObjectUtils.readValueFromPossibilityEmpty(() => pedidoProcedimento.medicamento.id),
            codigoMedicamento: ObjectUtils.readValueFromPossibilityEmpty(() => pedidoProcedimento.medicamento.id),
            dosagemMedicamento: pedidoProcedimento.dosagemMedicamento,
            diasAtendidosPelaQuantidade: pedidoProcedimento.diasAtendidosPelaQuantidade ? pedidoProcedimento.diasAtendidosPelaQuantidade : pedidoProcedimento.qtdDiasAtendidosPeloMedicamento
            ,
            tsOperacao: pedidoProcedimento.tsOperacao,
            index: index,
        };
        this.isEditing = true;
    }

    grauProcedimentoSelecionado(grauProcedimentoSelecionado?: GrauProcedimento) {
        this.grauSelecionado.emit(grauProcedimentoSelecionado);
    }

    regiaoOdontologicaSelecionada(regiaoOdontologica?: GrauProcedimento) {
        this.regiaoOdontologica.emit(regiaoOdontologica);
    }

    override ngOnDestroy(): void {
        this.isToShowForm = false;
        this.unsubscription$.next();
        this.unsubscription$.complete();
    }

    get disableContinuar(): boolean {
        if(TipoProcessoEnum.REEMBOLSO_CONSULTA === this.idTipoProcesso ){
            return (!this.formValido || this.pedidoProcedimentosTabela.length == 0) 
            || this.showProgress;
        }else{
            return (!this.formValido && this.pedidoProcedimentosTabela.length == 0) 
            || this.showProgress;
        }
    }

    remove(pedidoProcedimento: PedidoProcedimento | MedicamentoPatologiaPedido | any): void {
        let service: Observable<any>;
        if (this._idTipoProcesso === TipoProcessoEnum.REEMBOLSO_MEDICAMENTO) {
            service = this.medicamentoPatologiaPedidoService.excluir(pedidoProcedimento.id)
        } else {
            service = this.procedimentoPedidoService.excluirPorId(pedidoProcedimento.id)
        }

        service.subscribe(() => {
            ArrayUtil.remove(this._pedidoProcedimentosTabela, pedidoProcedimento);
            this.pedidoProcedimentosChanged.emit();
            this.pedidoProcedimentos$.emit(this._pedidoProcedimentosTabela);
        }, error => this.messageService.addMsgDanger(error.error));
    }

    adicionarProcedimentos(procedimentos: PedidoProcedimento[]) {
        this.pedidoProcedimentos$.emit(procedimentos);
        this.isToShowFormPanel(false)
        this.isEditing = false;
    }

    isToShowFormPanel(isToShowForm: boolean) {
        this.isToShowForm = isToShowForm;
    }

    adicionarProcedimentoPanel(procedimento: Procedimento) {
        this.procedimento = procedimento;
    }

    cancelarProcedimento(event: any) {
        this.isEditing = false;
        this.isToShowFormPanel(false)
        this.resetarForm();
    }

    isTipoProcessoOdontologico() {
        return this.parametroSelectProcedimento.idTipoProcesso === TipoProcessoEnum.AUTORIZACAO_PREVIA_ODONTOLOGICA;
    }

    private limparDadosTela(): void {
        if (this.notIsToCleanTable) {
            this.pedidoProcedimentoForm = null;
            this.limparPedidoProcedimentoOuMedicamentoPatologiaPedido();
        }

    }

    private definirProfileDeConfiguracaoParaOFormularioDeProcedimento(idTipoProcesso: number): void {
        if (isUndefinedNullOrEmpty(idTipoProcesso)) {
            const keys = Object.keys(profileComponent).join(', ')
            throw new Error(`O parametro profileName é o obrigatório, os parametros possíveis são ${keys}`);
        }
        this.profile = profileComponent[idTipoProcesso];
        this.configurations = profileProcedimento[idTipoProcesso]
    }

    private resetarForm(): void {
        this.pedidoProcedimentoForm = new PedidoProcedimentoFormModel();
    }

    private limparPedidoProcedimentoOuMedicamentoPatologiaPedido() {
        this._pedidoProcedimentosTabela = [];
        if (this.innerPedido) {
            this.processoService.removerPedidoProcedimentoOuMedicamentoPatologiaPedido(this.innerPedido.id).pipe(
                take(1),
            ).subscribe()
        }
        this.resetarForm();
    }

    private ultimoPedidoAlterado: PedidoProcedimento;

    adicionarProcedimento(pedidoProcedimento: PedidoProcedimento): void {
        if (!this._pedidoProcedimentosTabela) this._pedidoProcedimentosTabela = [];
        this.pedidoProcedimentoForm = this.pedidoProcedimentoForm ? {...pedidoProcedimento, ...this.pedidoProcedimentoForm} : pedidoProcedimento;
    
        let index: number = -1;
        if (this.pedidoProcedimentoForm && this.pedidoProcedimentoForm.index != null && this.pedidoProcedimentoForm.index != -1) {
            index = this.pedidoProcedimentoForm && this.pedidoProcedimentoForm.index;
        } else if (pedidoProcedimento) {
            index = this._pedidoProcedimentosTabela.findIndex(p => p.id && (p.id == pedidoProcedimento.id));
        }

        if (index > -1) {
            this._pedidoProcedimentosTabela[index] = pedidoProcedimento;
        } else {
            this._pedidoProcedimentosTabela.push(pedidoProcedimento);
        }

        if (this._pedidoProcedimentosTabela.every(pp => isUndefinedOrNull(pp.idProcedimento) && isUndefinedOrNull(pp.codigoMedicamento))) {
            this._pedidoProcedimentosTabela = [];
        }

        this._pedidoProcedimentosTabela.forEach(pedidoProcedimento => pedidoProcedimento.isEditing = false);
        this.enableFormProcedimento = false;
        this.isToShowFormPanel(false);

        if (this._idTipoProcesso == TipoProcessoEnum.REEMBOLSO_CONSULTA) {
            this.checkPedidoChangedConsulta(pedidoProcedimento);
        } else {
            this.pedidoProcedimentosChanged.emit();
        }
        this.pedidoProcedimentos$.emit(this._pedidoProcedimentosTabela);
        
        this.resetarForm();
       
        this.isEditing = false;
        this.isDisabled = false;
    }

    private checkPedidoChangedConsulta(pedidoProcedimento: PedidoProcedimento) {
        if (!this.ultimoPedidoAlterado || this.ultimoPedidoAlterado.dataAtendimento != pedidoProcedimento.dataAtendimento
            || this.ultimoPedidoAlterado.idEspecialidade != pedidoProcedimento.idEspecialidade
            || this.ultimoPedidoAlterado.idProcedimento != pedidoProcedimento.idProcedimento
            || this.ultimoPedidoAlterado.valorUnitarioPago != pedidoProcedimento.valorUnitarioPago) {
            this.ultimoPedidoAlterado = pedidoProcedimento;
            this.pedidoProcedimentosChanged.emit();
        }
    }
}
