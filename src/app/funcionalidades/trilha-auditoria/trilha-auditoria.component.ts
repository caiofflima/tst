import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BaseComponent} from 'app/shared/components/base.component';
import {MessageService} from 'app/shared/components/messages/message.service';
import {TipoProcessoService} from 'app/shared/services/comum/tipo-processo.service';
import {TrilhaAuditoriaService} from 'app/shared/services/comum/trilha-auditoria.service';
import {ComboService} from 'app/shared/services/comum/combo.service';
import {ModuloTrilhaDTO} from 'app/shared/models/dtos';
import {Location} from "@angular/common";
import * as constantes from "app/shared/constantes";

@Component({
    selector: 'app-trilha-auditoria',
    templateUrl: './trilha-auditoria.component.html',
    styleUrls: ['./trilha-auditoria.component.scss']
})
export class TrilhaAuditoriaComponent extends BaseComponent implements OnInit {
    showDadosConsulta: boolean;
    selectedModulo: ModuloTrilhaDTO;
    itensSituacaoProcesso: any[];
    modulos = TrilhaAuditoriaService.modulos;
    funcionalidades: any[];
    tabelas: any[];
    form: FormGroup;
    itensTipoProcesso: any[];
    dadosConsulta: any[];

    constructor(
        override readonly messageService: MessageService,
        private readonly fb: FormBuilder,
        private readonly trilhaAuditoriaService: TrilhaAuditoriaService,
        private readonly router: Router,
        private readonly location: Location,
        private readonly comboService: ComboService,
        private readonly tipoProcessoService: TipoProcessoService,
        private readonly route: ActivatedRoute) {
        super(messageService);
        this.tabelas = [];
        this.funcionalidades = [];
    }

    ngOnInit(): void {
        let strModulo = '';
        this.showDadosConsulta = false;
        this.route.params.subscribe(
            (params: any) => {
                strModulo = params['modulo'];
                this.initForm(this.fb);
                this.initValueChanges();
                this.carregarFuncionalidades(strModulo);
            }
        );
    }

    private verificarCarregarSituacoesProcesso(): void {
        if (this.moduloEmail) {
            this.comboService.consultarComboSituacaoProcesso().subscribe(next => {
                this.itensSituacaoProcesso = this.constantes.genSelectItens(next, i => i['label'], i => i['value']);
            });
            this.tipoProcessoService.consultarTodos().subscribe(next => {
                this.itensTipoProcesso = this.constantes.genSelectItens(next, i => i['nome'], i => i['id']);
            });
        }
    }

    private initForm(fb: FormBuilder): void {
        this.form = fb.group({
            'modulo': fb.control('', Validators.required),
            'subModulo': fb.control('', Validators.required),
            'idEmail': fb.control(''),
            'numeroProcesso': fb.control(''),
            'idSituacaoProcesso': fb.control(''),
            'idTipoProcesso': fb.control(''),
            'idUsuario': fb.control(''),
            'idEmpresa': fb.control(''),
            'cpfUsuario': fb.control(''),
            'cnpj': fb.control('')
        });
    }

    private initValueChanges(): void {
        this.modulo.valueChanges.subscribe(next => {
            this.dadosConsulta = [];
            this.carregarTabelasFuncionalidade(next);
            this.showDadosConsulta = false;
        });
        this.subModulo.valueChanges.subscribe(() => {
            this.dadosConsulta = [];
            this.configurarCamposObrigatorios();
            this.showDadosConsulta = false;
        });
    }

    private limparValidators(): void {
        this.numeroProcesso.setValidators(null);
        this.idEmail.setValidators(null);
        this.situacaoProcesso.setValidators(null);
        this.tipoProcesso.setValidators(null);
        this.idEmpresa.setValidators(null);
        this.idUsuario.setValidators(null);
        this.cpfUsuario.setValidators(null);
        this.cnpj.setValidators(null);
    }

    private configurarCamposObrigatorios(): void {
        this.configurarCamposObrigatoriosAutorizacaoPrevia();
        this.configurarCamposObrigatoriosPrestadorExterno();
        this.configurarCamposObrigatoriosEmail();
        this.configurarCamposObrigatoriosUsuarioPrestadorExterno();
        this.updateValueAndValidityControls();
    }

    private configurarCamposObrigatoriosPrestadorExterno(): void {
        if (this.moduloPrestadorExterno) {
            this.limparValidators();
        }
    }

    private configurarCamposObrigatoriosAutorizacaoPrevia(): void {
        if (this.moduloAutorizacaoPrevia) {
            this.limparValidators();
            this.numeroProcesso.setValidators(Validators.required);
            this.situacaoProcesso.reset();
            this.tipoProcesso.reset();
            this.idEmail.reset();
        }
    }

