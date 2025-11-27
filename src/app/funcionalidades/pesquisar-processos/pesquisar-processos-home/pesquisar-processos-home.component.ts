import {DadoComboDTO} from 'app/shared/models/dto/dado-combo';
import {ComboService} from 'app/shared/services/comum/combo.service';
import {ProcessoService} from 'app/shared/services/comum/processo.service';
import {BaseComponent} from 'app/shared/components/base.component';
import {MessageService} from 'app/shared/components/messages/message.service';

import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AbstractControl, FormBuilder, FormGroup} from '@angular/forms';

import {FiltroConsultaProcesso} from 'app/shared/models/filtro/filtro-consulta-processo';
import {Data} from 'app/shared/providers/data';
import * as constantes from 'app/shared/constantes';
import {Pageable} from "../../../shared/components/pageable.model";
import {ProcessoDTO} from "../../../shared/models/dto/processo";
import {take} from "rxjs/operators";
import {Option} from "sidsc-components/dsc-select";

@Component({
    selector: 'app-pesquisar-processos-home',
    templateUrl: 'pesquisar-processos-home.component.html',
    styleUrls: ['pesquisar-processos-home.component.scss'],
    providers: [ComboService]
})
export class PesquisarProcessosHomeComponent extends BaseComponent implements OnInit {

    formulario: FormGroup;
    filtro: FiltroConsultaProcesso;

    // Combo options for DSC components
    optionsTipoProcesso: Option[] = [];
    optionsSituacaoProcesso: Option[] = [];
    optionsCondicaoProcesso: Option[] = [];
    optionsTipoBeneficiario: Option[] = [];
    optionsCaraterSolicitacao: Option[] = [];
    optionsUF: Option[] = [];
    optionsMunicipio: Option[] = [];
    optionsFilial: Option[] = [];

    // Legacy combo lists (for backward compatibility if needed)
    listComboTipoProcesso: DadoComboDTO[];
    listComboSituacaoProcesso: DadoComboDTO[];
    listComboCondicaoProcesso: DadoComboDTO[];
    listComboTipoBeneficiario: DadoComboDTO[];
    listComboCaraterSolicitacao: DadoComboDTO[];
    listComboUF: DadoComboDTO[];
    listComboMunicipio: DadoComboDTO[];
    listComboFilial: DadoComboDTO[];
    selectedTipoProcesso: string;

    constructor(
        protected override messageService: MessageService,
        private router: Router,
        private formBuilder: FormBuilder,
        private processoService: ProcessoService,
        private comboService: ComboService,
        private data: Data
    ) {
        super(messageService);

        if (this.data.storage && this.data.storage.filtro) {
            this.filtro = this.data.storage.filtro;
        } else {
            this.filtro = new FiltroConsultaProcesso();
        }

        this.inicializarFormulario();
        this.inicializarCombos();

        if (this.formulario.controls['ufAtendimento'] != null && this.formulario.controls['ufAtendimento'].value != null) {
            this.onChangeUFAtendimento();
        }
    }

    override get constantes(): any {
        return constantes;
    }

    get idPedido(): AbstractControl {
        return this.formulario.get('idPedido');
    }

    private inicializarFormulario() {
        this.formulario = this.formBuilder.group({
            'idPedido': [this.filtro.idPedido],
            'tiposProcesso': [this.filtro.tiposProcesso],
            'situacoesProcesso': [this.filtro.situacoesProcesso],
            'condicaoProcesso': [this.filtro.condicaoProcesso],
            'ufsProcesso': [this.filtro.ufsProcesso],
            'filiaisProcesso': [this.filtro.filiaisProcesso],
            'ufAtendimento': [this.filtro.ufAtendimento],
            'municipioAtendimento': [this.filtro.municipioAtendimento],
            'tiposBeneficiario': [this.filtro.tiposBeneficiario],
            'matriculaTitular': [this.filtro.matriculaTitular],
            'codigoBeneficiario': [this.filtro.numeroCartao],
            'nomeBeneficiario': [this.filtro.nomeBeneficiario],
            'caraterSolicitacao': [this.filtro.caraterSolicitacao],
            'matriculaUltimoUsuario': [this.filtro.matriculaUltimoUsuario]
        });
    }

    ngOnInit() {
        this.tiposProcesso.valueChanges.subscribe(() => this.atualizarComboTiposBeneficiarios());
    }

    get tiposProcesso(): AbstractControl {
        return this.formulario.get('tiposProcesso');
    }

