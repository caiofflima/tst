import { Component, Input } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { DocumentosFiscalBase } from "../../../../shared/components/asc-pedido/asc-resumo/asc-card-documento-fiscal/asc-documento-fiscal-base";
import { CdkStepper } from "@angular/cdk/stepper";
import { DocumentoFiscal } from "../models/documento-fiscal.model";
import { LocalidadeService } from "../../../../shared/services/comum/localidade.service";
import { Beneficiario, Pedido } from "../../../../shared/models/entidades";
import { AscValidators } from "app/shared/validators/asc-validators";
import { BeneficiarioService, MessageService } from 'app/shared/services/services';
import { somenteNumeros } from "../../../../shared/constantes";
import { ProcessoService } from 'app/shared/services/comum/processo.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'asc-documentos-fiscal',
  templateUrl: './documentos-fiscal.component.html',
  styleUrls: ['./documentos-fiscal.component.scss']
})
export class DocumentosFiscalComponent extends DocumentosFiscalBase {

  @Input() stepper: CdkStepper;
  @Input() beneficiario: Beneficiario;
  @Input() pedido: Pedido; // Recebe o pedido completo

  private _pedidoProcedimentoVersao: number;

  @Input()
  set pedidoProcedimentoVersao(versao: number) {
    if (this._pedidoProcedimentoVersao != versao) {
      this.formularioDocumentoFiscal.reset();
    }

    this._pedidoProcedimentoVersao = versao;
  }

  hide = true;

  constructor(protected override readonly localidadeService: LocalidadeService,
              protected readonly beneficiarioService: BeneficiarioService,
              protected readonly messageService: MessageService,
              private readonly processoService: ProcessoService) {
    super(localidadeService);
  }

  override ngOnInit() {
    this.iniciar();
  }

  iniciar() {
    this.configurarCNPJ();
  }

  configurarCNPJ() {
    if (this.isTipoMedicamento) {
      this.cpfCnpj = new FormControl(null, [Validators.required, AscValidators.cnpjValidator()]);
    } else {
      this.cpfCnpj = new FormControl(null, [Validators.required, AscValidators.cpfOuCnpj()]);
    }
  }

  buttonToPrevious() {
    this.stepper.previous();
  }

  buttonToNext(): void {
    this.hide = false;
    this.configurarCNPJ();
    
    // Verificar se existe um pedido semelhante antes de avançar
    this.verificarPedidoExistente().subscribe(existePedido => {
      if (existePedido) {
        this.messageService.addMsgDanger("Tipo de processo já cadastrado e em aberto para a(o) beneficiária(o).");
        return

      }
   
        this.beneficiarioService.consultarTitularPorCPF(somenteNumeros(this.formularioDocumentoFiscal.value.cpfCnpj)).subscribe((res: Beneficiario) => {
          if (res) {
            this.messageService.addMsgDanger("CPF informado pertence a empregado CAIXA.");
          } else {
            if (this.formularioDocumentoFiscal && this.formularioDocumentoFiscal.valid) {
              const documentoFiscal = this.formularioDocumentoFiscal.getRawValue() as DocumentoFiscal;
              documentoFiscal.municipioAsObject = this.municipio;
              // Certifique-se de que o número do documento está presente e válido
              if (!documentoFiscal.numeroDoc) {
                this.messageService.addMsgDanger("Número do documento fiscal é obrigatório.");
                return;
              }
              this.documentoFiscal$.emit(documentoFiscal);
              this.stepper.next();
            }
          }
        }, (err) => {
          this.messageService.addMsgDanger(err.error);
        });
      
    });
  }

  private verificarPedidoExistente(): Observable<boolean> {
    const documentoFiscal = this.formularioDocumentoFiscal.getRawValue() as DocumentoFiscal;
    
    // Criar um clone do pedido atual incluindo as informações necessárias para verificação
    const pedidoParaVerificar = Object.assign({}, this.pedido, {
      numeroDocumentoFiscal: documentoFiscal.numeroDoc,
      dataEmissaoDocumentoFiscal: documentoFiscal.data,
      pedidosProcedimento: this._pedidoProcedimentos

    });
  
    console.log('Pedido para Verificar:', pedidoParaVerificar); // Log do pedido que está sendo enviado
    console.log('procedimentos', this._pedidoProcedimentos);

    return this.processoService.consultarPedidoEmAbertoSemelhante(pedidoParaVerificar).pipe(
      map(pedidosExistentes => {
        console.log('Pedidos Existentes Retornados:', pedidosExistentes); // Log da resposta recebida
        return Array.isArray(pedidosExistentes) && pedidosExistentes.length > 0;
      })
    );
  }  

  displayAfter(controlName: string): boolean {
    const control = this.formularioDocumentoFiscal.get(controlName);
    return control.valid || control.dirty || control.touched;
  }
}