    private configurarCamposObrigatoriosEmail(): void {
        if (this.moduloEmail) {
            this.limparValidators();
            this.limparFiltros();
            if (this.moduloEmails) {
                this.situacaoProcesso.setValidators(Validators.required);
                this.tipoProcesso.setValidators(Validators.required);
            } else if (this.moduloTiposDestinatarioEmail) {
                this.idEmail.setValidators(Validators.required);
            }
        }
    }

    private configurarCamposObrigatoriosUsuarioPrestadorExterno(): void {
        if (this.moduloUsuarioPrestadorExterno) {
            this.limparFiltros();
            this.limparValidators();
        }
    }

    private updateValueAndValidityControls(): void {
        this.numeroProcesso.updateValueAndValidity();
        this.idEmail.updateValueAndValidity();
        this.situacaoProcesso.updateValueAndValidity();
        this.tipoProcesso.updateValueAndValidity();
        this.idUsuario.updateValueAndValidity();
        this.idEmpresa.updateValueAndValidity();
        this.cpfUsuario.updateValueAndValidity();
        this.cnpj.updateValueAndValidity();
    }

    get modulo(): AbstractControl {
        return this.form.get('modulo');
    }

    get subModulo(): AbstractControl {
        return this.form.get('subModulo');
    }

    get numeroProcesso(): AbstractControl {
        return this.form.get('numeroProcesso');
    }

    get situacaoProcesso(): AbstractControl {
        return this.form.get('idSituacaoProcesso');
    }

    get tipoProcesso(): AbstractControl {
        return this.form.get('idTipoProcesso');
    }

    get idEmail(): AbstractControl {
        return this.form.get('idEmail');
    }

    get idUsuario(): AbstractControl {
        return this.form.get('idUsuario');
    }

    get idEmpresa(): AbstractControl {
        return this.form.get('idEmpresa');
    }

    get cpfUsuario(): AbstractControl {
        return this.form.get('cpfUsuario');
    }

    get cnpj(): AbstractControl {
        return this.form.get('cnpj');
    }

    get showSubModulos(): boolean {
        return this.tabelas && this.tabelas.length > 0;
    }

    private carregarTabelasFuncionalidade(fncnldde: ModuloTrilhaDTO) {
        this.tabelas = [];
        if (fncnldde && fncnldde.subModulos && fncnldde.subModulos.length > 0) {
            this.tabelas = this.constantes.genSelectItens(fncnldde.subModulos, i => i.nome, i => i);
        } else {
            this.subModulo.reset();
        }
    }

    private carregarFuncionalidades(strModulo: string): void {
        this.limparCampos();
        this.trilhaAuditoriaService.carregarModulos().subscribe(next => {
            this.funcionalidades = [];
            for (let f of next) {
                this.funcionalidades.push({label: f.nome, value: f});
                if (strModulo == f.moduloTrilha) {
                    this.selectedModulo = f;
                    this.modulo.setValue(f);
                    this.modulo.disable();
                    this.verificarCarregarSituacoesProcesso();
                }
            }
        }, error => this.messageService.addMsgDanger(error));
    }

    public pesquisar(): void {
        let parametrosOk = this.verificarParametrosConsulta();
        if (parametrosOk) {
            this.trilhaAuditoriaService.consultarTrilhaPorParametros(this.form.getRawValue()).subscribe(next => {
                this.dadosConsulta = next;
                this.showDadosConsulta = true;
            }, error => this.messageService.addMsgDanger(error));
        } else {
            this.validateAllFormFields(this.form);
        }
    }

    private verificarParametrosConsulta(): boolean {
        let parametrosOk = true;

        if (this.moduloPrestadorExterno) {
            if (this.moduloVinculosEmpresaPrestador) {
                parametrosOk = this.handleIsModuloVinculosEmpresaPrestador()
            } else if (this.moduloUsuarioPrestadorExterno) {
                if (this.constantes.isUndefinedNullOrEmpty(this.idUsuario.value)
                    && this.constantes.isUndefinedNullOrEmpty(this.cpfUsuario.value)) {
                    this.showDangerMsg('MA114');
                    parametrosOk = false;
                }else if(!this.constantes.isUndefinedNullOrEmpty(this.cpfUsuario.value) 
                    && !this.validaCpfCnpj(this.cpfUsuario.value)){
                    this.showDangerMsg('MA009', 'CPF');
                    parametrosOk = false;
                }
            }
        } else {
            parametrosOk = this.form.valid;
        }
        return parametrosOk;
    }

    handleIsModuloVinculosEmpresaPrestador():boolean{
        let resultado = true
        if (this.constantes.isUndefinedNullOrEmpty(this.idUsuario.value)
        && this.constantes.isUndefinedNullOrEmpty(this.idEmpresa.value)
        && this.constantes.isUndefinedNullOrEmpty(this.cpfUsuario.value)
        && this.constantes.isUndefinedNullOrEmpty(this.cnpj.value)) {
        this.showDangerMsg('MA114');
        resultado = false;
        return resultado
    }else {
        if(!this.constantes.isUndefinedNullOrEmpty(this.cpfUsuario.value) && !this.validaCpfCnpj(this.cpfUsuario.value)){
            this.showDangerMsg('MA009', 'CPF');
            resultado = false;
        }else if(!this.constantes.isUndefinedNullOrEmpty(this.cnpj.value) && !this.validaCpfCnpj(this.cnpj.value)){
            this.showDangerMsg('MA009', 'CNPJ');
            resultado = false;
        }

        return resultado
    }
    }

