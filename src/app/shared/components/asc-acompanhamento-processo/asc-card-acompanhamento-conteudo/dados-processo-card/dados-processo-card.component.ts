import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {Pedido} from "../../../../models/comum/pedido";
import {MotivoSolicitacaoService} from "../../../../services/comum/motivo-solicitacao.service";
import {debounceTime, filter, switchMap, take, takeUntil, tap} from "rxjs/operators";
import {MotivoSolicitacao} from "../../../../models/comum/motivo-solicitacao";
import {isNotUndefinedNullOrEmpty} from "../../../../constantes";
import {PatologiaService} from '../../../../services/comum/patologia.service';
import {FormControl} from '@angular/forms';
import {
    InscricaoProgramasMedicamentosService
} from "../../../../services/comum/inscricao-programas-medicamento.service";
import {ProcessoService} from "../../../../services/comum/processo.service";
import {AscComponenteAutorizadoMessage} from "../../../asc-pedido/asc-componente-autorizado-message";
import {Patologia} from "../../../../models/comum/patologia";
import {SituacaoPedido} from "../../../../models/comum/situacao-pedido";
import {Util} from "../../../../../arquitetura/shared/util/util";
import {HttpParams} from '@angular/common/http';
import { SituacaoPedidoService } from 'app/shared/services/comum/situacao-pedido.service';
import { MessageService, SessaoService } from 'app/shared/services/services';
import { MotivoSolicitacaoEnum } from 'app/arquitetura/shared/enums/motivoCancelamento.enum';
import { AtualizarProcessoDTO } from 'app/shared/models/dto/atualizar-processo';

let jQuery: any;

@Component({
    selector: 'asc-dados-processo-card',
    templateUrl: './dados-processo-card.component.html',
    styleUrls: ['./dados-processo-card.component.scss']
})
export class DadosProcessoCardComponent extends AscComponenteAutorizadoMessage implements OnInit {

    private _processo: Pedido;
    private _pedidoAux = new Pedido();
    private noCaraterSolicitacao: any;
    private readonly processo$ = new EventEmitter<Pedido>();

    tituloPeg = 'Número da Autorização - SIAGS';
    tituloFinalidade = 'Finalidade';
    observacao: string = '—';
    motivoSolicitacao: MotivoSolicitacao;
    dataEncerramento: Date;
    dataCadastramento: Date;
    modoEdicao: boolean = false;
    idPatologiaSelecionadaControl: FormControl = new FormControl();
    idCaraterSolicitacaoSelecionadaControl: FormControl = new FormControl();
    nomePatologia: string = '';
    nomeCaraterSolicitacao: string = '';
    idPatologia: number = null;
    idCaraterSolicitacao: number = null;
    numeroPeg: number = null;
    dataValidade: Date = null;

    titular: any;

    constructor(
        private readonly motivoSolicitacaoService: MotivoSolicitacaoService,
        private readonly patologiaService: PatologiaService,
        private readonly inscricaoProgMed: InscricaoProgramasMedicamentosService,
        private readonly processoService: ProcessoService,
        private readonly situacaoPedidoService: SituacaoPedidoService,
        override readonly messageService: MessageService,
        readonly sessaoService: SessaoService
    ) {
        super(messageService);
    }

    ngOnInit() {
        this.registrarBuscaMotivoSolicitacao();
        this.extrairPatologiaPedido();
    }

    @Input() set processo(processo: Pedido) {
        this.processo$.emit(processo)
        this._processo = processo;

        if(this._processo.observacao){
            this.observacao = this._processo.observacao;
        }
    }

    get processo() {
        return this._processo
    }

    goToTop() {
        window.scrollTo(0, 0);
    }

    deveApresentarDataOcorrencia(){
        return this.processo
            && (this.processo.idMotivoSolicitacao == MotivoSolicitacaoEnum.DISSOLUCAO_DE_CASAL_CAIXA
            || (this.processo.idMotivoSolicitacao == MotivoSolicitacaoEnum.SEPARACAO_OU_DIVORCIO
                || this.processo.idMotivoSolicitacao == MotivoSolicitacaoEnum.FALECIMENTO));
    }

