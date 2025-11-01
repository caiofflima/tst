import {Component, EventEmitter, Input, OnDestroy, OnInit} from '@angular/core';
import {PedidoProcedimento} from "../../../../models/comum/pedido-procedimento";
import {Pedido} from "../../../../models/comum/pedido";
import {PedidoProcedimentoFormModel} from "../../models/pedido-procedimento-form.model";
import {AscProcedimentoPedidoCommon} from "../../asc-steps/procedimento/asc-procedimento-pedido-common";
import {AutorizacaoPreviaService} from "../../../../services/comum/pedido/autorizacao-previa.service";
import {MessageService} from "../../../messages/message.service";
import {fadeAnimation} from "../../../../animations/faded.animation";
import {inOutAnimation} from "../../../../animations/inOutAnimation.animation";
import {debounceTime, filter, map, switchMap, take, tap} from "rxjs/operators";
import {isNotUndefinedNullOrEmpty, isNotUndefinedOrNull} from "../../../../constantes";
import {ProcessoService} from "../../../../services/services";
import {TipoProcessoEnum} from "../../models/tipo-processo.enum";
import {MedicamentoPatologiaPedidoService} from "../../../../services/comum/medicamento-patologia-pedido.service";
import { ProcedimentoPedidoService } from 'app/shared/services/comum/procedimento-pedido.service';
import { StatusProcessoEnum } from 'app/arquitetura/shared/enums/status-processo.enum';

const labelProcedimentoPedido = {
    [TipoProcessoEnum.REEMBOLSO_CONSULTA]: 'Procedimentos do pedido',
    [TipoProcessoEnum.REEMBOLSO_ODONTOLOGICO]: 'Procedimentos do pedido',
    [TipoProcessoEnum.REEMBOLSO_ASSISTENCIAL]: 'Procedimentos do pedido',
    [TipoProcessoEnum.REEMBOLSO_VACINA]: 'Vacinas adicionadas',
    [TipoProcessoEnum.REEMBOLSO_MEDICAMENTO]: 'Medicamento do pedido'
}

@Component({
    selector: 'asc-card-procedimento',
    templateUrl: './asc-card-procedimento.component.html',
    styleUrls: ['./asc-card-procedimento.component.scss'],
    animations: [...fadeAnimation, ...inOutAnimation]
})
export class AscCardProcedimentoComponent extends AscProcedimentoPedidoCommon implements OnDestroy {

    override pedidoProcedimentoForm: PedidoProcedimentoFormModel;
    private _pedido: Pedido;
    private readonly pedido$ = new EventEmitter<Pedido>()

    @Input()
    loading = false;

    @Input()
    toTop = false;

    labelPedidoProcedimento: string;
    labelBotaoPedido: string = 'Adicionar Procedimento';
    isReembolsoMedicamento = false;
    showBotaoAddProcedimento = true;

    constructor(
        protected override readonly autorizacaoPreviaService: AutorizacaoPreviaService,
        protected override readonly messageService: MessageService,
        protected readonly procedimentosPedidoService: ProcedimentoPedidoService,
        protected override readonly medicamentoPatologiaPedidoService: MedicamentoPatologiaPedidoService,
        protected override readonly processoService: ProcessoService
    ) {
        super(autorizacaoPreviaService, messageService, procedimentosPedidoService, medicamentoPatologiaPedidoService, processoService);
    }

    consultarMedicamentos(idPedido: number) {
        this.medicamentoPatologiaPedidoService.consultarPorIdPedido(idPedido).subscribe(res => {
            this.procedimentosPedidoService.setPedidoProcedimentoTabela(res)
            this.pedidoProcedimentosTabela = res;
            }, error => {
           
            this.messageService.addMsgDanger(error.error);
            }
        );
    }

