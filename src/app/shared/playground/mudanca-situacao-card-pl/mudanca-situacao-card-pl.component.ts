import { MotivoNegacao } from './../../models/comum/motivo-negacao';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MessageService, ProcessoService} from "app/shared/services/services";
import {isNotUndefinedNullOrEmpty} from "app/shared/constantes";
import {fadeAnimation} from "app/shared/animations/faded.animation";
import {ArrayUtil} from 'app/shared/util/array-util';
import {ArquivoParam} from 'app/shared/components/asc-file/models/arquivo.param';
import {Arquivo} from "app/shared/models/dto/arquivo";
import {
    AscModalVisualizarDocumentoComponent
} from "app/shared/components/asc-pedido/asc-documentos/modal-visualizar-documento/asc-modal-visualizar-documento.component";
import {Pedido} from "app/shared/models/comum/pedido";
import {SituacaoProcessoService} from 'app/shared/services/comum/situacao-processo.service';
import {MotivoNegacaoService} from 'app/shared/services/comum/motivo-negacao.service';
import {SituacaoPedidoService} from 'app/shared/services/comum/situacao-pedido.service';
import {FileUploadService} from 'app/shared/services/comum/file-upload.service';
import {AscComponenteAutorizadoMessage} from "../../components/asc-pedido/asc-componente-autorizado-message";
import {take} from "rxjs/operators";
import {SelectItem} from "primeng/api";

interface ArquivoModal {
    arquivos: Arquivo[];
    arquivo: Arquivo;
    modalVisualizarDocumentoComponent: AscModalVisualizarDocumentoComponent;
    event: any;
}

@Component({
    selector: 'asc-mudanca-situacao-card-pl',
    templateUrl: './mudanca-situacao-card-pl.component.html',
    styleUrls: ['./mudanca-situacao-card-pl.component.scss'],
    animations: [...fadeAnimation]
})
export class MudancaSituacaoCardPlComponent extends AscComponenteAutorizadoMessage implements OnInit {
    private readonly arquivo$ = new EventEmitter<ArquivoModal>();

    @Input()
    processo: Pedido;

    @Output("onMudancaConcluida")
    onMudancaConcluida$ = new EventEmitter<void>();

    @Output()
    onSituacoesInvalidas = new EventEmitter<void>();

    itensSituacoesProcesso: SelectItem[] = [];
    itensMotivoNegacao: SelectItem[] = [];
    fcSituacaoProcesso = new FormControl();
    fcMotivoNegacao = new FormControl();
    fcHistoricoSituacao = new FormControl();
    objProcesso: any = {};
    ePositivo: boolean = true;
    fileUpload?: any | Set<Arquivo> | Arquivo[] = [];
    dadosSituacao: any = null;
    dadosNegacao: any = null;
    dadosHistorico: any = null;
    loading: boolean = false;
    isProcessoAutorizacao = false;
    isProcessoReembolso = false;
    fcAutorizacao = new FormControl();
    autorizacao = null;
    textoHistoricoNegacao: string = "";
    itensHistoricoMotivoNegacao: MotivoNegacao[] = [];
    dataValidade: Date = null;
    numeroAutorizacao: Number = null;
    isHabilitaBotaoPorNumeroAutorizacao: boolean = false;

    numeroAutorizacaoControl =  new FormControl('', [
        Validators.required, Validators.pattern("/^\d{1,8}$/")
    ]);

    readonly CADASTRO_SISTEMA_SAUDE: number = 42;
    readonly EM_CONFERENCIA_SISTEMA_SAUDE: number = 40;
    
    itensReembolso: number[] = [7, 8, 9, 6, 10];
    itensAutorizacao: number[] = [4, 2, 3, 20, 1];

    isExibeCampoAutorizacaoOuReembolso = false;