    private registrarBuscaMotivoSolicitacao(): void {
        this.processo$.pipe(
            debounceTime(500),
            filter(isNotUndefinedNullOrEmpty),
            tap(this.extrairDataEncerramento()),
            tap((processo: Pedido) => this.extrairNumeroPeg(processo)),
            tap((processo: Pedido) => this.extrairCaraterSolicitacao(processo)),
            tap((processo: Pedido) => {
                if (processo && processo.idTipoProcesso >= 11 && processo.idTipoProcesso <= 14) {
                    this.tituloFinalidade = 'Motivo da solicitação';
                }
            }),
            switchMap((processo: Pedido) => this.motivoSolicitacaoService.consultarPorId(processo.idMotivoSolicitacao)),
            takeUntil(this.unsubscribe$),
            tap((motivoSolicitacao: MotivoSolicitacao) => this.motivoSolicitacao = motivoSolicitacao),
        ).subscribe();

    }

    private obterDataValidadePorNumberoAutorizacao(): void {
        if (this.numeroPeg != null) {
            this.processoService.consultarDataValidadePorNumeroAutorizacao(this.numeroPeg)
            .subscribe(data => {
                this.dataValidade = data;
            });
        }
    }

    private extrairDataEncerramento(): (p: Pedido) => void {
        return (processo: Pedido) => {
            if (processo.ultimaSituacao && processo.ultimaSituacao.situacaoProcesso.conclusivo === 'SIM') {
                this.dataEncerramento = Util.getDate(processo.ultimaSituacao.dataCadastramento)
            }

            this.situacaoPedidoService.consultarSituacoesPedidoPorPedido(processo.id).pipe(
                take<SituacaoPedido[]>(1)
            ).subscribe(situacoes => {
                if (situacoes && situacoes.length > 0) {
                    const situacao = situacoes[situacoes.length - 1];
                    this.dataCadastramento = Util.getDate(situacao.dataCadastramento);
                }
            })
        };
    }

    private extrairNumeroPeg(processo): void {
        if (processo.tipoProcesso && processo.tipoProcesso.idTipoPedido === 9) {
            this.tituloPeg = 'Número do PEG - SIAGS';
        }
            this.processoService.consultarNumeroPeg(processo).pipe(
                take<number>(1)
            ).subscribe(numero => {
                this.numeroPeg = numero;
                this.obterDataValidadePorNumberoAutorizacao();
            });
    }

    private extrairCaraterSolicitacao(processo): void {
        if (isNotUndefinedNullOrEmpty(processo) && isNotUndefinedNullOrEmpty(processo.caraterSolicitacao)) {
            this.nomeCaraterSolicitacao = processo.caraterSolicitacao.nome;
            this.idCaraterSolicitacao = processo.caraterSolicitacao.id;
        }
    }

    private extrairPatologiaPedido(): void {
        this.processo$.pipe(
            debounceTime(500),
            filter(isNotUndefinedNullOrEmpty),
            switchMap((processo: Pedido) => this.patologiaService.consultarPatologiaPedido(processo.id.toString())),
            filter(isNotUndefinedNullOrEmpty),
            tap((res: Patologia) => {
                this.nomePatologia = res.nome;
                this.idPatologia = res.id;
            }),
            takeUntil(this.unsubscribe$),
        ).subscribe();
    }

    public clickAlerarDados(status) {
        this.modoEdicao = status;
        if (status === true) {
            this.idCaraterSolicitacaoSelecionadaControl.setValue(this.idCaraterSolicitacao);
            // Inscrição de programas em medicamentos
            if (this._processo.idTipoProcesso === 5) {
                this.idPatologiaSelecionadaControl.setValue(this.idPatologia);
            }
        }
    }

