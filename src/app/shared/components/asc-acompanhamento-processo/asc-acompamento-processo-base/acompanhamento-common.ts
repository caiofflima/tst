import {Component, OnDestroy, OnInit, SimpleChanges} from "@angular/core";
import {Pedido} from "../../../models/comum/pedido";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {ProcessoService} from "../../../services/comum/processo.service";
import {catchError, debounceTime, delay, map, switchMap, tap} from "rxjs/operators";
import {PedidoProcedimento} from "../../../models/comum/pedido-procedimento";
import {forkJoin, Observable, Subject} from "rxjs";
import {AscComponenteAutorizado} from "../../asc-pedido/asc-componente-autorizado";
import {DocumentoPedidoService, MessageService, PatologiaService, ProcedimentoService, SIASCFluxoService} from "../../../services/services";
import {Procedimento} from "../../../models/comum/procedimento";
import {isNotUndefinedOrNull, isUndefinedNullOrEmpty} from "../../../constantes";
import {of} from "rxjs";

import {MedicamentoService} from "../../../services/comum/pedido/medicamento.service";
import {Patologia} from "../../../models/comum/patologia";
import {MedicamentoPatologiaPedidoService} from "../../../services/comum/medicamento-patologia-pedido.service";
import {MedicamentoPatologiaPedido} from "../../../models/comum/medicamento-patologia-pedido";
import {TipoProcessoEnum} from "../../asc-pedido/models/tipo-processo.enum";
import {DocumentoFiscal} from "../../../../funcionalidades/processos/reembolso/models/documento-fiscal.model";
import {isTipoFinalizado, isSituacaoCancelamentoPermitido} from "../../asc-pedido/models/situacao-processo.enum";
import {Util} from "../../../../arquitetura/shared/util/util";
import { DocumentoPedidoDTO } from "app/shared/models/dto/documento-pedido";

@Component({
  selector: 'app-acompanhamento-common',
  template: '', // ou templateUrl
  // ou standalone: true (se for standalone component)
})
export class AcompanhamentoCommon extends AscComponenteAutorizado implements OnInit, OnDestroy {
    apresentarSituacao: boolean = true;
    protected readonly unsubscription$ = new Subject<void>()

    processo = new Pedido();
    isProcessoDiferenteReembolsoMedicamento = true;
    isProcessoDiferenteReembolsoVacina = true;
    isProcessoCancelamentoBeneficiario = false;

    color: string;
    idPedido: number;
    documentoFiscal: DocumentoFiscal;
    readonly subjectAtualizarProcesso = new Subject<any>();

    mostrarBordaVermelhaObrigatorios = false;
    mostrarBordaVerdeObrigatorios = false;

    mostrarBordaVermelhaCondicionais = false;
    mostrarBordaVerdeCondicionais = false;

    possuiDocumentosComplementares: boolean = false;

    constructor(
        protected readonly activatedRoute: ActivatedRoute,
        protected readonly processoService: ProcessoService,
        protected readonly procedimentoService: ProcedimentoService,
        protected readonly medicamentoService: MedicamentoService,
        protected readonly patologiaService: PatologiaService,
        protected readonly medicamentoPatologiaPedidoService: MedicamentoPatologiaPedidoService,
        protected readonly messageService: MessageService,
        protected readonly siascFluxoService: SIASCFluxoService,
        protected readonly documentoPedidoService?: DocumentoPedidoService
    ) {
        super();
    }

    ngOnInit() {
        const idPedido = this.activatedRoute.snapshot.params[`idPedido`];
    
        this.siascFluxoService.consultarPermissoesFluxoPorPedido(idPedido).subscribe(res => {
            if (res.acessar) {
                this.registrarBuscaProcesso();
                this.subjectAtualizarProcesso.next({});
                this.verificarDocumentosComplementares(idPedido);
            } else {
                this.messageService.addMsgDanger('MA001');
            }
        }, error => this.messageService.addMsgDanger(error.error)); 
        
        this.documentoPedidoService.avisoSituacaoPedido.subscribe((todosValidos: boolean) => {
            this.atualizarEstadoObrigatorios(todosValidos);
        });

        this.documentoPedidoService.avisoSituacaoPedidoComplementares.subscribe((todosValidos: boolean) => {
            this.atualizarEstadoCondicionais(todosValidos);
        });
    }
    
    ngOnChanges(changes: SimpleChanges) {
        if (changes['processo']) {
            this.resetarEstadosBordas();
        }
    }

