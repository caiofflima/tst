import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MessageService} from "../../../../../app/shared/components/messages/message.service";
import {BaseComponent} from "../../../../../app/shared/components/base.component";
import {Patologia} from '../../../../shared/models/comum/patologia';
import {CdkStepper} from "@angular/cdk/stepper";
import {Observable, Subject, Subscription} from 'rxjs';
import {MedicamentoService} from "../../../../shared/services/comum/pedido/medicamento.service";
import {Medicamento} from "../../../../shared/models/comum/medicamento";
import {take} from "rxjs/operators";

@Component({
    selector: 'app-patologia',
    templateUrl: './patologia.component.html',
    styleUrls: ['./patologia.component.scss']
})

export class PatologiaComponent extends BaseComponent implements OnInit, OnDestroy {

    @Output()
    readonly patologia = new EventEmitter<Patologia>();

    @Input() stepper: CdkStepper;

    @Input() checkRestart: Subject<void>;
    private eventsSubscription: Subscription;

    medicamentosLista: Medicamento[];
    patologiaSelecionada: Patologia;

    coPatologia = new FormControl(null, Validators.required);

    readonly formularioPatologia = new FormGroup({
        coPatologia: this.coPatologia,
        noPatologia: new FormControl(null),
    });

    constructor(
        protected override messageService: MessageService,
        private readonly medicamentosService: MedicamentoService
    ) {
        super(messageService);
    }

    onSubmit(): void {
        this.patologia.emit(this.patologiaSelecionada);
        this.stepper.next();
    }

    patologiaSelecionado(patologia: Patologia) {
        this.patologiaSelecionada = patologia;
        if (!this.coPatologia.value) {
            this.medicamentosLista = [];
        } else {
            this.medicamentosService.carregarPor(null, this.coPatologia.value).pipe(
                take<Medicamento[]>(1)
            ).subscribe(res => this.medicamentosLista = res,
                () => this.showDangerMsg('Um erro aconteceu. Por favor, entre em contato com o administrador')
            );
        }
    }

    ngOnInit() {
        this.eventsSubscription = this.checkRestart.subscribe(() => {
            this.formularioPatologia.reset();
        });
    }

    override ngOnDestroy() {
        this.eventsSubscription.unsubscribe();
    }

    previousStep(_: MouseEvent) {
        this.stepper.previous();
    }
}
