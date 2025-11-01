import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../../../shared/components/base.component";
import {ComboService} from "../../../shared/services/comum/combo.service";
import {DadoComboDTO} from "../../../shared/models/dto/dado-combo";
import {FormBuilder} from "@angular/forms";
import {MessageService} from "../../../shared/components/messages/message.service";
import {Router} from "@angular/router";
import {take} from "rxjs/operators";
import {Location} from "@angular/common";
import { BeneficiarioPedidoService } from 'app/shared/services/services';

@Component({
    selector: 'asc-beneficiario-pedido-home',
    templateUrl: './beneficiario-pedido-home.component.html',
    styleUrls: ['./beneficiario-pedido-home.component.scss']
})
export class BeneficiarioPedidoHomeComponent extends BaseComponent implements OnInit {
    titulo: string
    listComboTipoProcesso: DadoComboDTO[];
    listComboTipoBeneficiario: DadoComboDTO[];
    listComboSituacaoProcesso: DadoComboDTO[];
    override baseURL: string

    formulario = this.formBuilder.group({
        tiposProcesso: [null],
        tiposBeneficiario: [null],
        somenteAtivos: [null],
      
    });

    constructor(
        override readonly messageService: MessageService,
        private readonly location: Location,
        private readonly router: Router,
        private readonly formBuilder: FormBuilder,
        private readonly comboService: ComboService,
        private readonly beneficiarioPedidoService: BeneficiarioPedidoService
    ) {
        super(messageService);
    }

    ngOnInit() {
        this.titulo = this.beneficiarioPedidoService.getTitulo()
        this.baseURL = this.beneficiarioPedidoService.getBaseURL()
        this.inicializarCombos();
    }

    inicializarCombos(): void {
        this.comboService.consultarComboTipoBeneficiario().pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(res => this.listComboTipoBeneficiario = res, err => this.showDangerMsg(err.error));

        this.comboService.consultarComboTipoProcesso().pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(res => this.listComboTipoProcesso = res, err => this.showDangerMsg(err.error));

        this.comboService.consultarComboSituacaoProcesso().pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(res => this.listComboSituacaoProcesso = res, err => this.showDangerMsg(err.error));
    }


    novoPrazo(): void {
        this.router.navigate([`${this.baseURL}/novo`]);
    }

    pesquisar(): void {
        
        const tiposProcesso = this.formulario.get('tiposProcesso').value ? this.formulario.get('tiposProcesso').value.map(v => v.value) : null;
        const tiposBeneficiario = this.formulario.get('tiposBeneficiario').value ? this.formulario.get('tiposBeneficiario').value.map(v => v.value) : null;
        const descricaoTiposProcesso = this.formulario.get('tiposProcesso').value ? this.formulario.get('tiposProcesso').value.map(v => v.label).join(', ') : null;
        const descricaoTiposBeneficiario = this.formulario.get('tiposBeneficiario').value ? this.formulario.get('tiposBeneficiario').value.map(v => v.label).join(', ') : null;
        this.router.navigate([`${this.baseURL}/buscar`], {
            queryParams: {
                tiposProcesso,
                tiposBeneficiario,
                descricaoTiposProcesso,
                descricaoTiposBeneficiario,
                somenteAtivos: this.formulario.get('somenteAtivos').value
            }
        }).then();
    }

    limparCampos(): void {
        this.formulario.reset();
        this.formulario.markAsPristine();
        this.formulario.markAsUntouched();
        this.formulario.updateValueAndValidity();
    }

    onChangeInativo(event: any): void {
        // Método para lidar com mudanças no checkbox de inativo
    }

    voltar(): void {
        this.location.back();
    }
}
