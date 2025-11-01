import {Component, Input} from '@angular/core';
import {SituacaoPedido} from "../../../models/comum/situacao-pedido";
import {MensagemPedidoService} from "../../../services/comum/mensagem-enviada.service";
import {fadeAnimation} from "../../../animations/faded.animation";
import {AscComponenteAutorizado} from "../../asc-pedido/asc-componente-autorizado";
import {
    AscModalMensagemPedidoComponent
} from "app/shared/playground/asc-modal-mensagem-pedido/asc-modal-mensagem-pedido.component";
import {Pedido} from "../../../models/comum/pedido";
import {take} from "rxjs/operators";
import {Util} from "../../../../arquitetura/shared/util/util";
import {ActivatedRoute} from "@angular/router";
import { ArquivoEnvioDado } from "../../../models/dto/arquivoEnvioDado";
import { ArquivoEnvioDadoService } from "../../../services/comum/arquivoEnvioDado.service";

@Component({
    selector: 'asc-card-acompanhamento-historico',
    templateUrl: './asc-card-acompanhamento-historico.component.html',
    styleUrls: ['./asc-card-acompanhamento-historico.component.scss'],
    animations: [...fadeAnimation]
})
export class AscCardAcompanhamentoHistoricoComponent extends AscComponenteAutorizado {

    @Input()
    situacaoPedido: SituacaoPedido;

    @Input()
    isUltimoElementoNaLista: boolean;

    @Input()
    in: number;

    showDetalhe = false;

    @Input()
    processoPedido: Pedido;

    EM_PROCESSAMENTO_SIST_SAUDE:number = 38;
    hasArquivoProcessado:boolean = false;
    arquivoEnvioDado: ArquivoEnvioDado = null;
    ID_TIPO_REEMBOLSO:number = 9;

    constructor(
        private readonly mensagemPedidoService: MensagemPedidoService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly arquivoEnvioDadoService: ArquivoEnvioDadoService
    ) {
        super();

    }

    ngOnInit() {
        //this.buscarArquivoEnvioDado(); <VOLTAR QUANDO FOR LIBERAR A DEMANDA>
    }

    getNomeUsuario = Util.getNomeUsuario;

    clickShowDetalhe(): void {
        this.showDetalhe = true;
    }

    clickCloseDetalhe(): void {
        this.showDetalhe = false;
    }

    fecharModal(): void {
        this.showDetalhe = false;
    }

    clickVerMensagem(modalMensagemPedido: AscModalMensagemPedidoComponent) {
        this.mensagemPedidoService.consultarPorIdSituacaoPedido(this.situacaoPedido.id).pipe(
            take<any>(1)
        ).subscribe(next => {
            modalMensagemPedido.infoExibicao = {
                itens: next,
                index: 0,
                item: next[0],
                msgItemVazio: "Não existem mensagens."
            };
        });
    }

    get tituloAcompanhamento(): boolean {
        let urlAtiva = this.activatedRoute.snapshot['_routerState'].url;
        return urlAtiva.includes("acompanhamento");
    }

    // <COMENTADO ATÉ FICAR PRONTO>
    // public buscarArquivoEnvioDado(): void{
    //     if(this.situacaoPedido!==null && this.situacaoPedido!==undefined 
    //         && this.situacaoPedido.idSituacaoProcesso === this.EM_PROCESSAMENTO_SIST_SAUDE
    //         && this.isReembolso() && this.isAnalise()){ 

    //         localStorage.clear();
    //         this.arquivoEnvioDadoService.consultarAnexoProcessadoPorPedidoId(this.situacaoPedido.idPedido, this.situacaoPedido.dataCadastramento).pipe(
    //             take<ArquivoEnvioDado>(1)
    //         ).subscribe(arquivoEnvioDado => {
    //             if(arquivoEnvioDado!==null){
    //                 // console.log("buscarArquivoEnvioDado() ============= [arquivoEnvioDado]==============");
    //                 // console.log(this.situacaoPedido);
    //                 // console.log(arquivoEnvioDado);
    //                 // console.log("=============  ==============");
    //                 localStorage.setItem('arquivoEnvioDado', JSON.stringify(arquivoEnvioDado));
    //                 this.hasArquivoProcessado = true;
    //             }else{
    //                 this.hasArquivoProcessado = false;
    //             }
    //         });
    //     }else{
    //         this.hasArquivoProcessado = false;
    //     }
    // }

    public isReembolso():boolean{
        if(this.processoPedido && this.processoPedido.tipoProcesso){
            return this.processoPedido.tipoProcesso.idTipoPedido === this.ID_TIPO_REEMBOLSO;
        }
        return false;
    }

    public isAnalise():boolean{
        let url = window.location.href;
        if(url.includes("analise")){
            return true;
        }else{
            return false;
        }
    }
    
}
