import {Component, EventEmitter, OnInit, Output, Input, OnDestroy} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MessageService} from "../../../../../app/shared/components/messages/message.service";
import {BaseComponent} from "../../../../../app/shared/components/base.component";
import {SessaoService} from '../../../../shared/services/services';
import {somenteNumeros} from '../../../../shared/constantes';
import {AscValidators} from '../../../../shared/validators/asc-validators';
import {Beneficiario} from '../../../../shared/models/comum/beneficiario';
import {BeneficiarioForm} from "../../../../shared/components/asc-pedido/models/beneficiario.form";
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-solicitacao',
  templateUrl: './solicitacao.component.html',
  styleUrls: ['./solicitacao.component.scss']
})

export class SolicitacaoComponent extends BaseComponent implements OnInit, OnDestroy {
  readonly matricula = SessaoService.usuario.matriculaFuncional;

  @Output()
  readonly solicitacao = new EventEmitter<BeneficiarioForm>();

  @Output()
  readonly beneficiarioModel = new EventEmitter<Beneficiario>();

  private eventsSubscription: Subscription;

  @Input()
  checkRestart : Observable<void>;


  readonly formularioSolicitacao = new FormGroup({
    idBeneficiario: new FormControl(null, Validators.required),
    email: new FormControl(null, AscValidators.email()),
    telefoneContato: new FormControl(null, AscValidators.telefone),
    idTipoBeneficiario: new FormControl(null),
    noBeneficiario: new FormControl(null),
  });

  beneficiario: Beneficiario;

  constructor(protected override messageService: MessageService) {
    super(messageService);
  }

  onSubmit(): void {
    const solicitacao = this.formularioSolicitacao.getRawValue() as BeneficiarioForm;
    solicitacao.telefoneContato = somenteNumeros(solicitacao.telefoneContato);
    solicitacao.idTipoBeneficiario = this.beneficiario.contratoTpdep.idTipoBeneficiario;
    solicitacao.nome = this.beneficiario.nome;

    this.solicitacao.emit(solicitacao);
  }

  beneficarioSelecionado(beneficiario: Beneficiario) {
    this.beneficiario = beneficiario;
    this.beneficiarioModel.emit(beneficiario);
  }

  ngOnInit() {
    this.eventsSubscription = this.checkRestart.subscribe(() => this.formularioSolicitacao.reset());
  }

  override ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

}
