import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {PedidoProcedimento} from "../../../../../models/comum/pedido-procedimento";
import {TipoProcessoEnum} from "../../../models/tipo-processo.enum";
import {Pedido} from "../../../../../models/comum/pedido";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {debounceTime, distinctUntilChanged, map, take, tap} from "rxjs/operators";
import {
    AscSelectComponentProcedimentosParams
} from "../../../../asc-select/models/asc-select-component-procedimentos.params";
import {CustomOperatorsRxUtil} from "../../../../../util/custom-operators-rx-util";
import {PedidoProcedimentoFormModel} from "../../../models/pedido-procedimento-form.model";
import {ObjectUtils} from "../../../../../util/object-utils";
import {ProcedimentoPedidoService} from "../../../../../services/comum/procedimento-pedido.service";
import {of} from "rxjs";
import {MessageService} from "../../../../../services/services";
import {PermissoesSituacaoProcesso} from "../../../../../models/fluxo/permissoes-situacao-processo";
import {MedicamentoPatologiaPedidoService} from "../../../../../services/comum/medicamento-patologia-pedido.service";
import {MedicamentoPatologiaPedido} from "../../../../../models/comum/medicamento-patologia-pedido";
import {Beneficiario} from "../../../../../models/comum/beneficiario";

@Component({
    selector: 'asc-card-procedimento-reembolso',
    templateUrl: './asc-card-procedimento-reembolso.component.html',
    styleUrls: ['./asc-card-procedimento-reembolso.component.scss']
})
export class AscCardProcedimentoReembolsoComponent implements OnInit, OnDestroy {

    @Input() beneficiario: Beneficiario;
    @Input() idBeneficiario: number;
    @Input() index: number;
    @Input() isToShowButtons = true;
    @Input() enableAllAction = true;
    @Input() isDisabled = false;
    @Input() permissoes: PermissoesSituacaoProcesso;
    @Input() isUnico = false;
    _idMotivoSolicitacao : number;

    @Input("idMotivoSolicitacao")
    set idMotivoSolicitacao(idMotivoSolicitacao: number) {
        this._idMotivoSolicitacao = idMotivoSolicitacao;
    }

    get idMotivoSolicitacao() : number{
        return this._idMotivoSolicitacao;
    }
    parametroSelectProcedimento: AscSelectComponentProcedimentosParams = {};
    @Output() readonly isDisabled$ = new EventEmitter<boolean>();
    @Output() readonly criarOuAtualizar$ = new EventEmitter<PedidoProcedimento>();
    @Output() readonly cancel$ = new EventEmitter<PedidoProcedimento>();
    @Output() readonly loading$ = new EventEmitter<boolean>();
    @Output() deletePedidoProcedimento$ = new EventEmitter<MedicamentoPatologiaPedido | PedidoProcedimento>();
    pedidoProcedimentoForm: PedidoProcedimentoFormModel;
    isTipoProcessoReembolsoConsulta = false;
    isTipoProcessoReembolsoOdontologico = false;
    isTipoProcessoReembolsoVacina = false;
    isTipoProcessoReembolsoMedicamento = false;
    isTipoProcessoReembolsoAssistencial = false;
    loading = false;
    private readonly pedidoProcedimento$ = new BehaviorSubject<PedidoProcedimento>(null);
    private readonly unsubscribe$ = new Subject<void>();
    private readonly idTipoProcesso$ = new Subject<number>();
    private readonly pedido$ = new Subject<Pedido>();
    private _idTipoProcesso: number;

    titular : any;

    constructor(
        private readonly procedimentoPedidoService: ProcedimentoPedidoService,
        private readonly medicamentoPatologiaPedido: MedicamentoPatologiaPedidoService,
        private readonly messageService: MessageService,
    ) {
    }

    get idTipoProcesso() {
        return this._idTipoProcesso;
    }

    @Input() set idTipoProcesso(idTipoProcesso: number) {
        if (idTipoProcesso) {
            this._idTipoProcesso = idTipoProcesso;
            this.idTipoProcesso$.next(idTipoProcesso);
            this.isTipoProcessoReembolsoConsulta = idTipoProcesso === TipoProcessoEnum.REEMBOLSO_CONSULTA;
            this.isTipoProcessoReembolsoOdontologico = idTipoProcesso === TipoProcessoEnum.REEMBOLSO_ODONTOLOGICO;
            this.isTipoProcessoReembolsoVacina = idTipoProcesso === TipoProcessoEnum.REEMBOLSO_VACINA;
            this.isTipoProcessoReembolsoMedicamento = idTipoProcesso === TipoProcessoEnum.REEMBOLSO_MEDICAMENTO;
            this.isTipoProcessoReembolsoAssistencial = idTipoProcesso === TipoProcessoEnum.REEMBOLSO_ASSISTENCIAL;
        }
    }

    protected _pedidoProcedimento: PedidoProcedimento;
    pedidoProcedimento_: PedidoProcedimento

    get pedidoProcedimento() {
        return this._pedidoProcedimento;
    }