    constructor(
        protected override messageService: MessageService,
        private situacaoProcessoService: SituacaoProcessoService,
        private motivoNegacaoService: MotivoNegacaoService,
        private situacaoPedidoService: SituacaoPedidoService,
        private uploadService: FileUploadService,
        private processoService: ProcessoService,
    ) {
        super(messageService);
        this.onChangeFormValue();
        this.onChangeMotivoNegacao();
    }

    ngOnInit() {
        this.carregarDadosProcesso();
    }

    public arquivos(uploadFileParam: ArquivoParam): void {
        uploadFileParam.files.forEach((file: Arquivo) => {
            this.fileUpload.push(file);
        });
    }

    public abrirModalVisualizarDocumentos(event: any, arquivo: Arquivo, modalVisualizarDocumentoComponent: AscModalVisualizarDocumentoComponent, arquivos: Arquivo[]): void {
        const arquivoModal = {event, arquivo, arquivos, modalVisualizarDocumentoComponent};
        if (arquivo && arquivo.id) {
            this.arquivo$.emit(arquivoModal);
        } else {
            this.actionToOpenModel(arquivoModal);
        }
    }

    public removerDocumento(index: number) {
        this.messageService.addConfirmYesNo(
            this.bundle('MA129'), () => {
                const file = this.fileUpload[index];
                ArrayUtil.remove(this.fileUpload, file);
                this.messageService.showSuccessMsg('MA039');
            }, null, null, 'Sim', 'Não');
    }

    public atualizarSituacaoProcesso(): void {
        if (this.validarCamposObrigatorio()) {
            this.showDangerMsg('MA007');
        } else {
            this.validarPEG()
        }
    }

    validarPEG():void{
        if(this.isProcessoReembolso && this.isExibeCampoAutorizacaoOuReembolso){
            if(this.autorizacao){
                this.processoService.validaNumeroPeg(this.processo.id.toString(), this.autorizacao.toString())
                .subscribe(msgRetorno => {
                    if(msgRetorno==="" || msgRetorno===null || msgRetorno===undefined){
                        this.executarOperacaoAlteracao();
                    }else{
                        this.messageService.addMsgDanger(msgRetorno);
                    }
                }, (err) => {
                    this.messageService.addMsgDanger(err.error);
                }); 
            }
        }else{
            this.executarOperacaoAlteracao();
        }
    }

    public obterDataValidacaoPorNumeroAutorizacao(): void {
        let numeroAutorizacao = this.fcAutorizacao.value;
        if(!this.isProcessoReembolso){
            if (numeroAutorizacao != null) {
                this.validarNumeroAutorizacao(Number(numeroAutorizacao));
            } else {
                this.dataValidade = null;
                if (this.dadosSituacao != null && (this.dadosSituacao.id === this.CADASTRO_SISTEMA_SAUDE)) {
                    this.isHabilitaBotaoPorNumeroAutorizacao = true;
                }
            }
        }
    }

    public limpaCampos(): void {
        this.fcSituacaoProcesso.reset()
        this.fcMotivoNegacao.reset();
        this.fcHistoricoSituacao.reset();
        this.fcAutorizacao.reset();
        this.fileUpload = [];

        this.dadosSituacao = null;
        this.dadosNegacao = null;
        this.dadosSituacao = null;
        this.dadosHistorico = null;
        this.autorizacao = null;
        this.loading = false;
        this.dataValidade = null;
        this.isHabilitaBotaoPorNumeroAutorizacao = false;
    }

    private validarNumeroAutorizacao(numeroAutorizacao: Number): void {
        this.numeroAutorizacao = numeroAutorizacao;
        this.processoService.consultarDataValidadePorNumeroAutorizacao(numeroAutorizacao)
            .subscribe(data => {
                if (data === null) {
                    this.messageService.addMsgDanger("Autorização não Localizada");
                    this.isHabilitaBotaoPorNumeroAutorizacao = true;
                    this.dataValidade = null;
                } else { 
                    this.dataValidade = data;
                    this.isHabilitaBotaoPorNumeroAutorizacao = false;
                }
            }),
            () => {
                this.messageService.addMsgDanger("Autorização não Localizada");
                this.isHabilitaBotaoPorNumeroAutorizacao = true;
                this.dataValidade = null;
            }
    }