    public onSubmit() {
      console.log('onSubmit', this._processo.idTipoProcesso);

        //inscricao de programas em medicamentos
        if (this._processo.idTipoProcesso === 5) {
            this.salvaDadosProcessoInscricaoProgramas();
        } else {
            this.salvaDadosProcessoGenerico();
        }
    }

    // FUNCIONALIDADES REFERENTE AO MÓDULO INSCRIÇÃO EM PROGRAMAS.
    private salvaDadosProcessoInscricaoProgramas() {
        const formData = new FormData();
        formData.append('data', btoa(JSON.stringify(this.formInscricaoMedicamentos())));
        this.inscricaoProgMed.atualizar(formData).subscribe(res => {
            this.messageService.showSuccessMsg('Dados do processo atualizado com sucesso.');
            this.recarregarValoresInscricaoMedicamentos(res);
            this.modoEdicao = false;
        }, () => {
            this.messageService.addMsgDanger('Um erro aconteceu. Por favor, entre em contato com o administrador');
            this.modoEdicao = true;
        });
    }

    private formInscricaoMedicamentos() {
        return {
            idPatologia: this.idPatologiaSelecionadaControl.value,
            idCaraterSolicitacao: this.idCaraterSolicitacaoSelecionadaControl.value,
            idPedido: this._processo.id,
            noPatologia: jQuery('#patologiaPrgMed :selected').text(),
            noCaraterSolicitacao: jQuery('#caraterSolcitacaoProg :selected').text(),
            observacao: this.observacao,
        }
    }

    private recarregarValoresInscricaoMedicamentos(res): void {
        this.nomePatologia = res.noPatologia;
        this.nomeCaraterSolicitacao = res.noCaraterSolicitacao;
        this.idCaraterSolicitacao = res.idCaraterSolicitacao;
        this.idPatologia = res.idPatologia;
    }

    private salvaDadosProcessoGenerico() {
        let dadosProcesso = this.carregarDadosProcessoGenerico();
        let atualizaProcesso = this.carregarDadosAtualizarProcesso();

        this.processoService.atualizarProcesso(atualizaProcesso).subscribe(() => {
                this.messageService.showSuccessMsg('Dados do processo atualizado com sucesso.');
                this.nomeCaraterSolicitacao = dadosProcesso.noCaraterSolicitacao;
                this.idCaraterSolicitacao = dadosProcesso.idCaraterSolicitacao;
                this.modoEdicao = false;
                this._processo.observacao = atualizaProcesso.observacao;
                this.observacao = atualizaProcesso.observacao;
            }, () => {
                this.messageService.addMsgDanger('Um erro aconteceu. Por favor, entre em contato com o administrador');
                this.modoEdicao = true;
            }
        );
    }

    private carregarDadosProcessoGenerico() {
        return {
            idCaraterSolicitacao: this.idCaraterSolicitacaoSelecionadaControl.value,
            idPedido: this._processo.id,
            noCaraterSolicitacao: this.noCaraterSolicitacao.nome,
        }
    }

    private carregarDadosAtualizarProcesso() {
        const atualizarProcesso: AtualizarProcessoDTO = {
                idPedido: this._processo.id,
                idCaraterSolicitacao: this.idCaraterSolicitacaoSelecionadaControl.value,
                observacao: this.observacao !== '-' ? this.observacao : undefined
            };
        return atualizarProcesso;
    }

    verificarEhTitularEPedidoEmAnalise():boolean {
        let situacao = 'SOB_ANALISE_EQUIPE_TEC_ADMINISTRATIVA';

        if(sessionStorage && sessionStorage.getItem('titular')){
            this.titular = sessionStorage.getItem('titular').toString;
        }

        if(this.processo){
            return this._pedidoAux.verificarEhTitularEPedidoEmAnalise(this.titular, this.processo, situacao);
        }
        return false;
    }

    dadoSelecionado(event){
        this.noCaraterSolicitacao = event
    }
}