    @Input() set pedido(pedido: Pedido) {
        setTimeout(() => {
            if (isNotUndefinedOrNull(pedido)) {
                this._pedido = pedido;
                this.labelPedidoProcedimento = labelProcedimentoPedido[pedido.idTipoProcesso] || 'Procedimentos do pedido';
                if (pedido.idTipoProcesso === TipoProcessoEnum.REEMBOLSO_MEDICAMENTO) {
                    this.labelBotaoPedido = 'Adicionar Medicamento';
                } else if (pedido.idTipoProcesso === TipoProcessoEnum.REEMBOLSO_VACINA) {
                    this.labelBotaoPedido = 'Adicionar Vacina';
                }

                //console.log(this.pedido);
                if ( this.pedido.idTipoProcesso === TipoProcessoEnum.REEMBOLSO_MEDICAMENTO) {
                    this.consultarMedicamentos(this.pedido.id);
                } else {
        
                    this.registrarBuscaDeProcedimentos();
                }
        
                this.showBotaoAddProcedimento = this.mostrarBotaoAdicionarProcedimento(pedido);
                this.pedido$.emit(pedido);
            }
        }, 0);
    }

    public mostrarBotaoAdicionarProcedimento(pedido:Pedido):boolean{
        if(this.pedido && this.pedido.ultimaSituacao){
            if(this.labelBotaoPedido === 'Adicionar Procedimento'){ 
                if(this.isOcultarAdicionarProcedimento(this.pedido.ultimaSituacao.idSituacaoProcesso)
                    || this.isOcultarAdicionarProcedimentoPorAlcada(this.pedido.ultimaSituacao.idSituacaoProcesso)){
                    return false;
                }
            }else if(this.isOcultarAdicionarProcedimentoPorAlcada(this.pedido.ultimaSituacao.idSituacaoProcesso)){
                return false;
            }
        }
        
        return true;
    }

    isOcultarAdicionarProcedimento(idStatus:number):boolean{
        let lista = [StatusProcessoEnum.PEDIDO_DEFERIDO,
        StatusProcessoEnum.PEDIDO_INDEFERIDO,
        StatusProcessoEnum.CANCELADO_PELO_TITULAR,
        StatusProcessoEnum.PEDIDO_DEFERIDO_AUTOMATICAMENTE,
        StatusProcessoEnum.PROCESSO_ENCERRADO,
        StatusProcessoEnum.INDEFERIMENTO_RATIFICADO,
        StatusProcessoEnum.AUTORIZ_PREVIA_NEGADA,
        StatusProcessoEnum.AUTORIZACAO_PREVIA,
        StatusProcessoEnum.AUTORIZACAO_PREVIA_LIB_PARC,
        StatusProcessoEnum.AGUARD_CONS_PROFISSIONAL,
        StatusProcessoEnum.MIGRAR_SIST_SAUDE,
        StatusProcessoEnum.EM_PROCESSAMENTO_SIST_SAUDE,
        StatusProcessoEnum.FALHA_PROC_SIST_SAUDE,
        StatusProcessoEnum.EM_CONFERENCIA_SIST_SAUDE,
        StatusProcessoEnum.AGUARD_CAD_PROFISSIONAL_LIVRE,
        StatusProcessoEnum.CADASTRADO_SISTEMA_SAUDE];

        return lista.includes(idStatus);
    }

    isOcultarAdicionarProcedimentoPorAlcada(idStatus:number):boolean{
        let lista = [StatusProcessoEnum.AGUARDANDO_LIBERACAO_DE_ALCADA_COORDENADOR_CESAD,
        StatusProcessoEnum.AGUARDANDO_LIBERACAO_DE_ALCADA_GERENTE_DE_FILIAL_CESAD,
        StatusProcessoEnum.AGUARDANDO_LIBERACAO_DE_ALCADA_GERENTE_NACIONAL_GESAD,
        StatusProcessoEnum.AGUARDANDO_LIBERACAO_DE_ALCADA_SUPERINT_NACIONAL_SUBEN,
        StatusProcessoEnum.AGUARDANDO_LIBERACAO_DE_ALCADA_SUPERVISOR_CESAD,
        StatusProcessoEnum.ALCADA_LIBERADA,
        StatusProcessoEnum.ALCADA_NAO_LIBERADA];

        return lista.includes(idStatus);
    }