    private verificarDocumentosComplementares(idPedido: number): void {
        this.documentoPedidoService.consultarDocumentosComplementaresPorPedido(idPedido).subscribe(
            (documentos: DocumentoPedidoDTO[]) => {
                this.possuiDocumentosComplementares = documentos && documentos.length > 0;
            },
            error => {
                console.error('Erro ao verificar documentos complementares:', error);
                this.possuiDocumentosComplementares = false;
            }
        );
    }    
    
    private resetarEstadosBordas(): void {
        this.mostrarBordaVermelhaObrigatorios = false;
        this.mostrarBordaVerdeObrigatorios = false;
        this.mostrarBordaVermelhaCondicionais = false;
        this.mostrarBordaVerdeCondicionais = false;
    }
    

    private atualizarEstadoObrigatorios(todosValidos: boolean): void {
        //console.log("Atualizando estado obrigatórios...");
        
        if (this.recebendoDocumentacaoTitular) {
            if (!todosValidos) {
                this.mostrarBordaVermelhaObrigatorios = true;
                this.mostrarBordaVerdeObrigatorios = false;
            } else {
                this.mostrarBordaVermelhaObrigatorios = false;
                this.mostrarBordaVerdeObrigatorios = true;
            }
        } else {
            this.mostrarBordaVermelhaObrigatorios = false;
            this.mostrarBordaVerdeObrigatorios = false;
        }
        
        //console.log("Estado final obrigatórios -> Borda vermelha:", this.mostrarBordaVermelhaObrigatorios, " | Borda verde:", this.mostrarBordaVerdeObrigatorios);
    }
    
    private atualizarEstadoCondicionais(todosValidos: boolean): void {
        //console.log("Atualizando estado condicionais...");
        
        if (this.recebendoDocumentacaoTitular) {
            if (!todosValidos || this.isAguardandoDocumentoComplementar) {
                this.mostrarBordaVermelhaCondicionais = true;
                this.mostrarBordaVerdeCondicionais = false;
            } else {
                this.mostrarBordaVermelhaCondicionais = false;
                this.mostrarBordaVerdeCondicionais = true;
            }
        } else {
            this.mostrarBordaVermelhaCondicionais = false;
            this.mostrarBordaVerdeCondicionais = false;
        }
        
        //console.log("Estado final condicionais -> Borda vermelha:", this.mostrarBordaVermelhaCondicionais, " | Borda verde:", this.mostrarBordaVerdeCondicionais);
    }    
          
    get recebendoDocumentacaoTitular(): boolean {
        let situacoes = ["AGUARD_DOC_COMPLEMENTAR", "RECEBENDO_DOCUMENTACAO_TITULAR"];
        if (this.processo && this.processo.ultimaSituacao && this.processo.ultimaSituacao.situacaoProcesso) {
            return situacoes.includes(this.processo.ultimaSituacao.situacaoProcesso["statusEnum"]);
        }
        return false;
    }

    get isAguardandoDocumentoComplementar(): boolean {
        let situacoes = ["AGUARD_DOC_COMPLEMENTAR"];
        if (this.processo && this.processo.ultimaSituacao && this.processo.ultimaSituacao.situacaoProcesso) {
            return situacoes.includes(this.processo.ultimaSituacao.situacaoProcesso["statusEnum"]);
        }
        return false;
    }
    

