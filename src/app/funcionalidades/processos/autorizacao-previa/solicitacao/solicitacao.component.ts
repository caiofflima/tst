import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {somenteNumeros} from '../../../../shared/constantes';
import {SolicitacaoFormModel} from '../models/solicitacao-form.model';
import {AscValidators} from '../../../../shared/validators/asc-validators';
import {Beneficiario} from '../../../../shared/models/comum/beneficiario';
import {SessaoService} from "../../../../shared/services/services";
import {Subject, Subscription} from "rxjs";
import {Router} from '@angular/router';
import {CdkStepper} from '@angular/cdk/stepper';

@Component({
    selector: 'app-solicitacao',
    templateUrl: './solicitacao.component.html',
    styleUrls: ['./solicitacao.component.scss'],
})
export class SolicitacaoComponent implements OnInit, OnDestroy {

    @Output()
    readonly solicitacao = new EventEmitter<SolicitacaoFormModel>();

    @Output()
    readonly beneficiarioModel = new EventEmitter<Beneficiario>();

    @Input()
    checkRestart: Subject<void>;

    @Input()
    stepper: CdkStepper;

    private eventsSubscription: Subscription;

    readonly formularioSolicitacao = new FormGroup({
        idBeneficiario: new FormControl(null, Validators.required),
        email: new FormControl(null, AscValidators.email()),
        telefoneContato: new FormControl(null, AscValidators.telefoneOuCelular),
        idTipoBeneficiario: new FormControl(null),
    });

    constructor(private readonly router: Router) {}

    ngOnInit() {
        this.eventsSubscription = this.checkRestart.subscribe(() => {
            this.formularioSolicitacao.reset();
        });
    }

    ngOnDestroy() {
        this.eventsSubscription.unsubscribe();
    }

    onSubmit(): void {
        const solicitacao = this.formularioSolicitacao.getRawValue() as SolicitacaoFormModel;
        solicitacao.telefoneContato = somenteNumeros(solicitacao.telefoneContato);
        this.solicitacao.emit(solicitacao);
        this.stepper?.next();
    }

    onVoltar(): void {
        this.router.navigate(['/pedidos/autorizacao-previa']);
    }

    beneficarioSelecionado(beneficiario: Beneficiario) {
        this.beneficiarioModel.emit(beneficiario);
    }

    get matricula(): string {
        return SessaoService.getMatriculaFuncional();
    }
}
