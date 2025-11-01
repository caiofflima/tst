import {Component, Input, OnInit} from '@angular/core';
import {BaseComponent} from '../../../../../app/shared/components/base.component';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from '../../../../../app/shared/components/messages/message.service';
import {Beneficiario} from '../../../../../app/shared/models/comum/beneficiario';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SelectItem} from 'primeng/api';
import {Data} from '../../../../../app/shared/providers/data';
import {ProcedimentoPedidoService} from '../../../../../app/shared/services/comum/procedimento-pedido.service';
import {ProcedimentoService} from '../../../../../app/shared/services/comum/procedimento.service';
import {GrauProcedimentoService} from '../../../../../app/shared/services/comum/grau-procedimento.service';
import {AscValidators} from '../../../../../app/shared/validators/asc-validators';
import * as constantes from '../../../../../app/shared/constantes';
import {take} from "rxjs/operators";

@Component({
  selector: 'asc-procedimentos-pedido',
  templateUrl: './procedimentos-pedido.component.html',
  styleUrls: ['./procedimentos-pedido.component.scss']
})
export class AscProcedimentosPedidoComponent extends BaseComponent implements OnInit {
  @Input()
  rascunhoPedido: boolean;
  public nDoc: string = '';
  public mask: string = '';
  pedido: any;
  listaPedidosProcedimento: any[];
  itensProcedimento: SelectItem[];
  itensGrauProcedimento: SelectItem[];
  formProcedimento: FormGroup;
  public titular: Beneficiario;
  public beneficiario: Beneficiario;
  public idTipoProcesso: number;
  voltarPara: string;

  constructor(
    private fb: FormBuilder,
    protected override messageService: MessageService,
    private route: ActivatedRoute,
    private procedimentoPedidoService: ProcedimentoPedidoService,
    private procedimentoService: ProcedimentoService,
    private grauProcedimentoService: GrauProcedimentoService,
    private router: Router,
    private data: Data
  ) {
    super(messageService);
    this.rascunhoPedido = false;
    this.formProcedimento = this.fb.group({
      id: this.fb.control(null),
      idPedido: this.fb.control(null, Validators.required),
      procedimento: this.fb.control(null, Validators.required),
      grauProcedimento: this.fb.control(null),
      qtdSolicitada: this.fb.control(null, [Validators.required, AscValidators.somenteNumeros(), AscValidators.maiorQueZero()]),
      index: this.fb.control(null),
      tsOperacao: this.fb.control(new Date()),
    });
    this.itensGrauProcedimento = [];
    this.id.valueChanges.subscribe(() => {
      if (this.isAlteracao()) {
        this.procedimento.disable();
      } else {
        this.procedimento.enable();
      }
    });
  }

  get id(): AbstractControl {
    return this.formProcedimento.get('id');
  }

  get idPedido(): AbstractControl {
    return this.formProcedimento.get('idPedido');
  }

  get procedimento(): AbstractControl {
    return this.formProcedimento.get('procedimento');
  }

  get qtdSolicitada(): AbstractControl {
    return this.formProcedimento.get('qtdSolicitada');
  }

  get tsOperacao(): AbstractControl {
    return this.formProcedimento.get('tsOperacao');
  }

  get grauProcedimento(): AbstractControl {
    return this.formProcedimento.get('grauProcedimento');
  }

  get classObrigatorio(): string {
    let obgtro = '';
    if (this.grauObrigatorio()) {
      obgtro = 'obrigatorio';
    }
    return obgtro;
  }

  ngOnInit() {
    this.route.params.pipe(take(1)).subscribe(
      (param: any) => {
        this.voltarPara = param.origem;
      }
    );
    if (this.data.storage) {
      this.pedido = this.data.storage.pedido;
      if (!this.pedido || !this.pedido.id) {
        this.router.navigateByUrl('/meus-dados/pedidos');
      } else {
        this.idPedido.setValue(this.pedido.id);
        if (this.data.storage.tipoProcesso) {
          this.idTipoProcesso = this.data.storage.tipoProcesso.id;
        }
        this.carregarProcedimentos();

        this.itensProcedimento = [];
        this.procedimentoService.consultarProcedimentosPorPedido(this.pedido.id).subscribe(res => {
          for (let pp of res) {
            this.itensProcedimento.push({
              label: constantes.somenteNumeros(pp.estruturaNumerica) + " - " + pp.descricaoProcedimento,
              value: pp
            });
          }
        }, error => this.showDangerMsg(error.error));

      }
    }
  }

  private carregarProcedimentos() {
    this.procedimentoPedidoService.consultarPedidosProcedimentoPorPedido(this.pedido.id).subscribe(res => {
      this.listaPedidosProcedimento = res;
    });
  }

