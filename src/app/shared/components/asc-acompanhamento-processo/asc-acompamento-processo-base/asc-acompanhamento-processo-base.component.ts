import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Pedido} from "../../../models/comum/pedido";
import {DocumentoPedidoService, HistoricoProcessoService, MessageService, SessaoService, SIASCFluxoService} from "../../../services/services";
import {filter, map, switchMap, take, takeUntil, tap} from "rxjs/operators";
import {Beneficiario, SituacaoPedido, Usuario} from "../../../models/entidades";
import {Observable, Subject} from "rxjs";
import {fadeAnimation} from "../../../animations/faded.animation";
import {enterLeaveAnimation} from "../../../animations/enterLeave.animation";
import {PermissoesSituacaoProcesso} from "../../../models/fluxo/permissoes-situacao-processo";
import {ActivatedRoute, Router} from "@angular/router";
import {isNotUndefinedOrNull} from "../../../constantes";
import {
    AscCardAcompanhamentoHistoricoComponent
} from "../asc-card-acompanhamento-historico/asc-card-acompanhamento-historico.component";
import {Location} from "@angular/common";
import { ArquivoEnvioDado } from "../../../models/dto/arquivoEnvioDado";
import { ArquivoEnvioDadoService } from "../../../services/comum/arquivoEnvioDado.service";

@Component({
    selector: 'asc-acompanhamento-processo-base',
    templateUrl: './asc-acompanhamento-processo-base.component.html',
    styleUrls: ['./asc-acompanhamento-processo-base.component.scss'],
    animations: [...fadeAnimation, ...enterLeaveAnimation]

})
export class AscAcompanhamentoProcessoBaseComponent implements OnInit, OnDestroy {

    protected readonly pedido$ = new EventEmitter<Pedido>();
    private readonly unsubscribe$ = new Subject<void>();

    @Output("onPermissoes")
    onPermissoes$ = new EventEmitter<PermissoesSituacaoProcesso>();

    @ViewChild("acompanhamentoHistoricoComponent")
    acompanhamentoHistoricoComponent: AscCardAcompanhamentoHistoricoComponent;

    permissoes: PermissoesSituacaoProcesso;
    processoPedido: Pedido;
    situacoesPedido$: SituacaoPedido[];
    usuario: Usuario = null;
    color: string;
    canRenderWhenHasPedido$: Observable<boolean> = this.pedido$.pipe(map(isNotUndefinedOrNull))

    protected readonly permissoesProcesso$ = new Subject<number>();

    arquivoEnvioDado: ArquivoEnvioDado = null;
    EM_PROCESSAMENTO_SIST_SAUDE:number = 38;

    constructor(
        private readonly location: Location,
        private readonly activatedRoute: ActivatedRoute,
        private readonly historicoProcessoService: HistoricoProcessoService,
        private readonly fluxoService: SIASCFluxoService,
        private readonly messageService: MessageService,
        private readonly documentoPedidoService: DocumentoPedidoService,
        private readonly router: Router,
        private readonly arquivoEnvioDadoService: ArquivoEnvioDadoService

    ) {
       
    }

    get tituloAnalise(): boolean {
        let urlAtiva = this.activatedRoute.snapshot['_routerState'].url;
        return urlAtiva.includes("analise");
    }

