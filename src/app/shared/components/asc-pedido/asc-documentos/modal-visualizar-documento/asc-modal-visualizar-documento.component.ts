import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { Arquivo } from "../../../../models/dto/arquivo";
import { catchError, map } from "rxjs/operators";
import { AnexoService } from "../../../../services/comum/anexo.service";
import { of, Observable } from "rxjs";
import { InfoExibicao } from "../../../asc-modal/models/info-exibicao";
import { isUndefinedNullOrEmpty } from "../../../../constantes";
import { ModalExibicao } from "../../../asc-modal/modal-exibicao";
import { MessageService } from "../../../messages/message.service";
import { Util } from "../../../../../arquitetura/shared/util/util";
import { PDFDocumentProxy } from "ng2-pdf-viewer";
import { DscDialogService } from "sidsc-components/dsc-dialog";
import { MatDialogRef } from "@angular/material/dialog";

interface FileReaderEventTarget extends EventTarget {
  result: string;
}

interface FileReaderEvent extends Event {
  target: FileReaderEventTarget;

  getMessage(): string;
}

@Component({
  selector: "asc-modal-visualizar-documento",
  templateUrl: "./asc-modal-visualizar-documento.component.html",
  styleUrls: ["./asc-modal-visualizar-documento.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AscModalVisualizarDocumentoComponent
  extends ModalExibicao<Arquivo>
  implements OnInit, OnDestroy
{
  page: number = 1; // Posição inicial da página
  zoom: number = 1.0;
  totalPages: number;
  isLoaded: boolean = false;
  isLoading: boolean = true; // Flag para indicar carregamento
  outline: any[];
  isOutlineShown = true;
  pdfQuery = '';
  pdf: PDFDocumentProxy;

  fileName: string;
  sanitizer: DomSanitizer;
  urlDocumento = null;
  mimeType: string;
  showPdf = false;
  arquivo: Arquivo;
  showTexto = false;
  textoDocumento = null;

  @Input() controls: boolean;

  @ViewChild('modalVisualizarTemplate', { static: true })
  private modalVisualizarTemplate!: TemplateRef<any>;

  private dialogRef?: MatDialogRef<any>;

  constructor(
    sanitizer: DomSanitizer,
    private readonly anexoService: AnexoService,
    protected override readonly messageService: MessageService,
    private readonly dialogService: DscDialogService
  ) {
    super(messageService);
    this.sanitizer = sanitizer;
  }

  // ngOnInit(): void {
  //   // const isFullScreenMode = window.location.href.endsWith('/downloadArquivo');
  //   // if (isFullScreenMode) {
  //   //   const modalContainer = document.querySelector('.ui-dialog');
  //   //   if (modalContainer) {
  //   //     modalContainer.classList.add('fullscreen-modal');
  //   //   }
  //   // }
  //   // console.log("width :", window.innerWidth)
  //   // console.log("height :", window.innerHeight)
  // }

  protected configurarExibicao(arquivo: Arquivo) {
    this.resetarEstado();

    if (arquivo) {
      this.arquivo = arquivo;
      this.isLoading = true;
      this.fileName = arquivo.name;
      this.page = 1;

      const fileExtension = this.fileName.split('.').pop().toLowerCase();
      this.showPdf = fileExtension === "pdf";
      this.showTexto = fileExtension === "txt";

      if(this.showTexto){
        this.buildFileContent(arquivo);
      }else{
        this.buildFilePath(arquivo);
      }

      // Abrir o modal usando DscDialogService
      this.abrirModal();
    }
  }

  private abrirModal(): void {
    this.dialogRef = this.dialogService.confirm({
      data: {
        title: {
          text: this.fileName || 'Visualizar Documento',
          showCloseButton: true,
          highlightVariant: true
        },
        template: this.modalVisualizarTemplate,
        context: this,
        actionButton: {
          type: 'button',
          cancelText: 'Fechar',
          confirmText: 'Download',
          confirmFunction: () => this.downloadArquivo()
        }
      },
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      panelClass: 'modal-visualizar-documento-dialog'
    });

    this.dialogRef.afterClosed().subscribe(() => {
      this.resetarEstado();
    });
  }

  private resetarEstado(): void {
    this.fileName = "";
    this.showPdf = false;
    this.showTexto = false;
    this.urlDocumento = null;
    this.textoDocumento = null;
    this.pdf = null;
    this.totalPages = 0;
    this.isLoaded = false;
    this.isLoading = false;
    this.outline = [];
    this.page = 1;
  }
  
  private buildFilePath(arquivo: Arquivo) {
  if (arquivo instanceof File) {
    const fileExtension = arquivo.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'pdf') {
      this.urlDocumento = this.sanitizer.bypassSecurityTrustResourceUrl(
        window.URL.createObjectURL(arquivo)
      );
    } else {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const url = (event.target as FileReader).result as string;
        this.urlDocumento = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.mimeType = arquivo.type;
      };
      reader.readAsDataURL(arquivo);
    }
  }
}

  private buildFileContent(arquivo: Arquivo): void {
  if (arquivo instanceof File) {
    const reader = new FileReader();

    reader.onload = () => {
      const texto = reader.result as string;
      this.textoDocumento = texto;
      console.log(this.textoDocumento);
    };
    
    reader.readAsText(arquivo, 'UTF-8');
  }
}

  fechar() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    this.resetarEstado();
  }

  downloadArquivo() {
    if(this.arquivo && this.arquivo.name){
      this.downloadFile(this.arquivo, this.arquivo.name);
    }
  }

  downloadFile(file: Blob | File, nome: string): void {
    if(file){
      let a = document.createElement('a');
      a.href = window.URL.createObjectURL(file);
      a.download = nome;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }
  
  pesquisarItem(): (infoExibicao: InfoExibicao) => Observable<Arquivo> {
    const construirBlob = (info: InfoExibicao) => (blobParts: any): Arquivo => {
      return AscModalVisualizarDocumentoComponent.getBlobItem(info, blobParts);
    };

    return (documento: InfoExibicao) => {
      // Se não tem idDocumentoGED ou já tem o arquivo carregado
      if (
        isUndefinedNullOrEmpty(documento.item.idDocumentoGED) ||
        documento.item.size > 0
      ) {
        return of(documento.item);
      }

      // Busca o arquivo do GED
      return this.anexoService
        .obterArquivoPorIdGED(documento.item.idDocumentoGED)
        .pipe(
          map(construirBlob(documento)),
          catchError((error) => {
            console.error('Erro ao obter arquivo do GED:', error);
            // Retorna o item original ou um arquivo vazio
            return of(documento.item);
          })
        );
    };
  }

  private static getBlobItem(info: InfoExibicao, blobParts: any): Arquivo {
    let mimeType = Util.extrairMimeTypeFromFileName(info.item.name);
    return new File([blobParts], info.item.name, {
      type: mimeType,
      lastModified: info.item.data,
    }) as Arquivo;
  }

  goToPreviousPage() {
    if (this.page > 1 && !this.isLoading) {
      this.page--;
      this.isLoading = true; // Bloqueia a navegação
    }
  }

  goToNextPage() {
    if (this.page < this.totalPages && !this.isLoading) {
      this.page++;
      this.isLoading = true; // Bloqueia a navegação
    }
  }

  onLoadComplete(pdfData: PDFDocumentProxy) {
    this.pdf = pdfData;
    this.totalPages = pdfData.numPages;
    this.isLoaded = true;
    this.isLoading = false; // PDF carregado, desbloqueia navegação
    this.loadOutline();
  }

  onPageChange(page: number) {
    this.page = page;
    this.isLoading = false; // Página carregada, desbloqueia navegação
  }

  loadOutline(): void {
    this.pdf.getOutline().then((outline: any[]) => {
      this.outline = outline;
    });
  }
}
