import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { Subject } from "rxjs";
import { InfoExibicao } from "../models/info-exibicao";
import { isNotUndefinedNullOrEmpty } from "../../../constantes";

@Component({
  selector: "asc-modal-navegacao",
  templateUrl: "./asc-modal-navegacao.component.html",
  styleUrls: ["./asc-modal-navegacao.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AscModalNavegacaoComponent {
  private _itemAtual: any;
  private _itens: any[];
  protected index: number;
  @Output() readonly infoExibicaoAtual$ = new EventEmitter<InfoExibicao>();
  @Output() readonly onFechar$ = new EventEmitter<any>();
  protected readonly unsubscribe$ = new Subject<void>();
  showModal: boolean = false;
  @Output() readonly onDownload$ = new EventEmitter<any>();
  @Output() readonly onJanelaDownload$ = new EventEmitter<any>();
  
  @Input()
  height: any;

  @Input()
  withControls: boolean;

  /***
   * Opção de mudar o botão de fechar o modal paraa a esquerda
   */
  @Input()
  closeBottomLeft: boolean;

  @Input()
  tituloModal: string;

  /**
   * Define se é permitido rolar entre os limites de início e fim.
   */
  @Input()
  modoRotacao = true;

  fecharModal() {
    this.showModal = false;
    this._itemAtual = null as any;
    this.onFechar$.emit();
  }

  fecharTela(event:any) {
    if(this.isJanelaDownload()){
      if(event && event.type==="click"){
        localStorage.clear();
        window.close();
      }
    }else{
      this.showModal = false;
      this._itemAtual = null as any;
      this.onFechar$.emit();
    }
  }

  isJanelaDownload():boolean{
    let url = window.location.href;
    if(url.includes("downloadArquivo")){
      return true;
    }else{
      return false;
    }
  }

  downloadArquivo() {
    this.onDownload$.emit();
  }

  abrirNovaJanela() {
    this.abrirArquivoEmNovaJanela();
    this.fecharModal();
  }

  private abrirArquivoEmNovaJanela(): void {
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/#/downloadArquivo`;
  
    const novaAba = window.open(url, '_blank');
  
    if (novaAba) {
      novaAba.focus();
    } else {
      console.error('Não foi possível abrir a nova aba. Verifique se o navegador está bloqueando pop-ups.');
    }
  }

  get itemAtual() {
    return this._itemAtual;
  }

  get isPrimeiro() {
    return this.index === 0;
  }

  get isUltimo() {
    let ultimo = 0;
    if (this._itens != null) {
      ultimo = this._itens.length - 1;
    }
    return this.index >= ultimo;
  }

  @Input() set infoExibicao(infoExibicao: InfoExibicao) {
    if (infoExibicao && isNotUndefinedNullOrEmpty(infoExibicao.itens)) {
      this._itemAtual = infoExibicao.itens[infoExibicao.index];
      this._itens = infoExibicao.itens;
      this.index = infoExibicao.index;
      this.showModal = true;
    }
  }

  get itens() {
    return this._itens;
  }

  navToPreviousItem(): void {
    this.index = this.index - 1;
    const firstIndex = 0;
    if (this.index < firstIndex) {
      this.index = this.lastIndex();
    }
    this.exibirItem();
  }

  navToNextItem() {
    this.index = this.index + 1;
    if (this.index > this.lastIndex()) {
      this.index = 0;
    }
    this.exibirItem();
  }

  private lastIndex() {
    return this._itens.length - 1;
  }

  private exibirItem() {
    const itemAtual = this._itens[this.index];
    this.infoExibicaoAtual$.emit({
      index: this.index,
      item: itemAtual,
      itens: this._itens,
    });
  }

  public mostraControle(controle: any): boolean{
    let retorno = false;
    //console.log("mostraControle( " + controle +" )");
    if(controle===true || controle=='true' || controle===undefined){
      retorno = true;
    }
    return retorno;
  }

  get footerClasses(): string {
    return this.mostrarBotaoDownload() ? 'footer-com-download' : 'footer-sem-download';
  }

  public mostrarBotaoDownload(): boolean{
    if(this.testaVariavel(this.itemAtual) && this.testaVariavel(this.itemAtual.name)){
      const fileExtension = this.itemAtual.name.split('.').pop().toLowerCase();
      if(fileExtension && fileExtension.length > 1 && fileExtension.length < 6){
        return true;
      } 
    }
    return false;
  }

  public mostrarBotaoNovaJanela(): boolean{
    if(this.mostrarBotaoDownload() && !this.isJanelaDownload()){
      let listaArquivos = JSON.parse(localStorage.getItem('arquivos')) ;
      let idPedido = JSON.parse(localStorage.getItem('idPedido')) ;

      if(this.testaVariavel(listaArquivos) && this.testaVariavel(idPedido)){
        return true;
      }
      return false;
    }
    return false;
  }

  private testaVariavel(variavel:any):boolean{
    if(variavel!==null && variavel!==undefined){
      return true;
    }
    return false;
  }
}
