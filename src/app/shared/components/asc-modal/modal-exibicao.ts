import {Directive, EventEmitter, Input, OnDestroy, OnInit} from "@angular/core";
import {InfoExibicao} from "./models/info-exibicao";
import {Subject} from "rxjs";
import {distinctUntilChanged, filter, switchMap, takeUntil, tap} from "rxjs/operators";
import {isNotUndefinedNullOrEmpty, isUndefinedNullOrEmpty} from "../../constantes";
import {Observable} from "rxjs";
import {MessageService} from "../../services/services";

@Directive()
export abstract class ModalExibicao<T> implements OnInit, OnDestroy {

  protected readonly infoExibicao$ = new EventEmitter<InfoExibicao>();
  protected readonly unsubscribe$ = new Subject<void>();
  showModal: boolean = false;
  _infoExibicao: InfoExibicao;

  constructor(protected messageService: MessageService) {

  }

  @Input() set infoExibicao(infoExibicao: InfoExibicao) {
    setTimeout(() => {
      this._infoExibicao = infoExibicao;
      this.infoExibicao$.emit(infoExibicao);
    }, 0);
  }

  ngOnInit(): void {
    this.registrarPesquisaItem();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get infoExibicao() {
    return this._infoExibicao;
  }

  exibirItemAtual(infoExibicao: InfoExibicao): void {
    this._infoExibicao = infoExibicao;
    this.infoExibicao$.emit(infoExibicao)
    this.configurarExibicao(this._infoExibicao.item);
  }

  protected abstract configurarExibicao(item: T): void;

  protected abstract pesquisarItem(): (infoExibicao: InfoExibicao) => Observable<T>;

  protected registrarPesquisaItem() {
    this.infoExibicao$.pipe(
      distinctUntilChanged(),
      tap((info: InfoExibicao)=> this.exibirMensagemInfoVazia(info)),
      filter((infoExibicao: InfoExibicao) => isNotUndefinedNullOrEmpty(infoExibicao)),
      filter((infoExibicao: InfoExibicao) => isNotUndefinedNullOrEmpty(infoExibicao.itens)),
      filter((infoExibicao: InfoExibicao) => isNotUndefinedNullOrEmpty(infoExibicao.item)),
      switchMap(this.pesquisarItem()),
      tap((infoExibicao: InfoExibicao) => this.configurarExibicao(infoExibicao.item)),
      takeUntil(this.unsubscribe$),
    )
      .subscribe();
  }

  private exibirMensagemInfoVazia(info: InfoExibicao) {
    if (isUndefinedNullOrEmpty(info) ||
      isUndefinedNullOrEmpty(info.itens) ||
      isUndefinedNullOrEmpty(info.item)) {
      this.messageService.addMsgWarning(info.msgItemVazio? info.msgItemVazio: "Não existe item a para exibição.");
    }
  }
}