  public carregarGrausProcedimento(grauProcedimentoSelecionado?: any): void {
    let procedimento = this.procedimento.value;
    this.itensGrauProcedimento = [];
    this.grauProcedimento.reset();
    this.grauProcedimentoService.consultarPorProcedimento(procedimento.id).subscribe(res => {
      if (res) {
        for (let grau of res) {
          this.itensGrauProcedimento.push({label: grau.nome, value: grau});
        }
      }
      this.atualizarValidadoresGrau(this.itensGrauProcedimento);
      if (grauProcedimentoSelecionado) {
        this.grauProcedimento.setValue(grauProcedimentoSelecionado);
      }

    }, error => this.showDangerMsg(error.error));
  }

  private atualizarValidadoresGrau(itensGrau: any[]): void {
    if (itensGrau.length > 0) {
      this.grauProcedimento.setValidators([Validators.required])
    } else {
      this.grauProcedimento.setValidators([]);
    }
    this.grauProcedimento.updateValueAndValidity();
  }

  mascara(nDoc) {
    if (nDoc.lenght >= 11) {
      return "99.999.999/9999-99";
    } else {
      return "999.999.999-99";
    }
  }

  public adicionarProcedimento(): void {
    console.log('Aqui 1');
    if (this.isDadosInclusaoValidos()) {
      let entity = this.formProcedimento.value;
      entity.idPedido = this.pedido.id;
      this.procedimentoPedidoService.incluirOuAtualizarPedidoProcedimento(entity).subscribe(() => {
        this.carregarProcedimentos();
        if (!this.rascunhoPedido) {
          this.showSuccessMsg("Procedimento incluido com sucesso");
        }
      }, error => this.showDangerMsg(error.error));
      this.resetFormProcedimento();
    } else {
      this.validateAllFormFields(this.formProcedimento);
    }
  }

  public salvarAlteracao(): void {
    if (this.isDadosInclusaoValidos()) {
      let entity = this.formProcedimento.getRawValue();
      this.procedimentoPedidoService.put(entity).subscribe(() => {
        this.showSuccessMsg('MA104', 'Alteração');
        this.resetFormProcedimento();
        this.carregarProcedimentos();
      }, error => {
        this.showDangerMsg(error.error);
      });
    }
  }

  public limparCampos(): void {
    if (!this.isAlteracao()) {
      this.procedimento.reset();
    }
    this.grauProcedimento.reset();
    this.qtdSolicitada.reset();
  }

  public isGrauProcedimentoInvalido(): boolean {
    let flgInvalido = false;
    if (this.grauObrigatorio()) {
      if (undefined === this.grauProcedimento.value
        || null === this.grauProcedimento.value
        || 0 == this.grauProcedimento.value) {
        flgInvalido = true;
      }
    }
    return flgInvalido;
  }

  public isDadosInclusaoValidos(): boolean {
    let flg = true;
    if (this.formProcedimento.valid) {
      if (this.qtdSolicitada.value <= 0) {
        flg = false;
        this.showDangerMsg('MA060');
      }
      if (this.isGrauProcedimentoInvalido()) {
        flg = false;
        this.showDangerMsg('MA007');
      }
    } else {
      flg = false;
      this.showDangerMsg('MA007');
    }
    return flg;
  }

  public excluir(event: any) {
    if (this.listaPedidosProcedimento && this.listaPedidosProcedimento.length > 1 && event) {
      this.showYesNoDialog('Confirma a exclusão do procedimento?', () => this.procedimentoPedidoService.excluirPorId(event.id).subscribe(() => {
        this.showSuccessMsg('MA039');
        this.carregarProcedimentos();
      }, error => this.showDangerMsg(error.error)));
    } else {
      this.showDangerMsg('MA081');
    }
  }

  public editar(row: any): void {
    this.formProcedimento.reset();
    this.id.setValue(row.id);
    this.idPedido.setValue(row.idPedido);
    this.procedimento.setValue(row.procedimento);
    this.qtdSolicitada.setValue(row.qtdSolicitada);
    this.tsOperacao.setValue(row.tsOperacao);
    this.carregarGrausProcedimento(row.grauProcedimento);
  }

  public isAlteracao(): boolean {
    let flgAlteracao = false;
    if (this.id.value) {
      flgAlteracao = this.id.value.length > 0 || this.id.value > 0;
    }
    return flgAlteracao;
  }

  public cancelarAlteracao(): void {
    this.resetFormProcedimento();
  }

  private resetFormProcedimento() {
    this.itensGrauProcedimento = [];
    this.id.reset();
    this.procedimento.reset();
    this.grauProcedimento.reset();
    this.qtdSolicitada.reset();
  }

  public isAutorizacaoODT(): boolean {
    return constantes.tipoProcesso.autorizacaoPrevia.isODT(this.idTipoProcesso);
  }

  public grauObrigatorio(): boolean {
    return this.itensGrauProcedimento && this.itensGrauProcedimento.length > 0;
  }

  override get constantes(): any {
    return constantes;
  }

  public excluirTodosProcedimentosPedido(idPedido: number): void {
    this.procedimentoPedidoService.excluirProcedimentosPedidoPorIdPedido(idPedido).subscribe(() => {
      this.listaPedidosProcedimento = [];
      this.resetFormProcedimento();
    });
  }
}
