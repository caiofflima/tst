import {Component, Input, OnInit} from '@angular/core';
import {MessageService} from '../../../../app/shared/components/messages/message.service';
import {AnexoService} from '../../../../app/shared/services/comum/anexo.service';
import {InfoAnexoPedido} from '../../../../app/shared/models/dto/info-anexo-pedido';
import * as constantes from '../../../../app/shared/constantes';

@Component({
  selector: 'asc-listagem-anexos',
  templateUrl: './listagem-anexos.component.html',
  styleUrls: ['./listagem-anexos.component.scss']
})
export class AscListagemAnexosComponent {

  @Input('hideExibirAnexo')
  hideExibirAnexo: boolean;
  @Input('anexos')
  listaAnexos: InfoAnexoPedido[];
  @Input('fileNameMaxLength')
  fileNameMaxLength: number;
  @Input('permissoesProcesso')
  permissoes: any;
  @Input('rascunhoPedido')
  rascunhoPedido: boolean;

  constructor(protected messageService: MessageService, private anexoService: AnexoService) {
    this.listaAnexos = [];
    this.fileNameMaxLength = 128;
    this.hideExibirAnexo = false;
  }

  public realizarDownloadArquivo(info: InfoAnexoPedido) {
    if (!(info.blob)) {
      this.anexoService.realizarDownloadAnexo(info.anexo);
    } else {
      constantes.downloadFile(info.blob, info.nome);
    }
  }

  get permissaoExclusao(): boolean {
    return this.permissoes ? (this.permissoes.upload || this.rascunhoPedido) : this.rascunhoPedido || false;
  }

  public confirmarExclusaoAnexo(obj: InfoAnexoPedido): void {
    let index = this.listaAnexos.indexOf(obj);
    this.messageService.addConfirmYesNo(this.bundle('MA021'), () => {
      this.anexoService.delete(obj.anexo.id).subscribe(() => {
        this.listaAnexos.splice(index, 1);
        this.messageService.showSuccessMsg('MA039');
      }, error => {
        this.messageService.showDangerMsg(error.error);
      });
    }, null, null, 'Sim', 'Não');
  }

  private bundle(code: string, params?: any[]): string {
    return this.messageService.fromResourceBundle(code, params);
  }
}
