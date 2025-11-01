import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BaseComponent} from 'app/shared/components/base.component';
import {MessageService} from 'app/shared/components/messages/message.service';
import {FormBuilder} from '@angular/forms';
import {FiltroConsultaEmail} from 'app/shared/models/filtro/filtro-consulta-email';
import {DadoComboDTO} from 'app/shared/models/dto/dado-combo';
import {ComboService} from 'app/shared/services/comum/combo.service';
import {take} from "rxjs/operators";
import {Location} from "@angular/common";

@Component({
    selector: 'app-email-situacao-home',
    templateUrl: './email-situacao-home.component.html',
})
export class EmailSituacaoHomeComponent extends BaseComponent implements OnInit {

    filtro: FiltroConsultaEmail = new FiltroConsultaEmail();

    listComboSituacaoProcesso: DadoComboDTO[];
    listComboTipoProcesso: DadoComboDTO[];
    listComboTipoBeneficiario: DadoComboDTO[];

    tipoOcorrencia = new DadoComboDTO("OBSERVAÇÃO", 1000);

    formulario = this.formBuilder.group({
        situacoesProcesso: [null],
        tiposProcesso: [null],
        tiposBeneficiario: [null],
        palavraChave: [null],
        somenteAtivos: [null]
    });

    constructor(
        override readonly messageService: MessageService,
        private readonly router: Router,
        private readonly location: Location,
        private readonly formBuilder: FormBuilder,
        private readonly comboService: ComboService
    ) {
        super(messageService);
    }

    ngOnInit() {
        this.comboService.consultarComboSituacaoProcesso().pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(res => {
            this.listComboSituacaoProcesso = res
            this.listComboSituacaoProcesso.push(this.tipoOcorrencia);
        },
             err => this.showDangerMsg(err.error));

        this.comboService.consultarComboTipoProcesso().pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(res => this.listComboTipoProcesso = res, err => this.showDangerMsg(err.error));
    }

    onChangeTipoProcesso(): void {
        let tiposProcesso: DadoComboDTO[] = this.formulario.controls.tiposProcesso.value;
        this.listComboTipoBeneficiario = [];
        if (tiposProcesso && tiposProcesso.length > 0) {
            this.comboService.consultarComboTipoBeneficiarioPorTipoProcesso(tiposProcesso.map(x => x.value)).pipe(
                take<DadoComboDTO[]>(1)
            ).subscribe(res => this.listComboTipoBeneficiario = res, err => this.showDangerMsg(err.error));
        }
    }

    limparCampos() {
        this.formulario.reset();
    }

    pesquisarEmails() {
        const situacoesProcesso = this.formulario.get('situacoesProcesso').value ? this.formulario.get('situacoesProcesso').value.map(v => v.value) : null;
        const tiposProcesso = this.formulario.get('tiposProcesso').value ? this.formulario.get('tiposProcesso').value.map(v => v.value) : null;
        const tiposBeneficiario = this.formulario.get('tiposBeneficiario').value ? this.formulario.get('tiposBeneficiario').value.map(v => v.value) : null;

        const descricaoSituacoes = this.formulario.get('situacoesProcesso').value ? this.formulario.get('situacoesProcesso').value.map(v => v.label).join(', ') : null;
        const descricaoTiposProcesso = this.formulario.get('tiposProcesso').value ? this.formulario.get('tiposProcesso').value.map(v => v.label).join(', ') : null;
        const descricaoTiposBeneficiario = this.formulario.get('tiposBeneficiario').value ? this.formulario.get('tiposBeneficiario').value.map(v => v.label).join(', ') : null;
        
        this.router.navigate(['/manutencao/parametros/email/buscar'], {
            queryParams: {
                situacoesProcesso,
                tiposProcesso,
                tiposBeneficiario,
                descricaoSituacoes,
                descricaoTiposProcesso,
                descricaoTiposBeneficiario,
                palavraChave: this.formulario.get('palavraChave').value,
                somenteAtivos: this.formulario.get('somenteAtivos').value
            }
        });
    }

    voltar(): void {
        this.location.back();
    }
}
