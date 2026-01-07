import {Component} from '@angular/core';
import {DocumentoPedidoService} from "../../../../services/comum/documento-pedido.service";
import {DocumentoPedidoDTO} from "../../../../models/dto/documento-pedido";
import {Observable} from "rxjs";
import {AnexoService} from "../../../../services/comum/anexo.service";
import {FileUploadService} from "../../../../services/comum/file-upload.service";
import {fadeAnimation} from "../../../../animations/faded.animation";
import {DocumentoAcompanhamentoCommon} from "../../models/documento-acompanhamento-common";
import {catchError} from "rxjs/operators";
import {MessageService} from "../../../messages/message.service";
import {of} from "rxjs";
import {HistoricoProcessoService} from "../../../../services/comum/historico-processo.service";
import { DocumentoService, ProcessoService } from 'app/shared/services/services';

@Component({
  selector: 'asc-documentos-condicionados',
  templateUrl: './documentos-condicionados.component.html',
  styleUrls: ['./documentos-condicionados.component.scss'],
  animations: [...fadeAnimation]
})
export class DocumentosCondicionadosComponent extends DocumentoAcompanhamentoCommon {

  documentosCondicionados : boolean = false;

  constructor(
    private readonly docPedService: DocumentoPedidoService,
    override readonly anexoService: AnexoService,
    override readonly fileUploadService: FileUploadService,
    override readonly messageService: MessageService,
    override readonly historicoProcessoService: HistoricoProcessoService,
    documentoService: DocumentoService

  ) {
    super(anexoService, fileUploadService, messageService, historicoProcessoService, docPedService);
    documentoService
      .acionaMudanca$
      .subscribe({
        next: () => {
          this.registrarConsultaDocumentos()
        }
      })
  }

  consultarDocumento(): (idPedido: number) => any {
    return (idPedido: number) => this.docPedService.consultarDocumentosComplementaresPorPedido(idPedido).pipe(
      catchError(() => of([]))
    );
  }

  // get permissaoLiberar() {
  //   this.liberaPedidoCondicionados();
  //   let possuiDocumentos = false;
  //   if (this.documentoTipoProcessos) {
  //     possuiDocumentos = this.documentoTipoProcessos.every(documento => documento && documento.arquivos && documento.arquivos.length > 0);
  //   }

  //   if (this.processo && this.processo.ultimaSituacao) {
  //     let retorno = this.processo.ultimaSituacao.idSituacaoProcesso === StatusProcessoEnum.RECEBENDO_DOCUMENTACAO_TITULAR && possuiDocumentos
  //     this.processoService.podeLiberarPedidoAnaliserCondicionados(retorno);
  //     return retorno;
  //   }
  //   //this.processoService.podeLiberarPedidoAnalise(false);
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

  // private liberaPedidoCondicionados(){
  //   this.processoService.liberarPedidoAnaliserCondicionados().subscribe(
  //     res => this.documentosCondicionados = res
  //   )
  // }

}