    protected registrarBuscaProcesso(): void {
        
        this.subjectAtualizarProcesso.pipe(
            switchMap(() => this.activatedRoute.paramMap),
            map((param: ParamMap) => param.get('idPedido')),
            map(Number),
            switchMap((idPedido: number) => this.processoService.consultarPorId(idPedido)),
            map((pedido: Pedido) => new Pedido({...pedido})),
            switchMap((pedido: Pedido) => pedido.pedidosProcedimento.length > 0 ? this.consultarProcedimentoPorPedido(pedido) : of(pedido)),
            switchMap((pedido: Pedido) => pedido.pedidosProcedimento.length > 0 ? this.consultarMedicamentosDoPedidoProcedimento(pedido): of(pedido)),
            switchMap((pedido: Pedido) => pedido.pedidosProcedimento.length > 0 ? this.consultarAutorizacaoPreviaDoPedidoProcedimento(pedido): of(pedido)),
            switchMap((pedido: Pedido) => pedido.pedidosProcedimento.length > 0 ? this.consultarPatologiasDoPedidoProcedimento(pedido): of(pedido)),
            switchMap((pedido: Pedido) => pedido.pedidosProcedimento.length > 0 ? this.adicionarValoresNoPedido(pedido): of(pedido)), 
            tap(pedido => this.processo = new Pedido({...pedido})),
            tap((pedido: Pedido) => {
                this.verificaSeProcessosSaoDiferentesReembolsoVacinacaoEMedicamento(pedido.idTipoProcesso);
                //this.isProcessoDiferenteReembolsoMedicamento = pedido.idTipoProcesso !== TipoProcessoEnum.REEMBOLSO_MEDICAMENTO;
                //this.isProcessoDiferenteReembolsoVacina = pedido.idTipoProcesso !== TipoProcessoEnum.REEMBOLSO_VACINA;
                this.isProcessoCancelamentoBeneficiario = pedido.idTipoProcesso == TipoProcessoEnum.CANCELAMENTO_BENEFICIARIO;
            }),
            tap((pedido: Pedido) => {
                this.documentoFiscal = {
                    cpfCnpj: pedido.cpfCnpj || pedido.cpf || pedido.cnpj,
                    uf: '',
                    municipio: '',
                    idEstado: 0,
                    nome: pedido.nomeProfissional,
                    idMunicipio: pedido.idMunicipioProfissional,
                    numeroDoc: pedido.numeroDocumentoFiscal ? pedido.numeroDocumentoFiscal.toString() : '',
                    data: pedido.dataEmissaoDocumentoFiscal ? Util.getDate(pedido.dataEmissaoDocumentoFiscal.toString()) : '',
                    valor: pedido.valorDocumentoFiscal ? pedido.valorDocumentoFiscal.toString() : '',
                }
            })
        ).subscribe();
    }

    private verificaSeProcessosSaoDiferentesReembolsoVacinacaoEMedicamento(idTipoProcesso: number): void {
        if (idTipoProcesso !== TipoProcessoEnum.REEMBOLSO_MEDICAMENTO) {
            this.isProcessoDiferenteReembolsoMedicamento = false;
        }
        if (idTipoProcesso !== TipoProcessoEnum.REEMBOLSO_VACINA) {
            this.isProcessoDiferenteReembolsoVacina = false;
        }
    }

    private consultarProcedimentoPorPedido(pedido: Pedido) {
        let operation$ = of(pedido);
        if (!pedido.pedidosProcedimento.some(pedidoProcedimento => isUndefinedNullOrEmpty(pedidoProcedimento.idProcedimento))) {
            operation$ = this.procedimentoService.consultarProcedimentosPorPedido(pedido.id).pipe(
                map((procedimentos: Procedimento[]) => ({procedimentos, pedido})),
                map((resposta: { procedimentos: Procedimento[], pedido: Pedido }) => this.mapearOsProcedimentoNoPedidoProcedimento(resposta)),
            );
        }
        return operation$;
    }

    mudancaSituacaoConcluida() {
        this.subjectAtualizarProcesso.next({});
    }

    onSituacaoInvalida() {
        this.apresentarSituacao = false;
    }

    atualizarProcesso() {
        this.subjectAtualizarProcesso.next({});
    }

    goToTop() {
        window.scrollTo(0, 0);
    }

    permiteCancelamento(): boolean {
        return this.processo && this.processo.ultimaSituacao 
        && isSituacaoCancelamentoPermitido(this.processo.ultimaSituacao.idSituacaoProcesso)
        && this.permissoes && this.permissoes.tipo === 'acompanhamento'
    }

    listaSituacoesPermitidas():boolean{
        let permitido = false;
        return permitido
    }

    cancelarProcesso() {
        this.messageService.addConfirmYesNo(this.messageService.fromResourceBundle('MA137'), () => {
            this.processoService.cancelarProcesso(this.processo.id).subscribe(
                    res => {
                        this.processo.ultimaSituacao.situacaoProcesso.conclusivo = 'SIM';
                        this.subjectAtualizarProcesso.next({});

                        let msg = this.messageService.fromResourceBundle('MA00O');
                        this.messageService.addMsgSuccess(msg);

                        let msgsAviso = res['msgsAviso'];
                        if ((msgsAviso) && msgsAviso.length > 0) {
                            this.messageService.showWarnMsg(msgsAviso);
                        }
        
                    }, error => {
                        this.messageService.addMsgDanger(error.message);
                    }
                );
        }, null, null, 'Sim', 'Não');
    }