    handleListaPedidosNavigation(): void {
        const urlAtiva = this.activatedRoute.snapshot['_routerState'].url;
    
        if (urlAtiva.includes("analise") && this.processoPedido) {
            const matriculaTitular = this.processoPedido.beneficiario.matriculaFuncional;
    
            const currentUrl = window.location.href;
    
            const newUrl = currentUrl.replace(/\/#\/.*/, `/#/pedidos/pesquisar?matriculaTitular=${matriculaTitular}`);

            (document.activeElement as HTMLElement).blur();
    
            window.open(newUrl, '_blank');
        } else {
            this.router.navigateByUrl("/meus-dados/pedidos");
        }
    }     

    @Input()
    set processo(processo: Pedido) {
        this.processoPedido = processo;

        if (processo && processo.id) {
            this.processoPedido = processo;
            this.pedido$.emit(processo)
            this.permissoesProcesso$.next(processo.id);
        }
    }

    atualizarPedido(situacao: SituacaoPedido): void {
        this.situacoesPedido$ = [situacao, ...this.situacoesPedido$];
        this.verificaSituacoesPedido()
    }

    ngOnInit() {
        this.registrarConsultaPermissoesProcesso();
        this.registrarExtracaoDeConfiguracaoDeUsuarioPeloBeneficiario();
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    goToTop() {
        window.scrollTo(0, 0);
    }

    private registrarConsultaPermissoesProcesso() {
        this.permissoesProcesso$.pipe(
            filter(isNotUndefinedOrNull),
            switchMap((idPedido: number) => this.fluxoService.consultarPermissoesFluxoPorPedido(idPedido)),
            tap((permissoes: PermissoesSituacaoProcesso) => {
                this.permissoes = permissoes;
                this.onPermissoes$.emit(permissoes);
                //Removida a regra de permissões que havia antes e adicionada a regra de acompanhamento apenas na tela "Meus Processo" (tituloAnalise = false)
                this.historicoProcessoService.consultarPorIdPedido(this.processoPedido.id, !this.tituloAnalise).pipe(
                    take<SituacaoPedido[]>(1)
                ).subscribe(situacao => {
                    this.situacoesPedido$ = situacao;
                    this.verificaSituacoesPedido();
                    // if(situacao){
                    //     console.log("this.situacoesPedido$ -------------------------------------");
                    //     console.log(this.situacoesPedido$);
                    //     this.buscarArquivoEnvioDado(this.processoPedido.id);
                    // }

                });
            }),
            takeUntil(this.unsubscribe$)
        ).subscribe();
    }

    isLocalhost():boolean{
        let url = window.location.href;
        if(url.includes("localhost")){
          return true;
        }else{
          return false;
        }
      }

    public buscarArquivoEnvioDado(id:number): ArquivoEnvioDado{
        let retorno: ArquivoEnvioDado = null;
        console.log("================== [ buscarArquivoEnvioDado(id:number): HISTORICO-ProcessoPedido.id => arquivoEnvioDado ] ================== ");
        console.log(id);
        let situacao = this.situacoesPedido$.find(s => s.idSituacaoProcesso === this.EM_PROCESSAMENTO_SIST_SAUDE);
        //situacao.countAnexos=1;
        console.log(situacao);
        
        //if(id !== null && id !== undefined && this.situacaoPedido$.idSituacaoProcesso === this.EM_PROCESSAMENTO_SIST_SAUDE){
            if(situacao!==null && situacao!==undefined && situacao.idSituacaoProcesso === this.EM_PROCESSAMENTO_SIST_SAUDE){ 
                localStorage.clear();
                //this.arquivoEnvioDadoService.consultarAtivoPorPedidoId(id).pipe(
                this.arquivoEnvioDadoService.consultarAnexoEmProcessamentoPorPedidoId(id).pipe(
                    take<ArquivoEnvioDado>(1)
                ).subscribe(arquivoEnvioDado => {

                    if(arquivoEnvioDado!==null){
                        localStorage.setItem('arquivoEnvioDado', JSON.stringify(arquivoEnvioDado));
                    }
                    console.log("[INI-BASE]================== [ arquivoEnvioDado ] ================== ");
                    console.log(arquivoEnvioDado);
                    console.log("[FIM-BASE]================== [ arquivoEnvioDado ] ================== ");
                    if(localStorage.getItem('arquivoEnvioDado')){
                        console.log("[BASE-DEPOIS]================== [ if(localStorage.getItem('arquivoEnvioDado')) arquivoEnvioDado ] ================== ");
                        console.log( JSON.parse(localStorage.getItem('arquivoEnvioDado')) ) ;
                    }
                });
            }
        //}

        console.log(this.situacoesPedido$);
        return retorno;
    }

    private registrarExtracaoDeConfiguracaoDeUsuarioPeloBeneficiario() {
        this.pedido$.pipe(
            filter(isNotUndefinedOrNull),
            filter((pedido: Pedido) => isNotUndefinedOrNull(pedido.beneficiario)),
            filter((pedido: Pedido) => isNotUndefinedOrNull(pedido.beneficiario.matricula)),
            map((pedido: Pedido) => pedido.beneficiario),
            map((beneficiario: Beneficiario) => ({
                id: beneficiario.id,
                sexo: beneficiario.matricula.sexo || 'M',
                nome: beneficiario.matricula.nomePai !== 'NÃO DECLARADO' ? beneficiario.matricula.nomePai : beneficiario.matricula.nomeMae,
                email: beneficiario.email,
                matriculaFuncional: beneficiario.matriculaFuncional,
                idTitular: beneficiario.id
            })),
            takeUntil(this.unsubscribe$),
            tap((usuario: Usuario) => this.usuario = usuario)
        ).subscribe();
    }

    voltar(): void {
        this.location.back();
    }

    verificaSituacoesPedido(){
     
        
        const penultimaSituacao = this.situacoesPedido$[ 1 ]
        if( penultimaSituacao.idSituacaoProcesso == 11  ){
            this.documentoPedidoService.setAguardandoDocumentacao(penultimaSituacao)

        }
        
        
    }
}
