import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {
    AscSelectComponentProcedimentosParams
} from '../../../../shared/components/asc-select/models/asc-select-component-procedimentos.params';
import {
    Beneficiario,
    GrauProcedimento,
    Pedido,
    PedidoProcedimento,
    Procedimento,
} from '../../../../shared/models/entidades';
import {ArrayUtil} from '../../../../shared/util/array-util';
import {PedidoProcedimentoFormModel} from '../models/pedido-procedimento-form.model';
import {ObjectUtils} from '../../../../shared/util/object-utils';
import {AutorizacaoPreviaService} from '../../../../shared/services/comum/pedido/autorizacao-previa.service';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import {MessageService} from '../../../../shared/components/messages/message.service';
import {HttpErrorResponse} from '@angular/common/http';
import {CdkStepper} from '@angular/cdk/stepper';
import {isNotUndefinedNullOrEmpty} from "../../../../shared/constantes";
import {ProcedimentoPedidoService} from "../../../../shared/services/comum/procedimento-pedido.service";
import {forkJoin} from "rxjs";
import {Observable, Subject, Subscription} from "rxjs";
import {TipoProcessoEnum} from "../../../../shared/components/asc-pedido/models/tipo-processo.enum";

@Component({
    selector: 'app-procedimento',
    templateUrl: './procedimento.component.html',
    styleUrls: ['./procedimento.component.scss'],
})
export class ProcedimentoComponent implements OnInit, OnDestroy {

    @Input()
    beneficiario: Beneficiario;

    @Input()
    idMotivoSolicitacao: number;

    @Input()
    stepper: CdkStepper;

    @Input()
    checkRestart: Subject<void>;

    @Output()
    readonly pedidoProcedimentos = new EventEmitter<PedidoProcedimento[]>();

    @Output()
    readonly grauSelecionado = new EventEmitter<GrauProcedimento>();

    @Output()
    readonly pedido = new EventEmitter<Pedido>();

    @Output()
    readonly pedidoProcedimentosChanged = new EventEmitter<void>();

    private innerPedido: Pedido;

    parametroSelectProcedimento: AscSelectComponentProcedimentosParams = {};

    procedimento: Procedimento;
    showProgress = false;

    pedidoProcedimentosTabela: PedidoProcedimento[] = [];
    pedidoProcedimentoForm: PedidoProcedimentoFormModel;

    isEditing = false;
    isShowTable = false;

    private eventsSubscription: Subscription;

    constructor(
        private readonly autorizacaoPreviaService: AutorizacaoPreviaService,
        private readonly messageService: MessageService,
        private readonly procedimentoPedidoService: ProcedimentoPedidoService,
    ) {
    }

    ngOnInit() {
        this.eventsSubscription = this.checkRestart.subscribe(() => {
            this.pedidoProcedimentoForm = {};
            this.pedidoProcedimentosTabela = [];
        });
    }

    ngOnDestroy() {
        this.eventsSubscription.unsubscribe();
    }

    private _pedidoProcedimentoVersao: number;

    @Input()
    set pedidoProcedimentoVersao(versao: number) {
        this._pedidoProcedimentoVersao = versao;
    }

    @Input()
    set idTipoProcesso(idTipoProcesso: number) {
        ObjectUtils.applyWhenIsNotEmpty(idTipoProcesso, () => {
            console.log('set idTipoProcesso')
            let isIndisponibilidadeRedeCredenciada = (this.idMotivoSolicitacao == 40 || this.idMotivoSolicitacao == 73 || this.idMotivoSolicitacao == 78 || this.idMotivoSolicitacao == 74);
            this.parametroSelectProcedimento = {idTipoProcesso: idTipoProcesso, isIndisponibilidadeRedeCredenciada: isIndisponibilidadeRedeCredenciada};
            this.pedidoProcedimentosTabela = this.pedidoProcedimentosTabela
            .filter(pedidoProcedimento => pedidoProcedimento.idProcedimento === idTipoProcesso);
        });
    }

