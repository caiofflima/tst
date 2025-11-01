import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Pedido, PedidoProcedimento,} from '../../../../models/entidades';
import {AutorizacaoPreviaService} from '../../../../services/comum/pedido/autorizacao-previa.service';
import {map, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import {MessageService} from '../../../messages/message.service';
import {CdkStepper} from '@angular/cdk/stepper';
import {isNotUndefinedNullOrEmpty} from "../../../../constantes";
import {AscProcedimentoPedidoCommon} from "./asc-procedimento-pedido-common";
import {fadeAnimation} from "../../../../animations/faded.animation";
import {ProcedimentoPedidoService} from "../../../../services/comum/procedimento-pedido.service";
import {Observable, Subject, Subscription} from "rxjs";
import {forkJoin} from "rxjs";
import {BeneficiarioService} from "../../../../services/comum/beneficiario.service";
import {BundleUtil} from "../../../../../arquitetura/shared/util/bundle-util";
import {HttpUtil} from "../../../../util/http-util";
import {ProcessoService} from "../../../../services/comum/processo.service";
import {MedicamentoPatologiaPedidoService} from "../../../../services/comum/medicamento-patologia-pedido.service";
import {TipoProcessoEnum} from "../../models/tipo-processo.enum";
import {MedicamentoPatologiaPedido} from "../../../../models/comum/medicamento-patologia-pedido";
import {NumberUtil} from "../../../../util/number-util";
import {ProcedimentoFormComponent} from "../procedimento-form/procedimento-form.component";
import { AutorizacaoPreviaPedidoPipe } from 'app/shared/pipes/autorizacao-previa-pedido.pipe';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'asc-procedimento-pedido',
    templateUrl: './asc-procedimento-pedido.component.html',
    styleUrls: ['./asc-procedimento-pedido.component.scss'],
    animations: [...fadeAnimation]
})
export class AscProcedimentoPedidoComponent extends AscProcedimentoPedidoCommon implements OnInit, OnDestroy {

    @Input()
    stepper: CdkStepper;

    @Input()
    pedido: Pedido;

    // @Input()
    // override idTipoProcesso: any;

    @Input()
     checkRestart: Subject<void>;

    @Input()
    set tipoProcesso(nome: string) {
        if (!nome) {
            return;
        }
        let separacaoNomeTipo = nome.split("-");
        this._tipoProcesso = separacaoNomeTipo[separacaoNomeTipo.length - 1].trim().toLowerCase();
    }

    @Input("tituloStepProcedimento")
    set tituloStepProcedimento(titulo: string) {
        this._tituloStepProcedimento = titulo;
    }

    @Output()
    readonly pedido$ = new EventEmitter<Pedido>();

    @ViewChild("procedimentoFormComponent")
    procedimentoFormComponent: ProcedimentoFormComponent

    private eventsSubscription: Subscription;

    _tipoProcesso: string = 'default';

    private _tituloStepProcedimento: string;

    resultDataAtendimento: number;

    constructor(
        protected override readonly processoService: ProcessoService,
        protected override readonly autorizacaoPreviaService: AutorizacaoPreviaService,
        protected override readonly messageService: MessageService,
        protected override readonly procedimentoPedidoService: ProcedimentoPedidoService,
        protected readonly beneficiarioService: BeneficiarioService,
        protected override readonly medicamentoPatologiaPedidoService: MedicamentoPatologiaPedidoService,
        private sanitizer: DomSanitizer
    ) {
        super(autorizacaoPreviaService, messageService, procedimentoPedidoService, medicamentoPatologiaPedidoService, processoService);
    }

    ngOnInit() {
        this.eventsSubscription = this.checkRestart.subscribe(() => {
            this._pedidoProcedimentosTabela = [];
            this.pedidoProcedimentosChanged.emit();
            this.pedidoProcedimentos$.emit(this._pedidoProcedimentosTabela);
        });
    }

    override ngOnDestroy() {
        super.ngOnDestroy();
        this.eventsSubscription.unsubscribe();
    }

    get tituloStepProcedimento(): string {
        return this._tituloStepProcedimento;
    }

    onSubmit(): void {
        if (this.formValido && this.parametroSelectProcedimento.idTipoProcesso !== TipoProcessoEnum.REEMBOLSO_CONSULTA) {
            this.procedimentoFormComponent.pedido = this.pedido;
            this.procedimentoFormComponent.salvarFormulario();

            this.showProgress = true;
            setTimeout(() => {
                if (this._pedidoProcedimentosTabela.length == 0) {
                    // Se não adicionou, retornar.
                    this.showProgress = false;
                    return;
                }
                this.registrarRequestIncluirPedido();
            }, 100);
        } else {
            this.showProgress = true;
            this.registrarRequestIncluirPedido();
        }
    }

