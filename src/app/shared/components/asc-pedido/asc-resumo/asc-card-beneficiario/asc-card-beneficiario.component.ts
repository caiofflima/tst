import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BaseComponent} from "../../../base.component";
import {MessageService} from "../../../messages/message.service";
import {BeneficiarioForm} from "../../models/beneficiario.form";
import {FormControl, FormGroup} from '@angular/forms';
import {AscValidators} from "../../../../validators/asc-validators";
import {somenteNumeros} from "../../../../constantes";
import {fadeAnimation} from "../../../../animations/faded.animation";


@Component({
  selector: 'asc-card-beneficiario',
  templateUrl: './asc-card-beneficiario.component.html',
  styleUrls: ['./asc-card-beneficiario.component.scss'],
  animations: [...fadeAnimation]
})
export class AscCardBeneficiarioComponent extends BaseComponent {
  @Input() titleCardBeneficiario = "Dados do beneficiário";
  @Input() titleBeneficiario = "Beneficiário";
  @Input() infoAdicionaisBeneficiario = "Informações adicionais de contato";
  @Input() beneficiarioForm: BeneficiarioForm;
  @Output() readonly beneficarioFormEmiter = new EventEmitter<BeneficiarioForm>();
  @Output('onEditing') readonly onEditing$ = new EventEmitter<boolean>();

  private _modoEdicao: boolean = false;

  readonly form = new FormGroup({
    email: new FormControl(null, AscValidators.email()),
    telefoneContato: new FormControl(null, AscValidators.telefoneOuCelular),
  });

  set modoEdicao(b: boolean) {
    this._modoEdicao = b;
    this.onEditing$.emit(this._modoEdicao);
  }

  get modoEdicao(): boolean{
    return this._modoEdicao;
  }

  constructor(protected override readonly messageService: MessageService) {
    super(messageService);
  }

  setEdicao(status: boolean): void {
    if (status) {
      this.form.get('email').setValue(this.beneficiarioForm.email);
      this.form.get('telefoneContato').setValue(this.beneficiarioForm.telefoneContato);
    }
    this.modoEdicao = status;
  }

  onSubmit(): void {
    if (this.form.valid) {
      const beneficiarioFormAux = this.form.getRawValue() as BeneficiarioForm;
      beneficiarioFormAux.telefoneContato = somenteNumeros(beneficiarioFormAux.telefoneContato);
      this.beneficarioFormEmiter.emit({...this.beneficiarioForm, ...beneficiarioFormAux});
      this.form.reset();
      this.messageService.addMsgSuccess("campos atualizados com sucesso!");
      this.setEdicao(false);
    }
  }

}