    get pedido() {
        return this._pedido
    }

    get isNotReembolsoConsulta() {
        if (this.pedido) {
            return this.pedido.idTipoProcesso !== TipoProcessoEnum.REEMBOLSO_CONSULTA;
        }

        return true;
    }

    override editar(pedidoProcedimento: PedidoProcedimento, index: number) {
        this.enableFormProcedimento = false;
        super.editar(pedidoProcedimento, index);
    }

    override cancelarProcedimento(event: any) {
        this.enableFormProcedimento = false;
        this.isToShowForm = true;
        this.isDisabled = false;
        this.isEditing = false;
        super.cancelarProcedimento(event);
    }

    abrirFormulario(): void {
        this.pedidoProcedimentoForm = new PedidoProcedimentoFormModel();
        this.enableFormProcedimento = TipoProcessoEnum.REEMBOLSO_CONSULTA !== this.pedido.idTipoProcesso;

        if (this.pedido && this.pedido.ultimaSituacao) {
            this.enableFormProcedimento = this.enableFormProcedimento
                && StatusProcessoEnum.AGUARD_DOC_COMPLEMENTAR !== this.pedido.ultimaSituacao.idSituacaoProcesso
                && StatusProcessoEnum.CADASTRADO_SISTEMA_SAUDE !== this.pedido.ultimaSituacao.idSituacaoProcesso
                && StatusProcessoEnum.CANCELADO_PELO_TITULAR !== this.pedido.ultimaSituacao.idSituacaoProcesso
                && StatusProcessoEnum.PROCESSO_ENCERRADO !== this.pedido.ultimaSituacao.idSituacaoProcesso
                && StatusProcessoEnum.AUTORIZ_PREVIA_NEGADA !== this.pedido.ultimaSituacao.idSituacaoProcesso;

            this.enableFormProcedimento = this.enableFormProcedimento &&
                StatusProcessoEnum.RECEBENDO_DOCUMENTACAO_TITULAR !== this.pedido.ultimaSituacao.idSituacaoProcesso;
        }

        this.isToShowForm = true;
        this.isDisabled = true;
        this.isEditing = false;
    }

    private registrarBuscaDeProcedimentos() {
        this.pedido$.pipe(
            debounceTime(500),
            filter((pedido: Pedido) => isNotUndefinedNullOrEmpty(pedido) && isNotUndefinedNullOrEmpty(pedido.id)),
            switchMap((pedido: Pedido) =>
                this.procedimentosPedidoService.consultarPedidosProcedimentoPorPedido(pedido.id).pipe(
                    tap((pedidosProcedimentos: PedidoProcedimento[]) => {
                        this.pedidoProcedimentosTabela = this.pedidoProcedimentosTabela.map(pedidoProcedimentoTabela => {
                            const pedidoProcedimentoCorrespondente = pedidosProcedimentos.find(pedidoProcedimentoBackend => pedidoProcedimentoBackend.id === pedidoProcedimentoTabela.id)
                          
                            if (pedidoProcedimentoCorrespondente) return {
                                ...pedidoProcedimentoCorrespondente,
                                ...pedidoProcedimentoTabela
                            };
                            return pedidoProcedimentoTabela;
                        })
                        this.procedimentoPedidoService.setPedidoProcedimentoTabela(this.pedidoProcedimentosTabela)
                    }),
                    map(() => pedido)
                )
            ),
            debounceTime(100),
            tap(() => this.isReembolsoMedicamento = this.pedido.idTipoProcesso === TipoProcessoEnum.REEMBOLSO_MEDICAMENTO),
            debounceTime(100),
            take(1),
        ).subscribe();
    }

    isToDisable(isToDisable: boolean) {
        this.isDisabled = isToDisable;
    }

    catchLoading($event: boolean) {
        this.loading = $event;
    }

    goToTop() {
        window.scrollTo(0, 0);
    }
}
