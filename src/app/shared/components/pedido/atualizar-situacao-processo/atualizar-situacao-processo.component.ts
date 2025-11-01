import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SelectItem} from 'primeng/api';
import {ComponentePedidoComponent} from '../../../../../app/shared/components/pedido/componente-pedido.component';
import {MessageService} from '../../../../../app/shared/components/messages/message.service';
import {FileUploadService} from '../../../../../app/shared/services/comum/file-upload.service';
import {SituacaoPedidoService} from '../../../../../app/shared/services/comum/situacao-pedido.service';
import {SituacaoProcessoService} from '../../../../../app/shared/services/comum/situacao-processo.service';
import {ComposicaoPedidoService} from '../../../../../app/shared/services/components/composicao-pedido.service';
import {ComponenteNotificavel} from '../../../../../app/shared/components/pedido/componente-notificavel';
import {Data} from '../../../../../app/shared/providers/data';
import * as constantes from '../../../../../app/shared/constantes';
import { MotivoNegacaoService } from 'app/shared/services/comum/motivo-negacao.service';

@Component({
  selector: 'asc-atualizar-situacao-processo',
  templateUrl: './atualizar-situacao-processo.component.html',
  styleUrls: ['./atualizar-situacao-processo.component.scss']
})
export class AscAtualizarSituacaoProcessoComponent extends ComponentePedidoComponent implements OnInit, ComponenteNotificavel {

  @ViewChild('fileUploadSituacao')
  fileUploadSituacao: any;
  files: File[];
  form: FormGroup;
  itensSituacoesProcesso: SelectItem[];
  itensMotivoNegacao: SelectItem[];

  constructor(private fb: FormBuilder, protected override messageService: MessageService, protected override composicaoPedidoService: ComposicaoPedidoService,
              protected override router: Router, protected override data: Data, private uploadService: FileUploadService,
              private motivoNegacaoService: MotivoNegacaoService, private situacaoPedidoService: SituacaoPedidoService,
              private situacaoProcessoService: SituacaoProcessoService) {
    super(messageService, composicaoPedidoService, router, data);
    this.itensSituacoesProcesso = [];
    this.itensMotivoNegacao = [];
    this.form = this.fb.group({
      idPedido: this.fb.control(null, Validators.required),
      idSituacaoProcesso: this.fb.control(null),
      idMotivoNegacao: this.fb.control(null),
      situacaoProcesso: this.fb.control(null, Validators.required),
      descricaoHistorico: this.fb.control(null)
    });
  }

  get idPedido(): AbstractControl {
    return this.form.get('idPedido');
  }

  get idMotivoNegacao(): AbstractControl {
    return this.form.get('idMotivoNegacao');
  }

  get idSituacaoProcesso(): AbstractControl {
    return this.form.get('idSituacaoProcesso');
  }

  get situacaoProcesso(): AbstractControl {
    return this.form.get('situacaoProcesso');
  }

  get descricaoHistorico(): AbstractControl {
    return this.form.get('descricaoHistorico');
  }

  public override ngOnInit(): void {
    if (this.show()) {
      this.form.get('idPedido').setValue(this.pedido.id);
    }
    this.situacaoProcesso.valueChanges.subscribe(() => {
      if (this.situacaoProcesso.value && this.situacaoProcesso.value.negativo == 'SIM') {
        this.atualizarListaMotivosNegacao(this.situacaoProcesso.value);
      }
      if (this.situacaoProcesso.value) {
        this.idSituacaoProcesso.setValue(this.situacaoProcesso.value.id);
      }
      this.makeFieldsPristineAndUntouched();
    });
    this.composicaoPedidoService.registrarObserver(this);
  }

  public atualizarInformacoes(idPedido: number): void {
    this.carregarItensSelecionaveis(idPedido);
  }

  private carregarItensSelecionaveis(idPedido: number): void {
    this.itensSituacoesProcesso = [];
    this.situacaoProcessoService.consultarTransicoesManuaisPossiveisPorPedido(idPedido).subscribe(res => {
      for (let sp of res) {
        this.itensSituacoesProcesso.push({label: sp.nome, value: sp})
      }
      if (this.itensSituacoesProcesso.length == 0) {
        this.disableFields();
      } else {
        this.enableFields();
        this.situacaoProcesso.enable();
      }
    });
    this.makeFieldsPristineAndUntouched();
  }

  podeAlterarSituacaoProcesso(): boolean {
    return this.situacaoProcesso.enabled;
  }

  private disableFields(): void {
    this.situacaoProcesso.disable();
    this.descricaoHistorico.disable();
    this.idMotivoNegacao.disable();
  }

  private enableFields(): void {
    this.situacaoProcesso.enable();
    this.descricaoHistorico.enable();
    this.idMotivoNegacao.enable();
  }

  private makeFieldsPristineAndUntouched(): void {
    AscAtualizarSituacaoProcessoComponent.markAsPristineAndUntouched(this.situacaoProcesso);
    AscAtualizarSituacaoProcessoComponent.markAsPristineAndUntouched(this.idMotivoNegacao);
    AscAtualizarSituacaoProcessoComponent.markAsPristineAndUntouched(this.descricaoHistorico);
    if (this.fileUploadSituacao)
      this.fileUploadSituacao.clear();
  }

  private static markAsPristineAndUntouched(control: AbstractControl): void {
    control.markAsPristine();
    control.markAsUntouched();
  }