    previousStep() {
        this.stepper.previous();
    }

    private registrarRequestIncluirPedido() { 
        const resultado = this.carregarAutorizacoesComDataAtentimentoValida();
        if(resultado !== null && resultado !== undefined) {
            resultado.subscribe(
                value => {
                    this.resultDataAtendimento = value;
                    if(this.resultDataAtendimento !== null && this.resultDataAtendimento !== undefined) {
                        this.showProgress = false;
                        this.showDangerMsg("Data de atendimento posterior à validade da autorização prévia selecionada.");
                    }
                    if(this.resultDataAtendimento === null || this.resultDataAtendimento === undefined) {
                        this.atualizarPedido();
                    }
                }
            );
        } else {
            this.atualizarPedido();
        }        
    }

    private atualizarPedido(){
        const possuiPedido = (pedido: Pedido) => isNotUndefinedNullOrEmpty(pedido) && isNotUndefinedNullOrEmpty(pedido.id);
            let createOrUpdate$ = this.autorizacaoPreviaService.incluirPedidoModoRascunho({
                beneficiario: this.beneficiario,
                tipoProcesso: {id: this.parametroSelectProcedimento.idTipoProcesso},
                idMotivoSolicitacao: this.idMotivoSolicitacao,
            });
            if (this.innerPedido && this.innerPedido.id) {
                createOrUpdate$ = of(this.innerPedido)
            }
            createOrUpdate$.pipe(
                tap((pedido: Pedido) => this.pedido$.emit(pedido)),
                switchMap((pedido: Pedido) => this.salvarProcedimentoPedido(pedido)),
                tap((pedido: Pedido) => {
                    if (isNotUndefinedNullOrEmpty(pedido)) this.innerPedido = pedido;
                }),
                tap(() => this.showProgress = false),
                switchMap((p: Pedido) => this.consultarPedidoSemelhante(p)),
                tap((ps: Pedido[]) => {
                    if (isNotUndefinedNullOrEmpty(ps)) {
                        throw new Error(BundleUtil.fromBundle('MA068'));
                    }
                }),
                HttpUtil.catchError(this.messageService, () => this.showProgress = false)
            ).subscribe(() => {
                this.showProgress = false;
                if (possuiPedido(this.innerPedido)) {
                    this.stepper.next();
                }
            });
    }

    private consultarPedidoSemelhante(p: Pedido): Observable<Pedido[]> {
        const pedidoToSend = {
            id: p.id,
            pedidosProcedimento: this.pedidoProcedimentosTabela,
            idTipoProcesso: p.idTipoProcesso,
            idBeneficiario: p.idBeneficiario,
            idMotivoSolicitacao: p.idMotivoSolicitacao,
        };

        return this.processoService.consultarPedidoEmAbertoSemelhante(new Pedido({...pedidoToSend}));
    }

    private salvarProcedimentoPedido(pedido: Pedido): Observable<Pedido> {
        const procedimentosPedido = [...this._pedidoProcedimentosTabela]
        this._pedidoProcedimentosTabela = this.mapearDadosDoPedidoNoProcedimento(pedido, procedimentosPedido);
        const incluirProcedimentoPedido = this.mapearServiceDeAtualizacaoOuCriacaoDoPedidoProcedimento(pedido, procedimentosPedido);
        return forkJoin(incluirProcedimentoPedido).pipe(
            switchMap(this.consultarPedidoProcedimentoOuMedicamento(pedido)),
            tap((pedidosProcedimentos: PedidoProcedimento[]) => {
                pedidosProcedimentos = pedidosProcedimentos.map(p => {
                    const procedimento = procedimentosPedido.find(pp => pp.idProcedimento == p.idProcedimento)
                    if( procedimento && procedimento.autorizacaoPrevia ){
                        p.autorizacaoPrevia = procedimento.autorizacaoPrevia
                    }
                    return p
                }) 
                this._pedidoProcedimentosTabela = [...pedidosProcedimentos]
            }),
            tap(() => {
                this.pedidoProcedimentos$.emit(this._pedidoProcedimentosTabela);
            }),
            map(() => pedido)
        )
    }

