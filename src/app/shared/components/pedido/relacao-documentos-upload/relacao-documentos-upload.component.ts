import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ComponenteNotificavel} from '../../../../../app/shared/components/pedido/componente-notificavel';
import {ComponentePedidoComponent} from '../../../../../app/shared/components/pedido/componente-pedido.component';
import {MessageService} from '../../../../../app/shared/components/messages/message.service';
import {DocumentoTipoProcessoService} from '../../../../../app/shared/services/comum/documento-tipo-processo.service';
import {ComposicaoPedidoService} from '../../../../../app/shared/services/components/composicao-pedido.service';
import {Data} from '../../../../../app/shared/providers/data';
import * as constantes from '../../../../../app/shared/constantes';
import {AutorizacaoPreviaService} from "../../../services/comum/pedido/autorizacao-previa.service";

@Component({
    selector: 'asc-relacao-documentos-upload',
    templateUrl: './relacao-documentos-upload.component.html',
    styleUrls: ['./relacao-documentos-upload.component.scss']
})
export class AscRelacaoDocumentosUploadComponent extends ComponentePedidoComponent implements OnInit, ComponenteNotificavel {

    listaDocumentosRequeridos: any[];
    listaDocumentosAdicionais: any[];

    @Input('rascunhoPedido')
    override rascunhoPedido: boolean;

    constructor(
        override readonly messageService: MessageService,
        override readonly composicaoPedidoService: ComposicaoPedidoService,
        override readonly router: Router,
        override readonly data: Data,
        private readonly documentoTipoProcessoService: DocumentoTipoProcessoService,
        private readonly autorizacaoPreviaService: AutorizacaoPreviaService
    ) {
        super(messageService, composicaoPedidoService, router, data);
        this.listaDocumentosRequeridos = [];
        this.listaDocumentosAdicionais = [];
    }

    public override ngOnInit(): void {
        if (this.show()) {
            this.carregarListaDocumentosRequeridos();
        }
        this.composicaoPedidoService.registrarObserver(this);
    }

    public atualizarInformacoes(idPedido: number) {
        this.carregarListaDocumentosPedido(idPedido);
    }

    public realizarUploadDocumentoPedido(files: File[], compRef, docTipoProcesso: any): void {
        if (this.validarArquivosUpload(files)) {
            if (docTipoProcesso && docTipoProcesso.id) {

                console.log('aaaaaaaaaaaaa')
                let formData = new FormData();
                formData.append('idPedido', this.pedido.id.toString());
                formData.append('rascunhoPedido', this.rascunhoPedido.toString());
                formData.append('idDocumentoProcesso', docTipoProcesso.id);
                constantes.configurarArquivosUpload(formData, files);
                compRef.disabled = true;
                this.autorizacaoPreviaService.upload(formData).subscribe(next => {
                    let msgsAviso = next.msgsAviso;
                    compRef.clear();
                    compRef.disabled = false;
                    this.messageService.showSuccessMsg('MA088');
                    if (msgsAviso && msgsAviso.length > 0) {
                        this.messageService.showWarnMsg(next.msgsAviso);
                    }
                    this.notificarComponentes(this.pedido.id);
                }, error => {
                    compRef.clear();
                    compRef.disabled = false;
                    this.messageService.showDangerMsg(error.error);
                });
            } else {
                this.showDangerMsg('Os arquivos do upload devem possuir um documento para associá-los.');
            }
        } else {
            compRef.clear();
        }

    }

    public override hasAcaoUpload(): boolean {
        return super.hasAcaoUpload() || this.rascunhoPedido;
    }

    private carregarListaDocumentosPedido(idPedido: number): void {
        this.documentoTipoProcessoService.consultarRequeridosPorIdPedido(idPedido).subscribe(res => {
            this.listaDocumentosRequeridos = res;
        }, error => this.messageService.showDangerMsg(error.error));
        this.documentoTipoProcessoService.consultarComplementaresPorIdPedido(idPedido).subscribe(res => {
            this.listaDocumentosAdicionais = res;
        }, error => this.messageService.showDangerMsg(error.error));

    }

    private carregarListaDocumentosRequeridos(): void {
        this.carregarListaDocumentosPedido(this.pedido.id)
    }

    private validarArquivosUpload(files: File[]): boolean {
        return constantes.validarArquivosUpload(files, this.messageService);
    }
}