    private onChangeFormValue(): void {
        this.fcSituacaoProcesso.valueChanges.subscribe(next => {
            this.dadosNegacao = null;
            this.dadosSituacao = next;
            this.carregarItensMotivoNegacao(next);
            this.verificarExibicaoCampoNumeroAutorizacaoReembolso(next);
            this.limparMotivoAutorizacaoPorSituacao();
        });

        this.fcMotivoNegacao.valueChanges.subscribe(next => {
            this.dadosNegacao = next;
        });

        this.fcHistoricoSituacao.valueChanges.subscribe(next => {
            this.dadosHistorico = next;
        });

        this.fcAutorizacao.valueChanges.subscribe(next => {
            this.autorizacao = next;
        });
    }

    private limparMotivoAutorizacaoPorSituacao(): void {
        if (this.dadosSituacao != null && (this.dadosSituacao.id !== this.CADASTRO_SISTEMA_SAUDE)) {
            this.isHabilitaBotaoPorNumeroAutorizacao = false;
            this.numeroAutorizacao = null;
            this.fcAutorizacao.setValue(null);
        }
    }

    private onChangeMotivoNegacao(): void {
        this.fcMotivoNegacao.valueChanges.subscribe(next => {
            this.textoHistoricoNegacao = this.getDescricaoHistoricoMotivoNegacaoPorId(next);
            this.fcHistoricoSituacao.setValue(this.textoHistoricoNegacao);
        });
    }

    private verificarExibicaoCampoNumeroAutorizacaoReembolso(situacao: any) {
        this.isExibeCampoAutorizacaoOuReembolso = situacao 
            && (situacao.id === this.CADASTRO_SISTEMA_SAUDE || situacao.id === this.EM_CONFERENCIA_SISTEMA_SAUDE);
    }

    private carregarDadosProcesso(): void {
        this.dadosProcesso(this.processo);
    }

    private dadosProcesso(processo: Pedido): void {
        this.objProcesso = processo;
        this.verificarProcessoAutorizacao(processo);
        this.verificarProcessoReembolso(processo);
        this.carregarComboMudancaSituacao(this.objProcesso);
    }

    private verificarProcessoAutorizacao(processo: Pedido) {
        this.isProcessoAutorizacao = this.itensAutorizacao.indexOf(processo.tipoProcesso.id) != -1;
    }

    private verificarProcessoReembolso(processo: Pedido) {
        this.isProcessoReembolso =  this.itensReembolso.indexOf(processo.tipoProcesso.id) != -1  ;
    }

    private carregarItensMotivoNegacao(situacao: any): void {
        this.fcMotivoNegacao.setValue(null);
        this.fcMotivoNegacao.reset();

        let idPedido = this.objProcesso.id;
        let idSituacaoProcesso = situacao ? situacao.id : null;

        this.itensMotivoNegacao = [];
        this.ePositivo = true;

        if (situacao && situacao.negativo == 'SIM') {
            this.ePositivo = false;
            this.motivoNegacaoService.consultarMotivosNegacaoProcessoPorPedidoAndSituacao(idPedido, idSituacaoProcesso).subscribe(res => {
                this.itensMotivoNegacao = res.map(x => ({label: x.titulo, value: x.id} as SelectItem));
                this.itensHistoricoMotivoNegacao = res.map(x => ({descricaoHistorico: x.descricaoHistorico, id: x.id} as MotivoNegacao));
            });
        }
    }

    private carregarComboMudancaSituacao(processo: Pedido): void {
        let idPedido = processo.id;
        this.carregarItensSelecionaveis(idPedido);
    }

