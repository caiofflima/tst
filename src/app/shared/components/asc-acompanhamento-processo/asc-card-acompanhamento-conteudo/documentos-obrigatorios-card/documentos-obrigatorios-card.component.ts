import {Component, EventEmitter, Output} from '@angular/core';
import {DocumentoPedidoService} from "../../../../services/comum/documento-pedido.service";
import {DocumentoPedidoDTO} from "../../../../models/dto/documento-pedido";
import {Observable} from "rxjs";
import {AnexoService} from "../../../../services/comum/anexo.service";
import {FileUploadService} from "../../../../services/comum/file-upload.service";
import {fadeAnimation} from "../../../../animations/faded.animation";
import {DocumentoAcompanhamentoCommon} from "../../models/documento-acompanhamento-common";
import {HistoricoProcessoService, MessageService, ProcessoService} from "../../../../services/services";
import { StatusProcessoEnum } from 'app/shared/enums/status-processo.enum';

@Component({
  selector: 'asc-documentos-obrigatorios-card',
  templateUrl: './documentos-obrigatorios-card.component.html',
  styleUrls: ['./documentos-obrigatorios-card.component.scss'],
  animations: [...fadeAnimation]
})
export class DocumentosObrigatoriosCardComponent extends DocumentoAcompanhamentoCommon {
  
  documentosObrigatorios : boolean = false;

  mostrarComponente: boolean = true;

  constructor(
    private readonly docPedService: DocumentoPedidoService,
    override readonly anexoService: AnexoService,
    override readonly fileUploadService: FileUploadService,
     readonly mensagemService: MessageService,
    override readonly historicoProcessoService: HistoricoProcessoService,
    private readonly processoService: ProcessoService,
  ) {
    super(anexoService, fileUploadService, mensagemService, historicoProcessoService, docPedService);
  }

  consultarDocumento(): (idPedido: number) => Observable<any> {
    return (idPedido: number) => this.docPedService.consultarDocumentosObrigatoriosPorPedido(idPedido);
  }

  atualizarDocumentoCard() {
    this.loading = true;

    this.docPedService.consultarDocumentosObrigatoriosPorPedido(this.processo.id)
        .subscribe(
            (documentos: DocumentoPedidoDTO[]) => {
                this.loading = false;

                this.documentos = documentos;

                this.documentoTipoProcessos = documentos.map(doc => doc.documentoTipoProcesso);

                this.listAnexos.emit(documentos);

                this.processo$.next(this.processo);

                this.registrarConsultaDocumentos();
            },
            error => {
                this.loading = false;
                this.messageService.showDangerMsg('Erro ao atualizar os documentos obrigatórios.');
            }
        );
} 

  // get permissaoLiberar() {
  //   this.liberaPedidoObrigatorios();
  //   let possuiDocumentos = false;
  //   if (this.documentoTipoProcessos) {
  //     possuiDocumentos = this.documentoTipoProcessos.every(documento => documento && documento.arquivos && documento.arquivos.length > 0);
  //   }
  //   if (this.processo && this.processo.ultimaSituacao) {
  //     let retorno = this.processo.ultimaSituacao.idSituacaoProcesso === StatusProcessoEnum.RECEBENDO_DOCUMENTACAO_TITULAR && possuiDocumentos
  //     this.processoService.podeLiberarPedidoAnaliseObrigatorios(retorno);
  //     return retorno;
  //   }

  //   return false;
  // }

  // public liberarProcessoParaAnalise(idPedido: number): void {
  //   this.processoService.liberarProcessoParaAnalise(idPedido).subscribe(res => {
  //     let msg = '';

  //     if (res.msgsAviso) {
  //       for (let m of res.msgsAviso) {
  //         msg = msg.concat(m).concat(' ');
  //       }
  //     }

  //     if (msg == '') {
  //       this.messageService.showWarnMsg(msg);
  //     }

  //     this.messageService.showSuccessMsg('Processo liberado para a análise. ');
  //     this.historicoProcessoService.consultarUltimaSituacao(this.processo.id).subscribe(() => {
  //       this.atualizarPedido$.next();
  //     });
  //   }, error => this.messageService.showDangerMsg(error.error));
  // }

  // private liberaPedidoObrigatorios(){
  //   this.processoService.liberarPedidoAnaliseObrigatorios().subscribe(
  //     res => this.documentosObrigatorios = res
  //   )
  // }

  

}
