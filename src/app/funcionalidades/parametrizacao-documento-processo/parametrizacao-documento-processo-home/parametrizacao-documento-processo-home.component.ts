import {Component, OnInit} from '@angular/core';
import {take} from "rxjs/operators";
import {Router} from "@angular/router";
import {Location} from "@angular/common";
import {SelectItem} from "primeng/api";
import {FormBuilder} from "@angular/forms";
import {DadoComboDTO} from "../../../shared/models/dto/dado-combo";
import {BaseComponent} from "../../../shared/components/base.component";
import {ComboService} from "../../../shared/services/comum/combo.service";
import {MessageService} from "../../../shared/components/messages/message.service";

@Component({
    selector: 'asc-parametrizacao-documento-processo-home',
    templateUrl: './parametrizacao-documento-processo-home.component.html',
    styleUrls: ['./parametrizacao-documento-processo-home.component.scss']
})
export class ParametrizacaoDocumentoProcessoHomeComponent extends BaseComponent implements OnInit {

    sexos: SelectItem[];
    listComboEtadoCivil: DadoComboDTO[];
    listComboMotivoDeSolicitacao: DadoComboDTO[];
    listComboTipoProcesso: DadoComboDTO[];
    listComboTipoDocumento: DadoComboDTO[];
    listComboTipoBeneficiario: DadoComboDTO[];

    formulario:any = this.formBuilder.group({
        sexo: [null],
        documentos: [null],
        obrigatorio: [null],
        estadoCivil: [null],
        somenteAtivos: [null],
        tiposProcesso: [null],
        tiposBeneficiario: [null],
        motivosDeSolicitacao: [null]
    });

    public inicializarCombos(): void {
        this.comboService.consultarComboTipoBeneficiario().pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(res => this.listComboTipoBeneficiario = res, err => this.showDangerMsg(err.error));

        this.comboService.consultarComboTipoProcesso().pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(res => this.listComboTipoProcesso = res, err => this.showDangerMsg(err.error));

        this.comboService.consultarComboDocumento().pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(res => this.listComboTipoDocumento = res, err => this.showDangerMsg(err.error));

        this.comboService.consultarComboEstadoCivil().pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(res => this.listComboEtadoCivil = res, err => this.showDangerMsg(err.error));
        
        this.comboService.consultarComboFinalidade().pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(res => this.listComboMotivoDeSolicitacao = res, err => this.showDangerMsg(err.error));
    }

    constructor(
        private readonly router: Router,
        private readonly location: Location,
        override readonly messageService: MessageService,
        private readonly formBuilder: FormBuilder,
        private readonly comboService: ComboService
    ) {
        super(messageService);
    }

    ngOnInit() {
        this.getSexo();
        this.inicializarCombos();
    }

    public novoPrazo(): void {
        this.router.navigateByUrl('/manutencao/parametros/documento-pedido/novo');
    }

    public getSexo(): void {
        this.sexos = [{
            value: 'M',
            label: "Masculino"
        }, {
            value: 'F',
            label: "Feminino"
        }];
    }

    public pesquisar(): void {
        const sexo = this.formulario.get('sexo').value ? this.formulario.get('sexo').value.map(v => v.value) : null;
        const documentos = this.formulario.get('documentos').value ? this.formulario.get('documentos').value.map(v => v.value) : null;
        const estadoCivil = this.formulario.get('estadoCivil').value ? this.formulario.get('estadoCivil').value.map(v => v.value) : null;
        const tiposProcesso = this.formulario.get('tiposProcesso').value ? this.formulario.get('tiposProcesso').value.map(v => v.value) : null;
        const tiposBeneficiario = this.formulario.get('tiposBeneficiario').value ? this.formulario.get('tiposBeneficiario').value.map(v => v.value) : null;
        const motivosDeSolicitacao = this.formulario.get('motivosDeSolicitacao').value ? this.formulario.get('motivosDeSolicitacao').value.map(v => v.value) : null;
        const descricaoSexo = this.formulario.get('sexo').value ? this.formulario.get('sexo').value.map(v => v.label).join(', ') : null;
        const descricaoDocumentos = this.formulario.get('documentos').value ? this.formulario.get('documentos').value.map(v => v.label).join(', ') : null;
        const descricaoEstadoCivil = this.formulario.get('estadoCivil').value ? this.formulario.get('estadoCivil').value.map(v => v.label).join(', ') : null;
        const descricaoTiposProcesso = this.formulario.get('tiposProcesso').value ? this.formulario.get('tiposProcesso').value.map(v => v.label).join(', ') : null;
        const descricaoTiposBeneficiario = this.formulario.get('tiposBeneficiario').value ? this.formulario.get('tiposBeneficiario').value.map(v => v.label).join(', ') : null;
        const descricaoMotivosDeSolicitacao = this.formulario.get('motivosDeSolicitacao').value ? this.formulario.get('motivosDeSolicitacao').value.map(v => v.label).join(', ') : null;
        this.router.navigate(['/manutencao/parametros/documento-pedido/buscar'], {
            queryParams: {
                sexo,
                documentos,
                estadoCivil,
                tiposProcesso,
                tiposBeneficiario,
                motivosDeSolicitacao,
                descricaoSexo,
                descricaoDocumentos,
                descricaoEstadoCivil,
                descricaoTiposProcesso,
                descricaoTiposBeneficiario,
                descricaoMotivosDeSolicitacao,
                obrigatorio: this.formulario.get('obrigatorio').value,
                somenteAtivos: this.formulario.get('somenteAtivos').value
            }
        }).then();
    }

    public limparCampos(): void {
        this.formulario.reset();
        this.formulario.markAsPristine();
        this.formulario.markAsUntouched();
        this.formulario.updateValueAndValidity();
    }

    public voltar(): void {
        this.location.back();
    }

}
