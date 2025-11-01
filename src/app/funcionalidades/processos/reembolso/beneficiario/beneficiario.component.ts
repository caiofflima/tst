import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SessaoService} from '../../../../shared/services/services';
import {somenteNumeros} from '../../../../shared/constantes';
import {AscValidators} from '../../../../shared/validators/asc-validators';
import {Beneficiario} from '../../../../shared/models/comum/beneficiario';
import {BeneficiarioForm} from '../../../../shared/components/asc-pedido/models/beneficiario.form';

@Component({
  selector: 'asc-beneficiario',
  templateUrl: './beneficiario.component.html',
  styleUrls: ['./beneficiario.component.scss']
})
export class BeneficiarioComponent {

  readonly matricula = SessaoService.usuario.matriculaFuncional;
  @Output()
  readonly beneficiarioModel = new EventEmitter<Beneficiario>();
  @Output()
  readonly solicitacao = new EventEmitter<BeneficiarioForm>();

  readonly formularioSolicitacao = new FormGroup({
    idBeneficiario: new FormControl(null, Validators.required),
    email: new FormControl(null, AscValidators.email()),
    telefoneContato: new FormControl(null),
    idTipoBeneficiario: new FormControl(null),
  });

  onSubmit(): void {
    const solicitacao = this.formularioSolicitacao.getRawValue() as BeneficiarioForm;
    solicitacao.telefoneContato = somenteNumeros(solicitacao.telefoneContato);
    this.solicitacao.emit(solicitacao);

  }

  beneficarioSelecionado(beneficiario: Beneficiario) {
    this.beneficiarioModel.emit(beneficiario);
  }

  nextPage(_: MouseEvent) {
    console.log('nextPage');
  }
}