  public atualizarListaMotivosNegacao(situacaoProcesso: any): void {
    let idPedido = this.form.value.idPedido;
    let idSituacaoProcesso = situacaoProcesso.id;
    if (situacaoProcesso.negativo == 'SIM') {
      this.itensMotivoNegacao = [];
      this.motivoNegacaoService.consultarMotivosNegacaoProcessoPorPedidoAndSituacao(idPedido, idSituacaoProcesso).subscribe(res => {
        for (let mn of res) {
          this.itensMotivoNegacao.push({label: mn.titulo, value: mn.id});
        }
      });
    } else {
      this.itensMotivoNegacao = [];
    }
    this.idMotivoNegacao.reset();
    this.makeFieldsPristineAndUntouched();
  }

  public hiddenMotivoNegacao(): boolean {
    let flg = true;
    if ((this.situacaoProcesso) && (this.situacaoProcesso.value)) {
      if (this.situacaoProcesso.value.negativo == 'SIM') {
        flg = false;
      }
    }
    return flg;
  }

  public isIdMotivoNegacaoInvalido(): boolean {
    let flgIdMotivoNegacaoVazio = false;
    let idMNValue = this.idMotivoNegacao.value;
    if (!this.hiddenMotivoNegacao()) {
      if (idMNValue) {
        flgIdMotivoNegacaoVazio = idMNValue.length == 0;
      } else {
        flgIdMotivoNegacaoVazio = true;
      }
    }
    return flgIdMotivoNegacaoVazio;
  }

  public atualizarSituacaoProcesso(): void {
    let flgOK = this.validarCamposObrigatoriosCondicionados();

    if (this.form.valid && flgOK) {
      if (this.files != null) {
        this.processarMudancaComUpload();
      } else {
        this.situacaoPedidoService.incluirMudancaSituacaoPedido(this.form.value).subscribe(res => {
          let msgsAviso = res['msgsAviso'];
          this.notificarComponentes(this.idPedido.value);
          this.messageService.showSuccessMsg('MA022');
          if ((msgsAviso) && msgsAviso.length > 0) {
            this.messageService.showWarnMsg(msgsAviso);
          }
          this.limparCampos();
        }, error => this.messageService.showDangerMsg(error.error));
      }
    } else {
      this.validateAllFormFields(this.form);
      this.showDangerMsg('MA007');
    }
  }

  private validarCamposObrigatoriosCondicionados(): boolean {
    let flgCamposObrigatorios = this.validarHistoricoSituacaoProcesso();
    if (flgCamposObrigatorios) {
      flgCamposObrigatorios = this.validarMotivoNegacao();
    }
    return flgCamposObrigatorios;
  }

  private validarHistoricoSituacaoProcesso(): boolean {
    let flgHistoricoSituacaoProcesso = true;
    if (!this.hiddenJustificativa()) {
      if (this.isHistoricoSituacaoProcessoInvalido()) {
        flgHistoricoSituacaoProcesso = false;
        this.showDangerMsg('MA007');
      }
    }
    return flgHistoricoSituacaoProcesso;
  }

  public isHistoricoSituacaoProcessoInvalido(): boolean {
    let flgInvalid = false;
    if (!this.hiddenJustificativa()) {
      if (!this.descricaoHistorico.value || (0 == this.descricaoHistorico.value.length)) {
        flgInvalid = true;
      }
    }
    return flgInvalid;
  }

  private validarMotivoNegacao(): boolean {
    let flgMotivoNegacao = true;
    if (!this.hiddenMotivoNegacao()) {
      if (this.isIdMotivoNegacaoInvalido()) {
        flgMotivoNegacao = false;
        this.showDangerMsg('MA007');
      }
    }
    return flgMotivoNegacao;
  }

  public configurarArquivosSelecionados(files: File[], uploadCmp: any) {
    if (files != null) {
      if (constantes.validarArquivosUpload(files, this.messageService)) {
        this.files = Array.from(files);
      }
    }
    if (uploadCmp)
      uploadCmp.clear();
  }

  public removerArquivoSelecionado(file: File): void {
    let index = this.files.indexOf(file);
    this.files.splice(index, 1);
  }

  public hiddenJustificativa(): boolean {
    let flg = true;
    if (this.situacaoProcesso.value) {
      flg = this.situacaoProcesso.value.requerJustificativa == 'NAO';
    }
    return flg;
  }

  private processarMudancaComUpload() {
    let formData = new FormData();
    if (this.files != null) {
      console.log('XXXXXXXXXXXXXXXXXXXXX')
      console.log('processadorUpload', 'documentosSituacaoPedido');
      console.log('situacaoPedido', btoa(JSON.stringify(this.form.value)));
      console.log('idMotivoNegacao', this.idMotivoNegacao.value);

      formData.append('processadorUpload', 'documentosSituacaoPedido');
      formData.append('situacaoPedido', btoa(JSON.stringify(this.form.value)));
      formData.append('idMotivoNegacao', this.idMotivoNegacao.value);
      this.uploadService.realizarUpload(formData, this.files).subscribe((res:any) => {
        let msgsAviso: string[] = res.msgsAviso;
        this.messageService.showSuccessMsg('Status alterado com sucesso.');
        if (msgsAviso && msgsAviso.length > 0) {
          this.messageService.showWarnMsg(msgsAviso);
        }
        this.notificarComponentes(this.idPedido.value);
        this.limparCampos();
      }, () => this.messageService.showSuccessMsg('MA00M'));
    }
  }

  public limparCampos(): void {
    this.situacaoProcesso.reset();
    this.idSituacaoProcesso.reset();
    this.idMotivoNegacao.reset();
    this.descricaoHistorico.reset();
    if (this.fileUploadSituacao)
      this.fileUploadSituacao.clear();
  }

}