    override ngOnDestroy(): void {
        this.unsubscription$.next();
        this.unsubscription$.complete();
    }

    private mapearOsProcedimentoNoPedidoProcedimento(response: { procedimentos: Procedimento[], pedido: Pedido }) {
        response.pedido.pedidosProcedimento = response.pedido.pedidosProcedimento.map(pedidoProcedimento => ({
            ...pedidoProcedimento,
            procedimento: response.procedimentos.find(procedimento => procedimento.id === pedidoProcedimento.idProcedimento)
        }));
        return response.pedido;
    }

    private consultarAutorizacaoPreviaDoPedidoProcedimento(pedido: Pedido): Observable<Pedido> {
        const possuiIdAutorizacaoPrevia = pedido.pedidosProcedimento.some(pedidoProcedimento => isUndefinedNullOrEmpty(pedidoProcedimento.idAutorizacaoPrevia))
        if (isUndefinedNullOrEmpty(pedido.pedidosProcedimento) || possuiIdAutorizacaoPrevia) {
            return of(pedido);
        }
        const observablesConsultaPorId = pedido.pedidosProcedimento.map(pedidosProcedimento => this.processoService.consultarPorId(pedidosProcedimento.idAutorizacaoPrevia).pipe(debounceTime(100)));

        return forkJoin(observablesConsultaPorId).pipe(
            map((autorizacoesPrevias: Pedido[]) => {
                pedido.pedidosProcedimento = pedido.pedidosProcedimento.map(pedidoProcedimento => ({
                    ...pedidoProcedimento,
                    autorizacaoPrevia: autorizacoesPrevias.find(autorizacaoPrevia => autorizacaoPrevia.id === pedidoProcedimento.idAutorizacaoPrevia)
                }))
                return pedido;
            }),
            catchError(error => {
                console.error('erro no método consultarAutorizacaoPreviaDoPedidoProcedimento', error);
                return of(pedido)
            })
        );
    }

    protected adicionarValoresNoPedido(pedido: Pedido) {
        return of(pedido);
    }

    private consultarPatologiasDoPedidoProcedimento(processo: Pedido): Observable<Pedido> {
        const pedido = new Pedido({...processo});
        if (pedido.pedidoProcedimentoIsNotEmpty()) {
            return of(pedido);
        }
        const tipoProceddoQueUsamPatologia = [TipoProcessoEnum.REEMBOLSO_MEDICAMENTO];
        if (
            pedido.pedidosProcedimento.every(pedidoProcedimento => isNotUndefinedOrNull(pedidoProcedimento.idPatologia || pedidoProcedimento.idProcedimento)) &&
            tipoProceddoQueUsamPatologia.includes(pedido.idTipoProcesso)
        ) {
            const consultarPatologias$ = pedido.pedidosProcedimento.map(pedidoProcedimento => {
                return this.patologiaService.consultarPorId(pedidoProcedimento.idPatologia || pedidoProcedimento.idProcedimento)
                .pipe(debounceTime(100))
            })
            return forkJoin(consultarPatologias$).pipe(
                catchError(() => of([])),
                tap((patologias: Patologia[]) => pedido.pedidosProcedimento.map(pedidoProcedimento => ({
                    ...pedidoProcedimento,
                    patologia: patologias.find(patologia => patologia.id === (pedidoProcedimento.idPatologia || pedidoProcedimento.idProcedimento))
                }))),
                map((pedidosProcedimentos: PedidoProcedimento[]) => {
                    pedido.pedidosProcedimento = pedidosProcedimentos
                    return pedido
                })
            )
        }
        return of(pedido);
    }

    private consultarMedicamentosDoPedidoProcedimento(pedido: Pedido): Observable<Pedido> {
        if (pedido.idTipoProcesso === TipoProcessoEnum.REEMBOLSO_MEDICAMENTO) {
            return this.processoService.consultarMedicamentoPatologiaPedidoPorPedido(pedido.id).pipe(
                map((medicamentoPatologiaPedido: MedicamentoPatologiaPedido[]) => {
                    pedido.pedidosProcedimento = [...medicamentoPatologiaPedido]
                    return pedido;
                }));
        }
        return of(pedido);
    }

    getListAnexos(doc: DocumentoPedidoDTO[]){
        this.documentoPedidoService.setDocumentos(doc)
    }
    getListAnexosObrigatorio(doc: DocumentoPedidoDTO[]){
        this.documentoPedidoService.setDocumentos(doc)
    }

}