    private carregarAutorizacoesComDataAtentimentoValida(): any {
        if(this._pedidoProcedimentosTabela[0].autorizacaoPrevia !== null &&
            this._pedidoProcedimentosTabela[0].autorizacaoPrevia !== undefined) {
            const dataAtendimento = this._pedidoProcedimentosTabela[0].dataAtendimento;
            const idAutorizacaoPreviaSiags = this._pedidoProcedimentosTabela[0].autorizacaoPrevia.idAutorizacaoPreviaSiags;

            return this.autorizacaoPreviaService.verificarAutorizacoesComDataAtentimentoValida(idAutorizacaoPreviaSiags,
                this.formatarData(dataAtendimento)).pipe(
                HttpUtil.catchErrorAndReturnEmptyObservableByKey(this.messageService, 'error'),
                tap(() => console.log(' carregarAutorizacoesComDataAtentimentoValida '))
            );
        }
    }

    
    private mapearDadosDoPedidoNoProcedimento(pedido: Pedido, pedidoProcedimentos: PedidoProcedimento[]) {
        return pedidoProcedimentos.map(procedimentoPedido => {
            try{
                pedido.nomeMotivoSolicitacao = procedimentoPedido.autorizacaoPrevia.nomeMotivoSolicitacao
            }catch(e){}
            procedimentoPedido.idPedido = pedido.id;
            procedimentoPedido.pedido = pedido;
            procedimentoPedido.idGrauProcedimento = procedimentoPedido.idGrauProcedimento || procedimentoPedido.idRegiaoOdontologica;
            procedimentoPedido.idProcedimento = procedimentoPedido.idProcedimento || procedimentoPedido.idPatologia;
            procedimentoPedido.valorUnitarioPago = NumberUtil.convertStringToNumber(procedimentoPedido.valorUnitarioPago);
            procedimentoPedido.tsOperacao = procedimentoPedido.tsOperacao;
            procedimentoPedido.autorizacaoPrevia = procedimentoPedido.autorizacaoPrevia
            return procedimentoPedido;
        });
    }

    private consultarPedidoProcedimentoOuMedicamento(pedido: Pedido) {
        let operationConsultaPedidoProcedimentoOuMedicamentoPatologiaPedido =
            () => this.procedimentoPedidoService.consultarPedidosProcedimentoPorPedido(pedido.id);
        if (pedido.idTipoProcesso === TipoProcessoEnum.REEMBOLSO_MEDICAMENTO) {
            operationConsultaPedidoProcedimentoOuMedicamentoPatologiaPedido =
                () => this.processoService.consultarMedicamentoPatologiaPedidoPorPedido(pedido.id);
        }
        return operationConsultaPedidoProcedimentoOuMedicamentoPatologiaPedido;
    }

    private mapearServiceDeAtualizacaoOuCriacaoDoPedidoProcedimento(pedido: Pedido, pedidosProcedimento: PedidoProcedimento[]) {
        return pedidosProcedimento.map(procedimentoPedido => this.definirServicoParaIncluirProcedimentoOuMedicamentoPatologiaPedido(pedido, procedimentoPedido));
    }

    private definirServicoParaIncluirProcedimentoOuMedicamentoPatologiaPedido(pedido: Pedido, procedimentoPedido: PedidoProcedimento | MedicamentoPatologiaPedido | any) {
        if (pedido.idTipoProcesso === TipoProcessoEnum.REEMBOLSO_MEDICAMENTO) {
            const medicamentoPatologiaPedido = {...procedimentoPedido} as MedicamentoPatologiaPedido;
            medicamentoPatologiaPedido.qtdMedicamento = procedimentoPedido.qtdSolicitada;
            medicamentoPatologiaPedido.qtdDiasAtendidosPeloMedicamento = procedimentoPedido.diasAtendidosPelaQuantidade;
            medicamentoPatologiaPedido.medicamentoPatologia = {
                idMedicamento: procedimentoPedido.idMedicamento,
                idPatologia: procedimentoPedido.idPatologia
            }
            if (!procedimentoPedido.id) {
                return this.medicamentoPatologiaPedidoService.incluir(medicamentoPatologiaPedido);
            } else {
                medicamentoPatologiaPedido.idPedido = pedido.id;
                return this.medicamentoPatologiaPedidoService.atualizar(medicamentoPatologiaPedido);
            }
        }
        
        return this.procedimentoPedidoService.incluirOuAtualizarPedidoProcedimento({...procedimentoPedido as PedidoProcedimento});
    }

    private formatarData(data:Date):string{
        let dataFormatada = '';
        
        if(data) {
          const dia = ('0' + data.getUTCDate()).slice(-2);
          const mes = ('0' + (data.getUTCMonth() + 1)).slice(-2);
          const ano = data.getUTCFullYear();
          
          dataFormatada = `${ano}-${mes}-${dia}`;
        } 
        return  dataFormatada;
      }
    
    textoFormatadoAutorizacaoPrevia(pedidoProcedimento: PedidoProcedimento){
        let textoApresentar = '-'
        if( pedidoProcedimento && pedidoProcedimento.autorizacaoPrevia ){
            textoApresentar = new AutorizacaoPreviaPedidoPipe().transform( pedidoProcedimento.autorizacaoPrevia );
            return this.sanitizer.bypassSecurityTrustHtml( textoApresentar )
        }
        return textoApresentar 
        
        
    }
}
