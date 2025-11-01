import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MessageService, SessaoService} from "../../../../services/services";
import {BeneficiarioForm} from "../../models/beneficiario.form";
import {Beneficiario} from "../../../../models/entidades";
import {AscValidators} from "../../../../validators/asc-validators";
import {somenteNumeros} from "../../../../constantes";
import {CdkStepper} from "@angular/cdk/stepper";
import {fadeAnimation} from "../../../../animations/faded.animation";
import {Subject, Subscription} from "rxjs";

@Component({
    selector: 'asc-beneficiario-pedido',
    templateUrl: './asc-beneficiario-pedido.component.html',
    styleUrls: ['./asc-beneficiario-pedido.component.scss'],
    animations: [...fadeAnimation]
})
export class AscBeneficiarioPedido implements OnInit {

    @Output()
    readonly beneficarioForm = new EventEmitter<BeneficiarioForm>();

    @Output()
    readonly beneficiarioModel = new EventEmitter<Beneficiario>();

    @Input()
    routerLinkToBack: string

    @Input()
    stepper: CdkStepper;

    @Input() checkRestart: Subject<void>;

    matricula: string;

    private eventsSubscription: Subscription;

    readonly formularioSolicitacao = new FormGroup({
        idBeneficiario: new FormControl(null, Validators.required),
        email: new FormControl(null, AscValidators.email()),
        telefoneContato: new FormControl(null, AscValidators.telefoneOuCelular),
        idTipoBeneficiario: new FormControl(null),
    });

    private beneficiario: Beneficiario;

    showProgress = false;

    constructor(
        private messageService: MessageService
    ) {
    }

    ngOnInit() {
        this.matricula = SessaoService.getMatriculaFuncional();

        this.eventsSubscription = this.checkRestart.subscribe(() => {
            this.formularioSolicitacao.reset();
        });
    }

    ngOnDestroy() {
        this.eventsSubscription.unsubscribe();
    }

    onSubmit(): void {
        if (this.formularioSolicitacao && this.formularioSolicitacao.valid) {
            this.showProgress = true;
            const beneficiarioForm = this.formularioSolicitacao.getRawValue() as BeneficiarioForm;
            beneficiarioForm.telefoneContato = somenteNumeros(beneficiarioForm.telefoneContato);
            beneficiarioForm.idTipoBeneficiario = this.beneficiario.contratoTpdep.idTipoBeneficiario;
            beneficiarioForm.nome = this.beneficiario.nome.toUpperCase();
            this.showProgress = false;
            this.beneficarioForm.emit(beneficiarioForm);
            this.beneficiarioModel.emit({...this.beneficiario, email: beneficiarioForm.email});
            this.stepper.next();
        }

    }

    beneficarioSelecionado(beneficiario: Beneficiario) {
        if (beneficiario && beneficiario.contratoTpdep && beneficiario.contratoTpdep.tipoDependente &&
            beneficiario.contratoTpdep.tipoDependente.k9Deprestrito === 'S') {
            this.messageService.showDangerMsg('MA063')
            this.formularioSolicitacao.get('idBeneficiario').setValue(null);
            this.beneficiario = null;
        } else {
            this.beneficiario = beneficiario;
        }
    }
}
