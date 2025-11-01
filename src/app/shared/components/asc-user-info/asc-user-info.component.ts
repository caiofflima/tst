import {Component, Input} from '@angular/core';
import {Usuario} from "../../../arquitetura/shared/models/cadastrobasico/usuario";
import {Beneficiario} from "../../models/comum/beneficiario";
import {BeneficiarioService} from "../../services/comum/beneficiario.service";
import {SessaoService} from "../../../arquitetura/shared/services/seguranca/sessao.service";
import { take } from 'rxjs';

@Component({
    selector: 'asc-user-info',
    templateUrl: './asc-user-info.component.html',
    styleUrls: ['./asc-user-info.component.scss']
})
export class AscUserInfoComponent {

    titular: Beneficiario;
    showInfoTitular = false;
    _usuario: Usuario;

    constructor(
        private readonly beneficiarioService: BeneficiarioService,
        public readonly sessaoService: SessaoService
    ) {
    }

    get usuario(): Usuario {
        return this._usuario;
    }

    @Input()
    set usuario(usuario: Usuario) {
        this._usuario = usuario;

        if (usuario && usuario.idTitular) {
            this.beneficiarioService.consultarTitularPorBeneficiario(usuario.idTitular).pipe(take(1)).subscribe(titular => this.titular = titular as any);
        }
    }

    exibirInfoTitular() {
        this.showInfoTitular = true;
    }
}