    inicializarCombos() {

        this.comboService.consultarComboTipoProcesso().subscribe(res => {
            this.listComboTipoProcesso = res;
            this.optionsTipoProcesso = this.convertToOptions(res);
        }, err => this.showDangerMsg(err.error));

        this.comboService.consultarComboSituacaoProcesso().subscribe(res => {
            this.listComboSituacaoProcesso = res;
            this.optionsSituacaoProcesso = this.convertToOptions(res);
        }, err => this.showDangerMsg(err.error));

        this.comboService.consultarComboCondicaoProcesso().subscribe(res => {
            this.listComboCondicaoProcesso = res;
            this.optionsCondicaoProcesso = this.convertToOptions(res);
        }, err => this.showDangerMsg(err.error));

        this.comboService.consultarComboTipoBeneficiario().subscribe(res => {
            this.listComboTipoBeneficiario = res;
            this.optionsTipoBeneficiario = this.convertToOptions(res);
        }, err => this.showDangerMsg(err.error));

        this.comboService.consultarComboCaraterSolicitacao().subscribe(res => {
            this.listComboCaraterSolicitacao = res;
            this.optionsCaraterSolicitacao = this.convertToOptions(res);
        }, err => this.showDangerMsg(err.error));

        this.comboService.consultarComboUF().subscribe(res => {
            this.listComboUF = res;
            this.optionsUF = this.convertToOptions(res);
        }, err => this.showDangerMsg(err.error));

        this.comboService.consultarComboFilial().subscribe(res => {
            this.listComboFilial = res;
            this.optionsFilial = this.convertToOptions(res);
        }, err => this.showDangerMsg(err.error));
    }

    /**
     * Converts DadoComboDTO array to Option array for DSC components
     */
    private convertToOptions(dados: DadoComboDTO[]): Option[] {
        if (!dados) return [];
        return dados.map(dado => ({
            label: dado.label,
            value: dado.value
        }));
    }

    limparCampos() {
        this.formulario.reset();
    }


    onChangeUFAtendimento() {
        const ufAtendimentoControl = this.formulario.controls['ufAtendimento'];
        const ufAtendimento = ufAtendimentoControl.value;

        // Handle both DadoComboDTO (legacy) and direct value from dsc-select
        const ufValue = ufAtendimento?.value || ufAtendimento;

        if (ufValue && ufValue > 0) {
            this.formulario.controls['municipioAtendimento'].setValue(null);

            this.comboService.consultarDadosComboMunicipioPorUF(ufValue).subscribe(res => {
                this.listComboMunicipio = res;
                this.optionsMunicipio = this.convertToOptions(res);

                // Restore previous value if exists
                if (this.filtro?.municipioAtendimento?.value) {
                    const municipio = res.find(m => m.value === this.filtro.municipioAtendimento.value);
                    if (municipio) {
                        this.formulario.controls['municipioAtendimento'].setValue(municipio.value);
                    }
                }
            }, err => this.showDangerMsg(err.error));
        } else {
            this.optionsMunicipio = [];
            this.listComboMunicipio = [];
        }
    }


    consultarProcesso() {

        if (this.formulario.value) {

            let valor: boolean = this.isFormularioAoMenosUmItemPreenchido(this.formulario);
            if (!valor) {
                this.showDangerMsg(this.bundle("MA016"));
                return;
            }

            this.processoService.consultar(this.formulario.value).pipe(
                take<Pageable<ProcessoDTO>>(1)
            ).subscribe(res => {
                this.data.storage = {
                    pageable: res,
                    filtro: this.formulario.value
                };
                this.router.navigateByUrl('/manutencao/consulta/pedidos/lista');

            }, err => this.showDangerMsg(err.error));
        }
    }

    atualizarComboTiposBeneficiarios(): void {
        this.listComboTipoBeneficiario = [];
        this.optionsTipoBeneficiario = [];
        
        if (this.tiposProcesso?.value) {
            // Handle both array of objects and array of values
            const tiposValues = Array.isArray(this.tiposProcesso.value)
                ? this.tiposProcesso.value.map(x => x?.value || x)
                : [this.tiposProcesso.value?.value || this.tiposProcesso.value];

            this.comboService.consultarComboTipoBeneficiarioPorTipoProcesso(tiposValues).subscribe(res => {
                this.listComboTipoBeneficiario = res;
                this.optionsTipoBeneficiario = this.convertToOptions(res);
            }, error => this.messageService.addMsgDanger(error.error));
        }
    }
}