    onSubmit(): void {
        //console.log(" onSubmit(): void { -> pedido procedimento ==========");
        const possuiPedido = (pedido: Pedido) => isNotUndefinedNullOrEmpty(pedido) && isNotUndefinedNullOrEmpty(pedido.id);
        this.pedidoProcedimentos.emit(this.pedidoProcedimentosTabela);
        this.showProgress = true;

        let criarOuAtualizar = this.autorizacaoPreviaService.incluirPedidoModoRascunho({
            beneficiario: this.beneficiario,
            tipoProcesso: {id: this.parametroSelectProcedimento.idTipoProcesso},
            idMotivoSolicitacao: this.idMotivoSolicitacao,
        });

        if (this.innerPedido && this.innerPedido.id) {
            if (this.idMotivoSolicitacao != this.innerPedido.idMotivoSolicitacao) {
                this.innerPedido.idMotivoSolicitacao = this.idMotivoSolicitacao;
            } else {
                criarOuAtualizar = of(this.innerPedido);
            }
        }
        criarOuAtualizar.pipe(
            switchMap((pedido: Pedido) => this.salvarProcedimentoPedido(pedido)),
            catchError((httpResponseError: HttpErrorResponse) => {
                this.messageService.addMsgDanger(httpResponseError.error);
                this.showProgress = false;
                return of({});
            }),
            tap((pedido: Pedido) => {
                if (isNotUndefinedNullOrEmpty(pedido)) this.innerPedido = pedido;
                this.pedido.emit(this.innerPedido)
            }),
            tap(() => this.showProgress = false),
        ).subscribe(() => {
            this.showProgress = false;
            if (possuiPedido(this.innerPedido)) {
                this.stepper.next();
            }
        });
    }

    adicionarProcedimento(pedidoProcedimento: PedidoProcedimento): void {
        if (this.hasIndexOnTheForm()) {
            this.pedidoProcedimentosTabela[this.pedidoProcedimentoForm.index] = pedidoProcedimento;
        } else {
            this.pedidoProcedimentosTabela.push(pedidoProcedimento);
        }

        this.resetarForm();
        this.isEditing = false;
        this.isShowTable = true;
    }

    private resetarForm(): void {
        this.pedidoProcedimentoForm = {
            idGrauProcedimento: null,
            idProcedimento: null,
            qtdSolicitada: null,
            index: null,
            tsOperacao: new Date()
        };
    }

    private hasIndexOnTheForm(): boolean {
        return isNotUndefinedNullOrEmpty(this.pedidoProcedimentoForm) && isNotUndefinedNullOrEmpty(this.pedidoProcedimentoForm.index);
    }

    editar(pedidoProcedimento: PedidoProcedimento, index: number): void {
        this.pedidoProcedimentoForm = {
            idGrauProcedimento: pedidoProcedimento.idGrauProcedimento,
            idProcedimento: pedidoProcedimento.idProcedimento,
            qtdSolicitada: pedidoProcedimento.qtdSolicitada,
            tsOperacao: pedidoProcedimento.tsOperacao,
            index,
        };

        console.log('editar');
        console.log(pedidoProcedimento)
        this.isEditing = true;

    }

    remove(pedidoProcedimento: PedidoProcedimento): void {
        ArrayUtil.remove(this.pedidoProcedimentosTabela, pedidoProcedimento);
    }

    adicionarProcedimentos(procedimentos: PedidoProcedimento[]) {
        this.pedidoProcedimentos.emit(procedimentos);
    }

    adicionarProcedimentoPanel(procedimento: Procedimento) {
        this.procedimento = procedimento;
    }

    cancelarProcedimento() {
        this.isEditing = false;
        this.resetarForm();
    }

    resetarProcedimento() {
        this.isEditing = false;
        this.isShowTable = false;
        this.pedidoProcedimentoForm = {};
        this.pedidoProcedimentosTabela = [];
        this.parametroSelectProcedimento = {...this.parametroSelectProcedimento};
        this.pedidoProcedimentoVersao++;
    }

    isTipoProcessoOdontologico() {
        return this.parametroSelectProcedimento.idTipoProcesso === TipoProcessoEnum.AUTORIZACAO_PREVIA_ODONTOLOGICA;
    }

    fecharModal(): void {
        const modal = document.getElementById('modalProcediento');
        if (modal) {
            modal.classList.remove('show');
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.remove();
            }
        }
    }

    private salvarProcedimentoPedido(pedido: Pedido): Observable<any> {
        console.log('aqui 01')
        const incluirProcedimentoPedido = this.pedidoProcedimentosTabela.map(procedimentoPedido => {
            procedimentoPedido.pedido = pedido;
            procedimentoPedido.idPedido = pedido.id;
            return this.procedimentoPedidoService.incluirOuAtualizarPedidoProcedimento(procedimentoPedido)
        });

        return forkJoin(incluirProcedimentoPedido).pipe(map(() => pedido))
    }
}
