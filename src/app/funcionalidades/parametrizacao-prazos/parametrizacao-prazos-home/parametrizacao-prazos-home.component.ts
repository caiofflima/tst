import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../../../shared/components/base.component";
import {ComboService} from "../../../shared/services/comum/combo.service";
import {DadoComboDTO} from "../../../shared/models/dto/dado-combo";
import {FormBuilder} from "@angular/forms";
import {MessageService} from "../../../shared/components/messages/message.service";
import {Router} from "@angular/router";
import {take} from "rxjs/operators";
import {Location} from "@angular/common";

@Component({
    selector: 'asc-parametrizacao-prazos-home',
    templateUrl: './parametrizacao-prazos-home.component.html',
    styleUrls: ['./parametrizacao-prazos-home.component.scss']
})
export class ParametrizacaoPrazosHomeComponent extends BaseComponent implements OnInit {

    listComboTipoProcesso: DadoComboDTO[];
    listComboTipoBeneficiario: DadoComboDTO[];
    listComboSituacaoProcesso: DadoComboDTO[];

    formulario = this.formBuilder.group({
        situacoesProcesso: [null],
        tiposProcesso: [null],
        tiposBeneficiario: [null],
        palavraChave: [null],
        somenteAtivos: [null],
        mudancaAutomatica: [null],
        diasUteis: [null]
    });

    constructor(
        override readonly messageService: MessageService,
        private readonly location: Location,
        private readonly router: Router,
        private readonly formBuilder: FormBuilder,
        private readonly comboService: ComboService,
    ) {
        super(messageService);
    }

    ngOnInit() {
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
        this.router.navigate(['/manutencao/parametros/prazos-status/novo']).then();
    }

    pesquisar(): void {
        const situacoesProcesso = this.formulario.get('situacoesProcesso').value ? this.formulario.get('situacoesProcesso').value.map(v => v.value) : null;
        const tiposProcesso = this.formulario.get('tiposProcesso').value ? this.formulario.get('tiposProcesso').value.map(v => v.value) : null;
        const tiposBeneficiario = this.formulario.get('tiposBeneficiario').value ? this.formulario.get('tiposBeneficiario').value.map(v => v.value) : null;
        const descricaoSituacoes = this.formulario.get('situacoesProcesso').value ? this.formulario.get('situacoesProcesso').value.map(v => v.label).join(', ') : null;
        const descricaoTiposProcesso = this.formulario.get('tiposProcesso').value ? this.formulario.get('tiposProcesso').value.map(v => v.label).join(', ') : null;
        const descricaoTiposBeneficiario = this.formulario.get('tiposBeneficiario').value ? this.formulario.get('tiposBeneficiario').value.map(v => v.label).join(', ') : null;
        this.router.navigate(['/manutencao/parametros/prazos-status/buscar'], {
            queryParams: {
                situacoesProcesso,
                tiposProcesso,
                tiposBeneficiario,
                descricaoSituacoes,
                descricaoTiposProcesso,
                descricaoTiposBeneficiario,
                palavraChave: this.formulario.get('palavraChave').value,
                somenteAtivos: this.formulario.get('somenteAtivos').value,
                mudancaAutomatica: this.formulario.get('mudancaAutomatica').value,
                diasUteis: this.formulario.get('diasUteis').value
            }
        }).then();
    }

    limparCampos(): void {
        this.formulario.reset();
        this.formulario.markAsPristine();
        this.formulario.markAsUntouched();
        this.formulario.updateValueAndValidity();
    }

    voltar(): void {
        this.location.back();
    }
}
