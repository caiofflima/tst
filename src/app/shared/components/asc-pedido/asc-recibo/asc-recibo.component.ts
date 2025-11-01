import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BaseComponent} from "../../base.component";
import {MessageService} from "../../messages/message.service";
import {ProcessoService} from "../../../services/services";
import {distinctUntilChanged, map, switchMap, takeUntil, tap} from "rxjs/operators";
import {Pedido} from "../../../models/comum/pedido";
import {MotivoSolicitacao} from "../../../models/comum/motivo-solicitacao";
import {HttpUtil} from "../../../util/http-util";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {PdfExport} from "../../../pdf";
import { MotivoSolicitacaoService } from 'app/shared/services/comum/motivo-solicitacao.service';
import { ReciboModel } from 'app/funcionalidades/processos/inscricao-programas-medicamentos/models/reciboModel';

@Component({
  selector: 'asc-recibo-pedido',
  templateUrl: './asc-recibo.component.html',
  styleUrls: ['./asc-recibo.component.scss']
})
export class AscReciboComponent extends BaseComponent implements OnInit {

  public numAns: number;

  @Input() pedido: ReciboModel;
  @Input() showProgressBar = false;
  @Output() readonly enviarEmail = new EventEmitter<number>();
  @Output() readonly idProcesso$ = new EventEmitter<number>();

  sendingMail = false;


  exportingPdf = false;
  processo: any;

  constructor(
    protected override messageService: MessageService,
    protected readonly processoService: ProcessoService,
    private readonly motivoSolicitacaoService: MotivoSolicitacaoService,
    private readonly router: Router,
  ) {
    super(messageService);
    this.messageService = messageService;
  }

  ngOnInit() {
    this.registrarBuscaDeProcesso();
  }

  @Input()
  set idProcesso(idPedido: number) {
    setTimeout(() => {
      this.idProcesso$.emit(idPedido);
    }, 0);
  }

  sendEmail() {
    this.sendingMail = true;
    if (this.pedido && this.pedido.idPedido) {
      this.enviarEmail.emit(this.pedido.idPedido);
    }
  }

  exportarPDF(nomeArquivo: string, nomeDiv: string): void {
    PdfExport.export(nomeArquivo, nomeDiv);
  }

  private registrarBuscaDeProcesso(): void {
    this.idProcesso$.pipe(
      distinctUntilChanged(),
      tap(() => this.showProgressBar = true),
      switchMap((idProcesso: number) => this.processoService.consultarPorId(idProcesso)),
      HttpUtil.catchError(this.messageService, () => this.showProgressBar = false),
      switchMap(this.consultarMotivoSolicitacao()),
      tap((processo: Pedido) => this.processo = processo),
      tap(() => this.showProgressBar = false),
      takeUntil(this.unsubscribe$)
    )
      .subscribe();
  }

  private consultarMotivoSolicitacao(): (processo: Pedido) => Observable<Pedido> {
    return (processo: Pedido) => {
      return this.motivoSolicitacaoService.consultarPorId(processo.idMotivoSolicitacao).pipe(
        HttpUtil.catchError(this.messageService, () => this.showProgressBar = false),
        map((motivoSolicitacao: MotivoSolicitacao) => {
          processo.finalidade = motivoSolicitacao;
          return processo
        })
      )
    };
  }

  navegarParaMeusProcessos() {
    this.router.navigate(['meus-dados', 'pedidos'])
  }
}
