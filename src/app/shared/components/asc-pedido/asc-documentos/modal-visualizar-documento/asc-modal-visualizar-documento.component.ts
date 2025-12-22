import { Component, Input, OnDestroy, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Arquivo } from "../../../../models/dto/arquivo";
import { catchError, map } from "rxjs/operators";
import { AnexoService } from "../../../../services/comum/anexo.service";
import { of, Observable } from "rxjs";
import { InfoExibicao } from "../../../asc-modal/models/info-exibicao";
import { isUndefinedNullOrEmpty } from "../../../../constantes";
import { MessageService } from "../../../messages/message.service";
import { Util } from "../../../../../arquitetura/shared/util/util";
import { PDFDocumentProxy } from "ng2-pdf-viewer";
import { DscDialogService } from "sidsc-components/dsc-dialog";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "asc-modal-visualizar-documento",
  templateUrl: "./asc-modal-visualizar-documento.component.html",
  styleUrls: ["./asc-modal-visualizar-documento.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AscModalVisualizarDocumentoComponent implements OnDestroy {
  // Propriedades do PDF viewer
  page: number = 1;
  zoom: number = 1.0;
  totalPages: number = 0;
  isLoaded: boolean = false;
  isLoading: boolean = true;
  outline: any[];
  pdf: PDFDocumentProxy;

  // Propriedades do arquivo
  fileName: string = "";
  urlDocumento: any = null;
  mimeType: string;
  showPdf = false;
  arquivo: Arquivo;
  showTexto = false;
  textoDocumento: string = null;

  // Navegação entre arquivos
  arquivos: Arquivo[] = [];
  currentIndex: number = 0;

  @Input() controls: boolean;

  @ViewChild('modalVisualizarTemplate', { static: true })
  private modalVisualizarTemplate!: TemplateRef<any>;

  private dialogRef?: MatDialogRef<any>;

  constructor(
    private sanitizer: DomSanitizer,
    private readonly anexoService: AnexoService,
    private readonly messageService: MessageService,
    private readonly dialogService: DscDialogService
  ) {}

  ngOnDestroy(): void {
    this.fechar();
  }

  // Setter que mantém compatibilidade com o padrão antigo
  @Input()
  set infoExibicao(info: InfoExibicao) {
    if (info && info.item) {
      setTimeout(() => {
        this.arquivos = info.itens || [];
        this.currentIndex = info.index || 0;
        this.carregarArquivo(info.item);
      }, 0);
    }
  }

  private carregarArquivo(arquivo: Arquivo): void {
    this.resetarEstado();

    if (!arquivo) {
      this.messageService.addMsgWarning("Não existe item para exibição.");
      return;
    }

    this.arquivo = arquivo;
    this.isLoading = true;
    this.fileName = arquivo.name || 'Documento';
    this.page = 1;

    const fileExtension = this.fileName.split('.').pop()?.toLowerCase() || '';
    this.showPdf = fileExtension === "pdf";
    this.showTexto = fileExtension === "txt";

    // Se o arquivo já é um File (em memória), processa diretamente
    if (arquivo instanceof File) {
      this.processarArquivoLocal(arquivo);
      this.abrirModal();
    } else if ((arquivo as any).idDocumentoGED) {
      // Se tem ID do GED, busca do servidor
      this.buscarArquivoGED(arquivo);
    } else if ((arquivo as any).size > 0) {
      // Se já tem conteúdo
      this.processarArquivoLocal(arquivo as any);
      this.abrirModal();
    } else {
      this.messageService.addMsgWarning("Arquivo não encontrado.");
    }
  }

  private buscarArquivoGED(arquivo: Arquivo): void {
    this.anexoService.obterArquivoPorIdGED(arquivo.idDocumentoGED).pipe(
      map((blobParts: any) => {
        const mimeType = Util.extrairMimeTypeFromFileName(arquivo.name);
        return new File([blobParts], arquivo.name, {
          type: mimeType,
          lastModified: arquivo.data as any,
        }) as Arquivo;
      }),
      catchError((error) => {
        console.error('Erro ao obter arquivo do GED:', error);
        this.messageService.addMsgDanger("Erro ao carregar arquivo.");
        return of(null);
      })
    ).subscribe((file) => {
      if (file) {
        this.arquivo = file;
        this.processarArquivoLocal(file);
        this.abrirModal();
      }
    });
  }

  private processarArquivoLocal(arquivo: File): void {
    if (this.showTexto) {
      this.buildFileContent(arquivo);
    } else {
      this.buildFilePath(arquivo);
    }
  }

  private buildFilePath(arquivo: File): void {
    const fileExtension = arquivo.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'pdf') {
      // Para PDF, ng2-pdf-viewer precisa de ArrayBuffer, não SafeResourceUrl
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        this.urlDocumento = new Uint8Array(event.target.result as ArrayBuffer);
        this.isLoading = false;
      };
      reader.readAsArrayBuffer(arquivo);
    } else {
      // Para imagens, usar Data URL com sanitizer
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const url = (event.target as FileReader).result as string;
        this.urlDocumento = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.mimeType = arquivo.type;
        this.isLoading = false;
      };
      reader.readAsDataURL(arquivo);
    }
  }

  private buildFileContent(arquivo: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.textoDocumento = reader.result as string;
      this.isLoading = false;
    };
    reader.readAsText(arquivo, 'UTF-8');
  }

  private abrirModal(): void {
    // Fecha modal anterior se existir
    if (this.dialogRef) {
      this.dialogRef.close();
    }

    this.dialogRef = this.dialogService.confirm({
      data: {
        title: {
          text: this.fileName || 'Visualizar Documento',
          showCloseButton: true,
          highlightVariant: true
        },
        template: this.modalVisualizarTemplate,
        context: this
      }
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

  fechar(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
    }
    this.resetarEstado();
  }

  downloadArquivo(): void {
    if (this.arquivo && this.arquivo.name) {
      this.downloadFile(this.arquivo, this.arquivo.name);
    }
  }

  private downloadFile(file: Blob | File, nome: string): void {
    if (file) {
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(file);
      a.download = nome;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  // Navegação de páginas do PDF
  goToPreviousPage(): void {
    if (this.page > 1 && !this.isLoading) {
      this.page--;
    }
  }

  goToNextPage(): void {
    if (this.page < this.totalPages && !this.isLoading) {
      this.page++;
    }
  }

  onLoadComplete(pdfData: PDFDocumentProxy): void {
    this.pdf = pdfData;
    this.totalPages = pdfData.numPages;
    this.isLoaded = true;
    this.isLoading = false;
    this.loadOutline();
  }

  onPageChange(page: number): void {
    this.page = page;
    this.isLoading = false;
  }

  private loadOutline(): void {
    if (this.pdf) {
      this.pdf.getOutline().then((outline: any[]) => {
        this.outline = outline;
      });
    }
  }

  // Navegação entre arquivos
  get isPrimeiroArquivo(): boolean {
    return this.currentIndex <= 0;
  }

  get isUltimoArquivo(): boolean {
    return this.currentIndex >= this.arquivos.length - 1;
  }

  navegarParaAnterior(): void {
    if (!this.isPrimeiroArquivo && this.arquivos.length > 0) {
      this.currentIndex--;
      this.carregarArquivoAtual();
    }
  }

  navegarParaProximo(): void {
    if (!this.isUltimoArquivo && this.arquivos.length > 0) {
      this.currentIndex++;
      this.carregarArquivoAtual();
    }
  }

  private carregarArquivoAtual(): void {
    const arquivo = this.arquivos[this.currentIndex];
    if (arquivo) {
      this.resetarEstado();
      this.arquivo = arquivo;
      this.fileName = arquivo.name || 'Documento';
      this.page = 1;

      const fileExtension = this.fileName.split('.').pop()?.toLowerCase() || '';
      this.showPdf = fileExtension === "pdf";
      this.showTexto = fileExtension === "txt";
      this.isLoading = true;

      if (arquivo instanceof File) {
        this.processarArquivoLocal(arquivo);
      } else if ((arquivo as any).idDocumentoGED) {
        this.buscarArquivoGEDSemModal(arquivo);
      } else if ((arquivo as any).size > 0) {
        this.processarArquivoLocal(arquivo as any);
      }
    }
  }

  private buscarArquivoGEDSemModal(arquivo: Arquivo): void {
    this.anexoService.obterArquivoPorIdGED(arquivo.idDocumentoGED).pipe(
      map((blobParts: any) => {
        const mimeType = Util.extrairMimeTypeFromFileName(arquivo.name);
        return new File([blobParts], arquivo.name, {
          type: mimeType,
          lastModified: arquivo.data as any,
        }) as Arquivo;
      }),
      catchError((error) => {
        console.error('Erro ao obter arquivo do GED:', error);
        this.messageService.addMsgDanger("Erro ao carregar arquivo.");
        return of(null);
      })
    ).subscribe((file) => {
      if (file) {
        this.arquivo = file;
        this.processarArquivoLocal(file);
      }
    });
  }
}
