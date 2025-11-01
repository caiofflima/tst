import { ViewChild, Component, OnInit, Input} from "@angular/core";
import { ActivatedRoute, Router} from "@angular/router";
import { AscModalVisualizarDocumentoComponent } from "../modal-visualizar-documento/asc-modal-visualizar-documento.component";
import {Data} from 'app/shared/providers/data';
import { Arquivo } from "../../../../models/dto/arquivo";
import { DocumentoPedidoService } from "app/shared/services/comum/documento-pedido.service";
import {DocumentoPedidoDTO} from "app/shared/models/dto/documento-pedido";
import {MessageService} from "app/shared/components/messages/message.service";
import { AnexoService } from "../../../../services/comum/anexo.service";
import { Util } from "../../../../../arquitetura/shared/util/util";
import { SessaoService } from "../../../../../arquitetura/shared/services/seguranca/sessao.service";
import {InfoExibicao} from "app/shared/components/asc-modal/models/info-exibicao";

interface ArquivoModal {
  arquivos: Arquivo[];
  arquivo: Arquivo;
  modalVisualizarDocumentoComponent: AscModalVisualizarDocumentoComponent;
  event: any;
}

@Component({
    selector: "download-viewer",
    templateUrl: "./download-viewer.component.html",
    styleUrls: [
      "./asc-documento-card.component.scss",
      "./asc-documento-card-resumo.scss",
    ]
  })

export class DownloadViewerComponent implements OnInit {
  @ViewChild('modalVisualizarDocumentoComponent')modalVisualizarDocumentoComponent: AscModalVisualizarDocumentoComponent;
  private documentos: DocumentoPedidoDTO[];
  private idPedido: number;
  private listaArquivos:any[]=[];
  private nomeDocumentoGED:string;
  private arquivo:Arquivo=null;
  private arquivos: Arquivo[]=[];
  private arquivoModal: ArquivoModal;
  @Input() controls: boolean;

  constructor(
    protected readonly activatedRoute: ActivatedRoute,
    private data: Data,
    private readonly router: Router,
    private readonly documentoPedidoService: DocumentoPedidoService,
    readonly messageService: MessageService,
    private readonly anexoService: AnexoService,
    private readonly sessaoService: SessaoService,
  ) {
  //super(messageService, activatedRoute);
  }  
      
  ngOnInit() {
    this.listaArquivos = JSON.parse(localStorage.getItem('arquivos')) ;
    this.nomeDocumentoGED = JSON.parse(localStorage.getItem('arquivoAtual'));
    this.idPedido = JSON.parse(localStorage.getItem('idPedido')) ;

    this.carregarDocumentos();

  }

  carregarDocumentos(){
    this.documentoPedidoService.consultarDocumentosObrigatoriosPorPedido(this.idPedido).subscribe(retorno => {
      this.documentos = retorno;
      this.carregarAnexos();
    }, (error) => {
        this.messageService.addMsgDanger(error.error || error.message);
    });
  }

  carregarAnexos(){
    if(this.listaArquivos && this.listaArquivos.length>0){
      console.log(this.listaArquivos);
      console.log(this.nomeDocumentoGED);
      
      if(this.listaArquivos && this.listaArquivos[0].idDocumentoGED !== null && this.listaArquivos[0].idDocumentoGED !== undefined){
        this.buscarArquivosGED();
      }else{
        this.buscarArquivosProcessados();
      }


    }
  }

  buscarArquivosProcessados():void{
    console.log(this.listaArquivos);
    console.log(this.nomeDocumentoGED);
    this.anexoService.obterArquivoPorNome(this.nomeDocumentoGED).subscribe( (arquivo) => {
        this.arquivos.push(this.getBlobArquivo(this.nomeDocumentoGED, arquivo));
        this.arquivo = this.getBlobArquivo(this.nomeDocumentoGED, arquivo);

        if(this.listaArquivos.length===this.arquivos.length){   
          this.abrirArquivos();
        }
      },
      (error) => {
        // Mensagens do tipo 403 já são tratadas pela arquitetura, não duplicar.
        
        if (error.status === 408) {
          this.messageService.addMsgDanger(
            "Tempo de espera esgotado. Favor, tente novamente."
          );
        } else if (error.status === 404) {
          console.log(error);
          this.messageService.addMsgDanger("Arquivo não encontrado nos diretórios.");
        } else if (error.status !== 403) {
          this.messageService.addMsgDanger(error.statusText || error.message);
        }
      }
    )
  }

  buscarArquivosGED():void{
    this.listaArquivos.forEach(arquivoPesquisar => {
      this.anexoService.obterArquivoPorIdGED(arquivoPesquisar.idDocumentoGED).subscribe( (arquivo) => {
          this.arquivos.push(this.getBlobArquivo(arquivoPesquisar.name, arquivo));
          if(this.nomeDocumentoGED === arquivoPesquisar.name){
            this.arquivo = this.getBlobArquivo(arquivoPesquisar.name, arquivo);
          }
          if(this.listaArquivos.length===this.arquivos.length){   
            this.abrirArquivos();
          }
        },
        (error) => {
          this.messageService.addMsgDanger(error.statusText || error.message);
        }
      );
    });
  }

  abrirArquivos():void{
    if(this.arquivo && this.arquivos && this.arquivos.length>0){
      this.abrirModalVisualizarDocumentos(
        null,
        this.arquivo, 
        this.modalVisualizarDocumentoComponent, 
        this.arquivos);
    }else{
      console.log("------------------------- SEM ARQUIVO -------------------------------");
    }
  }

  abrirModalVisualizarDocumentos(
    event: any,
    arquivo: Arquivo,
    modalVisualizarDocumentoComponent: AscModalVisualizarDocumentoComponent,
    arquivos: Arquivo[]) {
    this.arquivoModal = {
      event,
      arquivo,
      arquivos,
      modalVisualizarDocumentoComponent,
    };

    const index = this.arquivos.findIndex(
      (a) => a.name === this.nomeDocumentoGED
    );

    let infoExibicao: InfoExibicao= {
      itens: this.arquivoModal.arquivos,
      index,
      item: this.arquivoModal.arquivo,
    };

    this.arquivoModal.modalVisualizarDocumentoComponent.infoExibicao = {
      itens: this.arquivoModal.arquivos,
      index,
      item: this.arquivoModal.arquivo,
    };
  }

  private getBlobArquivo(nome, blobParts: any): File {
    let mimeType = Util.extrairMimeTypeFromFileName(nome);
    let file = new File([blobParts], nome, {
      type: mimeType,
    }) as Arquivo;

    file.usuario = this.sessaoService.getUsuario().login;
    return file;
  }


}