    private carregarItensSelecionaveis(idPedido: number): void {
        this.itensSituacoesProcesso = [];
        this.situacaoProcessoService.consultarTransicoesManuaisPossiveisPorPedido(idPedido).subscribe(res => {
            if (res.length == 0) {
                this.onSituacoesInvalidas.emit();
            }

            this.itensSituacoesProcesso = res.map(x => ({label: x.nome, value: x}) as SelectItem);
        }, () => this.onSituacoesInvalidas.emit());
    }

    private actionToOpenModel(arquivoModal: ArquivoModal): void {
        const {arquivos, arquivo, modalVisualizarDocumentoComponent: component} = arquivoModal
        const index = arquivos.findIndex(file => arquivo === file);
        component.infoExibicao = {itens: arquivos, index, item: arquivo};
    }

    private validarCamposObrigatorio(): boolean {
        let error: boolean = false;
       
        if (this.dadosSituacao) {
            if (this.dadosSituacao.negativo == 'SIM') {
                if (!this.dadosNegacao) {
                    error = true;
                }
            }
        } else {
            error = true;
        }
       
        if (!this.dadosHistorico && this.dadosSituacao && this.dadosSituacao.requerJustificativa === 'SIM') {
            error = true;
        }
        
        if ((this.isProcessoReembolso || this.isProcessoAutorizacao) && this.isExibeCampoAutorizacaoOuReembolso && !this.autorizacao) {
            error = true;
        }

        return error;
    }

    private executarOperacaoAlteracao(): void {
        this.loading = true;
        if (isNotUndefinedNullOrEmpty(this.fileUpload)) {
            this.salvarMudancaComAnexo();
        } else {
            this.situacaoPedidoService.incluirMudancaSituacaoPedido(this.recuperarDadosDoFormulario()).pipe(take(1)).subscribe(res => {
                let msgsAviso = res['msgsAviso'];
                this.messageService.showSuccessMsg('MA022');
                if ((msgsAviso) && msgsAviso.length > 0) {
                    this.messageService.showWarnMsg(msgsAviso);
                }

                this.carregarItensSelecionaveis(this.objProcesso.id);
                this.limpaCampos();
                setTimeout(() => this.onMudancaConcluida$.emit(), 100);
                setTimeout(() => window.location.reload(), 200);
            }, error => {
                this.loading = false;
                this.messageService.showDangerMsg(error.error);
            });
        }
    }

    private salvarMudancaComAnexo(): void {
        let formData = new FormData();


        formData.append('processadorUpload', 'documentosSituacaoPedido');
        formData.append('situacaoPedido', btoa(JSON.stringify(this.recuperarDadosDoFormulario())));
        formData.append('idMotivoNegacao', this.dadosNegacao);
        this.uploadService.realizarUpload(formData, this.fileUpload).subscribe(res => {
            let msgsAviso = res['msgsAviso'];
            this.messageService.showSuccessMsg('Situação alterada com sucesso.');
            if (msgsAviso && msgsAviso.length > 0) {
                this.messageService.showWarnMsg(msgsAviso);
            }

            this.carregarItensSelecionaveis(this.objProcesso.id);
            this.limpaCampos();

            setTimeout(() => this.onMudancaConcluida$.emit(), 100);
        }, error => {
            this.loading = false;
            this.messageService.showDangerMsg(error.error);
        });
    }

    private recuperarDadosDoFormulario(): any {
        return {
            idPedido: this.objProcesso.id,
            idSituacaoProcesso: this.dadosSituacao.id,
            idMotivoNegacao: this.dadosNegacao,
            situacaoProcesso: this.dadosSituacao,
            descricaoHistorico: this.dadosHistorico,
            idAutorizacao: this.autorizacao
        };
    }

    private getDescricaoHistoricoMotivoNegacaoPorId(id: number): string{
        let  retorno = "";
        if(id !== null){
            let historico = this.itensHistoricoMotivoNegacao.find(item => item.id === id);
            retorno = historico.descricaoHistorico;
        }
        return retorno;
    }
}
