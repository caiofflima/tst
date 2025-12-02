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
import {Data} from "../../../shared/providers/data";

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
        private readonly comboService: ComboService,
        private readonly data: Data
    ) {
        super(messageService);

        if (this.isStorageCarregado()) {
            const filtro = this.data.storage.filtroDocumentoProcesso;
            this.formulario = this.formBuilder.group({
                sexo: [filtro.sexo],
                documentos: [filtro.documentos],
                obrigatorio: [filtro.obrigatorio],
                estadoCivil: [filtro.estadoCivil],
                somenteAtivos: [filtro.somenteAtivos],
                tiposProcesso: [filtro.tiposProcesso],
                tiposBeneficiario: [filtro.tiposBeneficiario],
                motivosDeSolicitacao: [filtro.motivosDeSolicitacao]
            });
        }
    }

    private isStorageCarregado(): boolean {
        return ((this.data.storage) && (this.data.storage.filtroDocumentoProcesso));
    }

    ngOnInit() {
        this.getSexo();
        this.inicializarCombos();
        this.preencherCamposSelecionados();
    }

    private preencherCamposSelecionados(): void {
        if (this.isStorageCarregado()) {
            const filtro = this.data.storage.filtroDocumentoProcesso;
            setTimeout(() => {
                this.formulario.patchValue({
                    obrigatorio: filtro.obrigatorio,
                    somenteAtivos: filtro.somenteAtivos
                });
            }, 50);

            if (filtro.sexo) {
                setTimeout(() => {
                    this.formulario.get('sexo').setValue(filtro.sexo);
                }, 100);
            }

            if (filtro.documentos) {
                setTimeout(() => {
                    this.formulario.get('documentos').setValue(filtro.documentos);
                }, 100);
            }

            if (filtro.estadoCivil) {
                setTimeout(() => {
                    this.formulario.get('estadoCivil').setValue(filtro.estadoCivil);
                }, 100);
            }

            if (filtro.tiposProcesso) {
                setTimeout(() => {
                    this.formulario.get('tiposProcesso').setValue(filtro.tiposProcesso);
                }, 100);
            }

            if (filtro.tiposBeneficiario) {
                setTimeout(() => {
                    this.formulario.get('tiposBeneficiario').setValue(filtro.tiposBeneficiario);
                }, 100);
            }

            if (filtro.motivosDeSolicitacao) {
                setTimeout(() => {
                    this.formulario.get('motivosDeSolicitacao').setValue(filtro.motivosDeSolicitacao);
                }, 100);
            }
        }
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
        const sexoValues = this.formulario.get('sexo').value;
        const documentosValues = this.formulario.get('documentos').value;
        const estadoCivilValues = this.formulario.get('estadoCivil').value;
        const tiposProcessoValues = this.formulario.get('tiposProcesso').value;
        const tiposBeneficiarioValues = this.formulario.get('tiposBeneficiario').value;
        const motivosDeSolicitacaoValues = this.formulario.get('motivosDeSolicitacao').value;

        // Criar objetos completos com label e value
        const sexoCompleto = (sexoValues && sexoValues.length > 0) ? sexoValues.map(val => {
            const valStr = typeof val === 'object' ? val.value : val;
            const item = this.sexos.find(s => s.value === valStr);
            return item ? { label: item.label, value: item.value } : { label: '', value: valStr };
        }) : null;

        const documentosCompleto = (documentosValues && documentosValues.length > 0) ? documentosValues.map(val => {
            const numVal = typeof val === 'object' ? val.value : val;
            const item = this.listComboTipoDocumento?.find(d => Number(d.value) === Number(numVal));
            return item ? { label: item.label || item.descricao, value: item.value } : { label: '', value: numVal };
        }) : null;

        const estadoCivilCompleto = (estadoCivilValues && estadoCivilValues.length > 0) ? estadoCivilValues.map(val => {
            const numVal = typeof val === 'object' ? val.value : val;
            const item = this.listComboEtadoCivil?.find(e => Number(e.value) === Number(numVal));
            return item ? { label: item.label || item.descricao, value: item.value } : { label: '', value: numVal };
        }) : null;

        const tiposProcessoCompleto = (tiposProcessoValues && tiposProcessoValues.length > 0) ? tiposProcessoValues.map(val => {
            const numVal = typeof val === 'object' ? val.value : val;
            const item = this.listComboTipoProcesso?.find(t => Number(t.value) === Number(numVal));
            return item ? { label: item.label || item.descricao, value: item.value } : { label: '', value: numVal };
        }) : null;

        const tiposBeneficiarioCompleto = (tiposBeneficiarioValues && tiposBeneficiarioValues.length > 0) ? tiposBeneficiarioValues.map(val => {
            const numVal = typeof val === 'object' ? val.value : val;
            const item = this.listComboTipoBeneficiario?.find(t => Number(t.value) === Number(numVal));
            return item ? { label: item.label || item.descricao, value: item.value } : { label: '', value: numVal };
        }) : null;

        const motivosDeSolicitacaoCompleto = (motivosDeSolicitacaoValues && motivosDeSolicitacaoValues.length > 0) ? motivosDeSolicitacaoValues.map(val => {
            const numVal = typeof val === 'object' ? val.value : val;
            const item = this.listComboMotivoDeSolicitacao?.find(m => Number(m.value) === Number(numVal));
            return item ? { label: item.label || item.descricao, value: item.value } : { label: '', value: numVal };
        }) : null;

        // Extrair apenas os valores para queryParams
        const sexo = sexoCompleto ? sexoCompleto.map(s => s.value).join(',') : null;
        const documentos = documentosCompleto ? documentosCompleto.map(d => d.value).join(',') : null;
        const estadoCivil = estadoCivilCompleto ? estadoCivilCompleto.map(e => e.value).join(',') : null;
        const tiposProcesso = tiposProcessoCompleto ? tiposProcessoCompleto.map(t => t.value).join(',') : null;
        const tiposBeneficiario = tiposBeneficiarioCompleto ? tiposBeneficiarioCompleto.map(t => t.value).join(',') : null;
        const motivosDeSolicitacao = motivosDeSolicitacaoCompleto ? motivosDeSolicitacaoCompleto.map(m => m.value).join(',') : null;

        // Extrair descrições
        const descricaoSexo = sexoCompleto ? sexoCompleto.map(s => s.label).join(', ') : null;
        const descricaoDocumentos = documentosCompleto ? documentosCompleto.map(d => d.label).join(', ') : null;
        const descricaoEstadoCivil = estadoCivilCompleto ? estadoCivilCompleto.map(e => e.label).join(', ') : null;
        const descricaoTiposProcesso = tiposProcessoCompleto ? tiposProcessoCompleto.map(t => t.label).join(', ') : null;
        const descricaoTiposBeneficiario = tiposBeneficiarioCompleto ? tiposBeneficiarioCompleto.map(t => t.label).join(', ') : null;
        const descricaoMotivosDeSolicitacao = motivosDeSolicitacaoCompleto ? motivosDeSolicitacaoCompleto.map(m => m.label).join(', ') : null;

        this.data.storage = {
            filtroDocumentoProcesso: {
                ...this.formulario.value,
                sexo: sexoCompleto,
                documentos: documentosCompleto,
                estadoCivil: estadoCivilCompleto,
                tiposProcesso: tiposProcessoCompleto,
                tiposBeneficiario: tiposBeneficiarioCompleto,
                motivosDeSolicitacao: motivosDeSolicitacaoCompleto
            }
        };

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
                obrigatorio: this.formulario.get('obrigatorio').value !== null ? this.formulario.get('obrigatorio').value : null,
                somenteAtivos: this.formulario.get('somenteAtivos').value !== null ? this.formulario.get('somenteAtivos').value : null
            }
        }).then();
    }

    public limparCampos(): void {
        this.data.storage = null;
        this.formulario.reset();
        this.formulario.markAsPristine();
        this.formulario.markAsUntouched();
        this.formulario.updateValueAndValidity();
    }

    public voltar(): void {
        this.location.back();
    }

}
