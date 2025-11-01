import { Component } from '@angular/core';
import { MessageService } from "app/shared/components/messages/message.service";
import { BaseComponent } from "app/shared/components/base.component";
import { DocumentoTipoProcesso } from "../../../../shared/models/dto/documento-tipo-processo";
import { Subject } from 'rxjs';
import { ReciboModel } from '../../models/recibo-form.model';
import { Beneficiario, MotivoSolicitacao } from "../../../../shared/models/entidades";
import { DocumentoParam } from '../../../../shared/components/asc-pedido/models/documento.param';
import { TipoDependente } from 'app/shared/models/comum/tipo-dependente';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'renovar-dependente',
  templateUrl: './renovar-dependente.component.html',
  styleUrls: ['./renovar-dependente.component.scss']
})
export class RenovarDependenteComponent extends BaseComponent {
  parametro: DocumentoParam = {};
  readonly idTipoProcesso = 14;
  documentos: DocumentoTipoProcesso[] = [];
  reinicarSubject: Subject<void> = new Subject<void>();
  processoEnviado: boolean = false;
  recibo: ReciboModel;
  beneficiarioModel?: Beneficiario;
  motivoSolicitacaoModel?: MotivoSolicitacao;
  tipoDependenteModel: TipoDependente;
  idBeneficiarioModel = null;
  showDocumentStep: boolean = false;

  breadcrumb: Array<string> = [
    "Novo Pedido ", "Beneficiário ", "Renovação de Dependente "
  ];

  constructor(
    protected override messageService: MessageService,
    protected route: ActivatedRoute) {
    super(messageService);
    this.idBeneficiarioModel = this.route.snapshot.params['idBeneficiario'];
  }

  beneficiarioModelSelecionado(beneficiarioModel: Beneficiario) {
    this.beneficiarioModel = beneficiarioModel;
    this.updateAndAssignParameters();
  }

  motivoRenovacaoModelSelecionado(motivoSolicitacao: MotivoSolicitacao) {
    this.motivoSolicitacaoModel = motivoSolicitacao;
    this.updateAndAssignParameters();
  }

  tipoDependenteModelSelecionado(tipoDependente: TipoDependente) {
    this.tipoDependenteModel = tipoDependente;
    this.updateAndAssignParameters();
  }

  // Function to handle stepper selection changes
  onStepperChange(event: any) {
    if (event.selectedIndex === 1) { // Assuming '1' is the index of your "Documentos" step
      this.updateAndAssignParameters();
      this.showDocumentStep = true;
    }
  }

  private updateAndAssignParameters() {
    if (!this.beneficiarioModel || !this.tipoDependenteModel || !this.motivoSolicitacaoModel) {
        console.error('Parametros não podem ser atualizados; dados insuficientes.');
        return;
    }

    const { matricula, estadoCivil, idTipoDeficiencia, remuneracaoBase } = this.beneficiarioModel;

    this.parametro = {
      idMotivo: this.motivoSolicitacaoModel.id,
      idTipoProcesso: this.idTipoProcesso,
      idTipoBeneficiario: this.tipoDependenteModel.id,
      sexo: matricula ? matricula.sexo : null,
      idEstadoCivil: estadoCivil ? estadoCivil.id : null,
      idade: matricula && matricula.dataNascimento ? this.calcularIdade(new Date(matricula.dataNascimento)) : null,
      valorRenda: remuneracaoBase ? parseFloat(remuneracaoBase) : 0,
      idTipoDeficiencia: idTipoDeficiencia,
    };

    console.log("Parâmetros atualizados:", this.parametro);
  }

  calcularIdade(dataNascimento: Date): number {
    if (!dataNascimento) return null;
    const today = new Date();
    let age = today.getFullYear() - dataNascimento.getFullYear();
    const m = today.getMonth() - dataNascimento.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dataNascimento.getDate())) {
      age--;
    }
    return age;
  }

  documentosSelecionados(documentos: DocumentoTipoProcesso[]) {
    this.documentos = documentos;
  }

  setProcessoEnviado(recibo: ReciboModel): void {
    this.processoEnviado = true;
    this.recibo = recibo;
    this.messageService.showSuccessMsg('Pedido enviado com sucesso.');
  }
}