    @Input() set pedidoProcedimento(pedidoProcedimento: PedidoProcedimento) {
        setTimeout(() => {
            pedidoProcedimento.index = this.index;
            this._pedidoProcedimento = pedidoProcedimento
            this.pedidoProcedimento$.next(pedidoProcedimento);
        }, 0);
    }

    private _pedido: Pedido;
    private _pedidoAux = new Pedido();

    get pedido() {
        return this._pedido;
    }

    @Input() set pedido(pedido: Pedido) {
        setTimeout(() => {
            this._pedido = pedido;
            this.pedido$.next(pedido)
        }, 0);
    }

    ngOnInit() {
        this.registrarDetecaoMudancaoPedidoProcedimento();
        this.registrarConstrutorParametroSelectProcedimento();

        // console.log("onInit - ASC CARD PROC REEMBOLSO");
        // console.log(this.idBeneficiario);
        // console.log(this.parametroSelectProcedimento);
        // console.log(this.pedidoProcedimento);
        // console.log(this.pedido);
        // console.log(this.idTipoProcesso);
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    cancel($event: PedidoProcedimento) {
        this.cancel$.emit($event);
        this.pedidoProcedimento.isEditing = false;
        this.isDisabled = false;
    }

    adicionar(pedidoProcedimento: PedidoProcedimento) {
        const pedidoProcedimentoAtualizado = {...this._pedidoProcedimento, ...pedidoProcedimento};
        const procedimento = {...pedidoProcedimentoAtualizado, index: this.index};
        this.salvarOuAtualizar(procedimento);
    }

    isToEdit($event: boolean) {
        console.log("isToEdit($event: boolean) { -> this.pedidoProcedimento");
        console.log(this.pedidoProcedimento);
        this.pedidoProcedimento.isEditing = $event;
        this.isDisabled$.emit($event);
        this.isDisabled = true;
    }

    editar(pedidoProcedimento: PedidoProcedimento) {
        let medicamentoPatologia: any = pedidoProcedimento.medicamentoPatologia;
        console.log("editar -> pedidoProcedimento.medicamentoPatologia");
        console.log(medicamentoPatologia);
        console.log('pedidoProcedimento');
        console.log(pedidoProcedimento);
        this.pedidoProcedimentoForm = {
            id: pedidoProcedimento.id,
            idProcedimento: pedidoProcedimento.idProcedimento,
            idGrauProcedimento: pedidoProcedimento.idGrauProcedimento,
            qtdSolicitada: pedidoProcedimento.qtdSolicitada | (medicamentoPatologia ? medicamentoPatologia.qtdSolicitada : null),
            dataAtendimento: pedidoProcedimento.dataAtendimento,
            valorUnitarioPago: pedidoProcedimento.valorUnitarioPago,
            idAutorizacaoPrevia: pedidoProcedimento.idAutorizacaoPrevia,
            idLaboratorio: medicamentoPatologia ? medicamentoPatologia.medicamento.idLaboratorio : null,
            idVacina: pedidoProcedimento.idVacina,
            idEspecialidade: pedidoProcedimento.idEspecialidade,
            idRegiaoOdontologica: pedidoProcedimento.idRegiaoOdontologica,
            idPatologia: medicamentoPatologia ? medicamentoPatologia.idPatologia : null,
            idMedicamento: ObjectUtils.readValueFromPossibilityEmpty(() => medicamentoPatologia.medicamento.id),
            codigoMedicamento: ObjectUtils.readValueFromPossibilityEmpty(() => medicamentoPatologia.medicamento.coMedicamento),
            dosagemMedicamento: pedidoProcedimento.dosagemMedicamento,
            diasAtendidosPelaQuantidade: this.getDiasAtendidosPelaQuantidade(medicamentoPatologia),
            tsOperacao: pedidoProcedimento.tsOperacao,
            index: this.index
        };
       
        console.log(this.pedidoProcedimentoForm)

        this.pedidoProcedimento.isEditing = true;
        this.isDisabled = true;
        this.isDisabled$.emit(this.isDisabled);
    }

    getDiasAtendidosPelaQuantidade(medicamentoPatologia:any):number{
        let dias = 0;
        if(medicamentoPatologia && medicamentoPatologia.diasAtendidosPelaQuantidade){
            dias = medicamentoPatologia.diasAtendidosPelaQuantidade;
        }
        return dias;
    }

    analisar(pedidoProcedimento: PedidoProcedimento) {
        pedidoProcedimento.emAnalise = !pedidoProcedimento.emAnalise;
        this.pedidoProcedimento.isEditing = pedidoProcedimento.emAnalise;
    }

    removerPedidoProcedimento(pedidoProcedimento: PedidoProcedimento | MedicamentoPatologiaPedido | any): void {
        this.messageService.addConfirmYesNo('Deseja excluir esse procedimento?', () => {
            let deleteOperation$ = pedidoProcedimento && pedidoProcedimento.id ? this.procedimentoPedidoService.excluirPorId(pedidoProcedimento.id) : of({});
            if (this.pedido.idTipoProcesso === TipoProcessoEnum.REEMBOLSO_MEDICAMENTO) {
                deleteOperation$ = this.removerMedicamentoPatologiaPedido(pedidoProcedimento);
            }
            deleteOperation$.subscribe(() => this.deletePedidoProcedimento$.emit(pedidoProcedimento));
        }, null, null, 'Sim', 'Não');
    }

    private registrarDetecaoMudancaoPedidoProcedimento() {
        this.pedidoProcedimento$.pipe(
            CustomOperatorsRxUtil.filterNotEmptyAndDistinctUntilChanged(),
            tap(() => this.loading = true),
            debounceTime(200),
            tap((pedidoProcedimento: PedidoProcedimento) => this._pedidoProcedimento = pedidoProcedimento),
            tap(() => this.loading = false),
            tap(() => this.loading$.emit(this.loading)),
            take(1)
        ).subscribe()
    }

    private registrarConstrutorParametroSelectProcedimento() {
        this.pedido$.pipe(
            distinctUntilChanged(),
            debounceTime(100),
            map((pedido: Pedido) => ({...pedido}) as AscSelectComponentProcedimentosParams),
            tap((parametroSelectProcedimento: AscSelectComponentProcedimentosParams) => this.parametroSelectProcedimento = parametroSelectProcedimento)
        ).subscribe();
        // console.log("registrarConstrutorParametroSelectProcedimento - parametroSelectProcedimento");
        // console.log(this.parametroSelectProcedimento);
    }

    private salvarOuAtualizar(pedidoProcedimento: PedidoProcedimento) {
        if (this._pedido) {
            pedidoProcedimento.idPedido = this._pedido.id;
            this.loading = true;
            this.isDisabled = true;

            if (this._pedido.idTipoProcesso == TipoProcessoEnum.REEMBOLSO_MEDICAMENTO) {
                let medicamento: MedicamentoPatologiaPedido = {
                    id: pedidoProcedimento.id,
                    idPedido: pedidoProcedimento.idPedido,
                    qtdMedicamento: pedidoProcedimento.qtdSolicitada,
                    qtdDiasAtendidosPeloMedicamento: pedidoProcedimento.diasAtendidosPelaQuantidade,
                    valorUnitarioPago: Number(pedidoProcedimento.valorUnitarioPago),
                    patologia: null,
                    medicamento: null,
                    pedido: null,
                    medicamentoPatologia: {
                        idPatologia: pedidoProcedimento.idPatologia,
                        idMedicamento: pedidoProcedimento.medicamento.id
                    }
                }

                if (medicamento.idPedido && medicamento.medicamentoPatologia.idMedicamento && medicamento.medicamentoPatologia.idPatologia) {
                    this.salvarMedicamento(this.medicamentoPatologiaPedido.atualizar(medicamento), pedidoProcedimento);
                } else {
                    this.salvarMedicamento(this.medicamentoPatologiaPedido.incluir(medicamento), pedidoProcedimento);
                }
            } else {
                console.log('aqui 02')
                return this.procedimentoPedidoService.incluirOuAtualizarPedidoProcedimento(pedidoProcedimento).subscribe((procedimento) => {
                    this.loading = false;
                    this.loading$.emit(this.loading);
                    this.isDisabled = false;
                    this.isDisabled$.emit(this.isDisabled);
                    this.criarOuAtualizar$.emit(procedimento);
                    this.messageService.showSuccessMsg('Procedimento salvo com sucesso.');
                }, error => {
                    this.loading = false;
                    this.loading$.emit(this.loading)
                    this.isDisabled = false;
                    this.isDisabled$.emit(this.isDisabled);
                    this.messageService.showDangerMsg(error.error);
                });
            }
        }
        return of({});
    }

    private salvarMedicamento(metodo: Observable<MedicamentoPatologiaPedido>, pedidoProcedimento: PedidoProcedimento): void {
        metodo.subscribe((medicamento) => {
            this.loading = false;
            let procedimento = {...medicamento, ...pedidoProcedimento}
            console.log(procedimento);
            console.log('salvar medicamento')
            this.pedidoProcedimento.isEditing = false;
            procedimento.isEditing = false;
            this.criarOuAtualizar$.emit(procedimento as PedidoProcedimento);
            this.messageService.showSuccessMsg('Medicamento salvo com sucesso.');
        }, error => {
            this.loading = false;
            this.isDisabled = false;
            this.messageService.showDangerMsg(error.error);
        });
    }

    private removerMedicamentoPatologiaPedido(pedidoProcedimento: MedicamentoPatologiaPedido): Observable<any> {
        return this.medicamentoPatologiaPedido.excluir(pedidoProcedimento.id);
    }

    verificarEhTitularEPedidoEmAnalise():boolean {
        let situacao = 'SOB_ANALISE_EQUIPE_TEC_ADMINISTRATIVA';

        if(sessionStorage && sessionStorage.getItem('titular')){
            this.titular = sessionStorage.getItem('titular').toString;
        }

        if(this.pedido){
            return this._pedidoAux.verificarEhTitularEPedidoEmAnalise(this.titular, this.pedido, situacao);
        }
        
        return false;
    }
    
}