    public validaCpfCnpj(cpfCnpj): boolean{
        let campo = this.cpfCnpjUtil.limparFormatacao(cpfCnpj);
        return this.cpfCnpjUtil.isValido(campo);
    }

    public limparCampos(): void {
        if (this.form) {
            this.subModulo.reset();
            this.limparFiltros();
        }
    }

    private limparFiltros(): void {
        this.numeroProcesso.reset();
        this.situacaoProcesso.reset();
        this.tipoProcesso.reset();
        this.idEmail.reset();
        this.idEmpresa.reset();
        this.idUsuario.reset();
        this.cpfUsuario.reset();
        this.cnpj.reset();
    }

    // verifica módulos E-mail

    get moduloEmail(): boolean {
        return this.moduloEmails || this.moduloTiposDestinatarioEmail
            || this.isModulo(this.modulos.email);
    }

    get moduloTiposDestinatarioEmail(): boolean {
        return this.isModulo(this.modulos.tiposDestinatarioEmail);
    }

    get moduloEmails(): boolean {
        return this.isModulo(this.modulos.emails);
    }

    //verifica módulos Autorização Prévia

    get moduloAutorizacaoPrevia(): boolean {
        return this.moduloDadosGerais || this.moduloAnexosDocumentos || this.moduloDocumentos
            || this.moduloMensagens || this.moduloOcorrencias || this.moduloProcedimentos
            || this.moduloValidacoesDocumentos || this.moduloAutorizacoesProcedimentos
            || this.isModulo(this.modulos.autorizacaoPrevia);
    }

    get moduloAnexosDocumentos(): boolean {
        return this.isModulo(this.modulos.anexosDocumentos);
    }

    get moduloDadosGerais(): boolean {
        return this.isModulo(this.modulos.dadosGerais);
    }

    get moduloDocumentos(): boolean {
        return this.isModulo(this.modulos.documentos);
    }

    get moduloMensagens(): boolean {
        return this.isModulo(this.modulos.mensagens);
    }

    get moduloOcorrencias(): boolean {
        return this.isModulo(this.modulos.ocorrencias);
    }

    get moduloProcedimentos(): boolean {
        return this.isModulo(this.modulos.procedimentos);
    }

    get moduloAutorizacoesProcedimentos(): boolean {
        return this.isModulo(this.modulos.autorizacoesProcedimentos);
    }

    get moduloValidacoesDocumentos(): boolean {
        return this.isModulo(this.modulos.validacoesDocumentos);
    }

    // verifica módulos Prestadores Externos

    get moduloPrestadorExterno() {
        return this.moduloUsuarioPrestadorExterno || this.moduloEmpresaPrestadorExterno
            || this.moduloVinculosEmpresaPrestador
            || this.isModulo(this.modulos.prestadorExterno);
    }

    get moduloGipesEmpresaPrestadorExterno(): boolean {
        return this.isModulo(this.modulos.gipesCepesEmpresaPrestador);
    }

    get moduloPerfilPrestadorExterno(): boolean {
        return this.isModulo(this.modulos.perfilPrestadorExterno);
    }

    get moduloEmpresaPrestadorExterno(): boolean {
        return this.isModulo(this.modulos.empresaPrestadorExterno);
    }

    get moduloUsuarioPrestadorExterno(): boolean {
        return this.isModulo(this.modulos.usuarioPrestadorExterno);
    }

    get moduloVinculosEmpresaPrestador(): boolean {
        return this.isModulo(this.modulos.vinculosEmpresaPrestador);
    }


    private isModulo(toCheck: string): boolean {
        let selected = undefined;
        if (this.selectedModulo) {
            if (this.subModulo.value) {
                selected = this.subModulo.value.moduloTrilha;
            } else {
                selected = this.selectedModulo.moduloTrilha;
            }
        }
        return toCheck == selected;
    }

    get cpfCnpjUtil(): any {
        return this.constantes.cpfCnpjUtil;
    }

    override get constantes(): any {
        return constantes;
    }

    get cnpjUtil(): any {
        return this.constantes.cnpjUtil;
    }

    public get cpfUtil(): any {
        return this.constantes.cpfUtil;
    }

    public checkCPFCNPJ(cmpnt, tamanho: number): void {
        this.constantes.control.somenteNumeros(cmpnt);
        this.constantes.control.limitarTamanho(cmpnt, tamanho);
    }

    voltar(): void {
        this.location.back();
    }
}
