import {ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {SessaoService} from "../../../../arquitetura/shared/services/seguranca/sessao.service";
import {Beneficiario} from "../../../models/comum/beneficiario";
import {BeneficiarioService} from "../../../services/comum/beneficiario.service";
import {take} from "rxjs/operators";
import {MessageService} from "../../../services/services";

@Component({
    selector: 'asc-modal-dados-titular',
    templateUrl: './asc-modal-dados-titular.component.html',
    styleUrls: ['./asc-modal-dados-titular.component.scss']
})
export class AscModalDadosTitularComponent {

    beneficiario: Beneficiario;
    showModal = false;

    @Output()
    showModalChange = new EventEmitter<boolean>();

    @Input()
    matriculaFuncional: string = '';

    @Input("showModal")
    set setShowModal(show: boolean) {
        if (!this.beneficiario && show) {
            this.beneficiarioService.consultarTitularPorMatricula(this.matriculaFuncional, true).pipe(
                take<Beneficiario>(1)
            ).subscribe(beneficiario => {
                this.beneficiario = beneficiario;
                this.showModal = true;
                this.changeDetectorRef.detectChanges();
            }, error => this.messageService.showDangerMsg(error.error));
        }
    }

    constructor(
        private readonly sessaoService: SessaoService,
        private readonly beneficiarioService: BeneficiarioService,
        private readonly messageService: MessageService,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {
    }

    fecharModal() {
        this.beneficiario = null;
        this.showModal = false;
        this.showModalChange.emit(this.showModal);
    }
}
