import {Component, EventEmitter, Input, OnDestroy, OnInit} from '@angular/core';
import {Pedido} from "../../../../models/comum/pedido";
import {DateUtil} from "../../../../util/date-util";
import {filter, map, takeUntil, tap} from "rxjs/operators";
import {isNotUndefinedNullOrEmpty} from "../../../../constantes";
import {Beneficiario} from "../../../../models/comum/beneficiario";
import {AscComponenteAutorizado} from "../../../asc-pedido/asc-componente-autorizado";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AscValidators} from "../../../../validators/asc-validators";
import {ProcessoService} from "../../../../services/comum/processo.service";
import {MessageService} from "../../../../services/services";
import {Util} from "../../../../../arquitetura/shared/util/util";
import {Usuario} from "../../../../../arquitetura/shared/models/cadastrobasico/usuario";

@Component({
    selector: 'asc-beneficiario-card',
    templateUrl: './beneficiario-card.component.html',
    styleUrls: ['./beneficiario-card.component.scss']
})
export class BeneficiarioCardComponent extends AscComponenteAutorizado implements OnInit, OnDestroy {

    private _processo = new Pedido();
    private _pedidoAux = new Pedido();

    modoEdicao: boolean = false;

    form: FormGroup;

    @Input()
    user: any;

    readonly processo$ = new EventEmitter<Pedido>();

    newdate = new Date();

    beneficiario = new Beneficiario();

    idadeBeneficiario: number = 0;

    usuario: Usuario;

    showInfoTitular = false;

    titular: any;

    constructor(
        private readonly _fb: FormBuilder,
        private readonly messageService: MessageService,
        private readonly processoService: ProcessoService
    ) {
        super();
        this.form = _fb.group({
            id: _fb.control("", Validators.required),
            email: _fb.control("", [AscValidators.email()]),
            telefoneContato: _fb.control("", [AscValidators.telefoneOuCelular])
        });
    }

    get id(): AbstractControl {
        return this.form.get("id");
    }

    get email(): AbstractControl {
        return this.form.get("email");
    }

    get telefoneContato(): AbstractControl {
        return this.form.get("telefoneContato");
    }

    ngOnInit() {
        this.extrairIdade();
        this.extrairBeneficiarioProcesso();
    }

    @Input()
    set processo(processo: Pedido) {
        this._processo = processo;
        this.processo$.emit(processo)
    }

    get processo() {
        return this._processo;
    }

    onSubmit() {
        if (this.form.valid) {
            this.telefoneContato.setValue(Util.somenteNumeros(this.telefoneContato.value));
            const pedido: Pedido = this.form.value;
            this.processoService.alterarEmailAndTelefoneContato(pedido).subscribe(() => {
                this.messageService.addMsgSuccess("Contatos alterados.");
                this.processo.telefoneContato = pedido.telefoneContato;
                this.processo.email = pedido.email;
                this.modoEdicao = false;
                this.form.reset();
            }, error => {
                this.messageService.addMsgDanger(error.error || error.message)
            });
        }
    }

    private extrairIdade() {
        this.processo$.pipe(
            filter(isNotUndefinedNullOrEmpty),
            filter((processo: Pedido) => isNotUndefinedNullOrEmpty(processo.beneficiario)),
            map((processo: Pedido) => processo.beneficiario.matricula.dataNascimento),
            map((dataNascimento: string) => Util.getDate(dataNascimento)),
            map((dataNascimento: Date) => DateUtil.getIdade(dataNascimento)),
            tap((idade: number) => this.idadeBeneficiario = idade),
            takeUntil(this.unsubscribe$)
        ).subscribe()
    }

    clickAlterarDados(flgAlterar: boolean): void {
        this.modoEdicao = flgAlterar;
        if (this.modoEdicao && this.processo) {
            this.id.setValue(this.processo.id);
            if (this._processo.telefoneContato && this._processo.telefoneContato > 0) {
                this.telefoneContato.setValue(this._processo.telefoneContato);
            }
            if (this._processo.email && this._processo.email.length > 0) {
                this.email.setValue(this._processo.email);
            }
        } else {
            this.form.reset();
        }
    }

    private extrairBeneficiarioProcesso() {
        this.processo$.pipe(
            map((processo: Pedido) => this.beneficiario = processo.beneficiario),
            takeUntil(this.unsubscribe$)
        ).subscribe()
    }

    fecharInfoTitular() {
        this.showInfoTitular = false;
    }

    verificarEhTitularEPedidoEmAnalise():boolean {
        let situacao = 'SOB_ANALISE_EQUIPE_TEC_ADMINISTRATIVA';

        if(sessionStorage && sessionStorage.getItem('titular')){
            this.titular = sessionStorage.getItem('titular').toString;
        }

        if(this.processo){
            return this._pedidoAux.verificarEhTitularEPedidoEmAnalise(this.titular, this.processo, situacao);
        }
        return false;
    }    

}
