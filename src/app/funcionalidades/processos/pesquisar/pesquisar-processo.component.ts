import { MotivoSolicitacao } from './../../../shared/models/comum/motivo-solicitacao';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AbstractControl, FormBuilder, FormGroup} from '@angular/forms';
import {debounceTime, take} from "rxjs/operators";
import {Location} from "@angular/common";
import {SessaoService} from "../../../arquitetura/shared/services/seguranca/sessao.service";

import * as constantes from 'app/shared/constantes';
import {Pageable} from 'app/shared/components/pageable.model';
import {Data} from 'app/shared/providers/data';
import {ProcessoDTO} from "../../../shared/models/dto/processo";
import {DadoComboDTO} from 'app/shared/models/dto/dado-combo';
import {ComboService} from 'app/shared/services/comum/combo.service';
import {ProcessoService} from 'app/shared/services/comum/processo.service';
import {BaseComponent} from 'app/shared/components/base.component';
import {MessageService} from 'app/shared/components/messages/message.service';
import {FiltroConsultaProcesso} from 'app/shared/models/filtro/filtro-consulta-processo';
import {PerfilEnum} from "app/shared/enums/perfil.enum";

@Component({
    selector: 'asc-pesquisar-processo',
    templateUrl: './pesquisar-processo.component.html',
    styleUrls: ['./pesquisar-processo.component.scss'],
    providers: [ComboService]
})
export class PesquisarProcessoComponent extends BaseComponent implements OnInit {

    formulario: FormGroup;
    filtro: FiltroConsultaProcesso;

    listComboTipoProcesso: DadoComboDTO[];
    listComboSituacaoProcesso: DadoComboDTO[];
    listComboCondicaoProcesso: DadoComboDTO[];
    listComboTipoBeneficiario: DadoComboDTO[];
    listComboCaraterSolicitacao: DadoComboDTO[];
    listComboUF: DadoComboDTO[];
    listComboMunicipio: DadoComboDTO[];
    listComboFilial: DadoComboDTO[];
    listaMotivoSolicitacao: DadoComboDTO[]=[];	
    listaGrupoTiposPedido: DadoComboDTO[]=[];

    total: number = 0;
    rows: number = 10;
    carregandoConsulta = false;

    ufsProcessoSelected: DadoComboDTO[];
    filiaisProcessoSelected: DadoComboDTO[];
    tiposProcessoSelected: DadoComboDTO[];
    municipioAtendimentoSelected: DadoComboDTO[];
    situacoesProcessoSelected: DadoComboDTO[];
    tiposBeneficiarioSelected: DadoComboDTO[];
    motivosSolicitacaoSelected: DadoComboDTO[];
    tiposPedidoSelected: DadoComboDTO[];
    
    dadosConsulta = null;

    constructor(
        override readonly messageService: MessageService,
        private readonly location: Location,
        private readonly router: Router,
        private readonly formBuilder: FormBuilder,
        private readonly processoService: ProcessoService,
        private readonly comboService: ComboService,
        private readonly data: Data,
        public readonly sessaoService: SessaoService,
        private readonly route: ActivatedRoute,
        readonly changeDetectorRef:ChangeDetectorRef
    ) {
        super(messageService);
        if (this.data.storage && this.data.storage.filtro) {
            this.filtro = this.data.storage.filtro;
        } else {
            this.filtro = new FiltroConsultaProcesso();
        }

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
            'matriculaUltimoUsuario': [this.filtro.matriculaUltimoUsuario],
            'dataAberturaInicio' : [this.filtro.dataAberturaInicio],
            'dataAberturaFim' : [this.filtro.dataAberturaFim],
            'autorizacaoPreviaGstao': [this.filtro.autorizacaoPreviaGstao],
            'autorizacaoReembolso': [this.filtro.autorizacaoReembolso],
            'motivosSolicitacao': [this.filtro.motivosSolicitacao],
            'tiposPedido': [this.filtro.tiposPedido]
        });

    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            const matriculaTitular = params['matriculaTitular'];
            if (matriculaTitular) {
                this.carregandoConsulta = true;
                this.iniciarPesquisaComMatricula(matriculaTitular);
                return;
            }
        });

        if (!this.carregandoConsulta) {
            this.preencherCamposDeBusca();
            this.inicializarCombos();

            if (this.formulario.controls['ufAtendimento'] && this.formulario.controls['ufAtendimento'].value) {
                this.onChangeUFAtendimento();
            }

            this.tiposProcesso.valueChanges
                .pipe(debounceTime(300))
                .subscribe(() => this.atualizarComboTiposBeneficiarios());
        }
    }

    private iniciarPesquisaComMatricula(matriculaTitular: string) {
        this.formulario.reset();
        this.formulario.get('matriculaTitular').setValue(matriculaTitular);

        this.processoService.consultarComBeneficiario(this.formulario.value).pipe(
            take<Pageable<ProcessoDTO>>(1)
        ).subscribe(async pageable => {
            this.carregandoConsulta = false;

            if (pageable.total === 0) {
                this.showDangerMsg(this.bundle("MA003"));
            } else {
                this.data.storage = {
                    pageable: pageable,
                    filtro: this.formulario.value
                };
                await this.router.navigateByUrl('/pedidos/pesquisar/lista');
            }
        }, err => {
            this.carregandoConsulta = false;
            this.showDangerMsg(err.error);
        });
    }

    ngAfterViewChecked(): void {
        this.changeDetectorRef.detectChanges();
    }

    preencherCamposDeBusca(){
        if (this.data.storage && this.data.storage.pageable) {
            this.dadosConsulta = this.data.storage;

            if(this.dadosConsulta.idPedido != null && this.dadosConsulta.idPedido !== undefined 
                && this.dadosConsulta.idPedido.length>0){
                this.formulario.get('idPedido').setValue(this.dadosConsulta.idPedido);
            }

            if(this.dadosConsulta.nomeBeneficiario != null && this.dadosConsulta.nomeBeneficiario !== undefined 
                && this.dadosConsulta.nomeBeneficiario.length>0){
                this.formulario.get('nomeBeneficiario').setValue(this.dadosConsulta.nomeBeneficiario);
            }

            if(this.dadosConsulta.matriculaTitular != null && this.dadosConsulta.matriculaTitular !== undefined 
                && this.dadosConsulta.matriculaTitular.length>0){
                this.formulario.get('matriculaTitular').setValue(this.dadosConsulta.matriculaTitular);
            }

            if(this.dadosConsulta.codigoBeneficiario != null && this.dadosConsulta.codigoBeneficiario !== undefined 
                && this.dadosConsulta.codigoBeneficiario.length>0){
                this.formulario.get('codigoBeneficiario').setValue(this.dadosConsulta.codigoBeneficiario);
            }  
        }
    }

    override get constantes(): any {
        return constantes;
    }

    get idPedido(): AbstractControl {
        return this.formulario.get('idPedido');
    }

    get autorizacaoPreviaGstao(): AbstractControl {
        return this.formulario.get('autorizacaoPreviaGstao');
    }

    get autorizacaoReembolso(): AbstractControl {
        return this.formulario.get('autorizacaoReembolso');
    }

    get tiposProcesso(): AbstractControl {
        return this.formulario.get('tiposProcesso');
    }

    inicializarCombos(): void {

        this.carregarComboUF();

        this.carregarFiliais();

        this.carregarTiposProcesso();
        
        this.carregarSituacoesProcesso();

        this.carregarTipoBeneficiario();

        this.carregarCondicaoProcesso();

        this.carregarCaraterSolicitacao();

        this.carregarComboGrupoPedido();

        this.carregarComboMotivosSolicitacao();

    }

    listarTiposPedidoSelecionados():number[]{
        let lista:number[] = [];
        if(this.formulario.controls['tiposProcesso'] && this.formulario.controls['tiposProcesso'].value)
        {
            return this.formulario.controls['tiposProcesso'].value.map(item=>item.value);
        }
        else 
            return lista;
    }

    listarGruposTiposPedidoSelecionados():number[]{
        let lista:number[] = [];
        if(this.formulario.controls['tiposPedido'] && this.formulario.controls['tiposPedido'].value)
        {
            return this.formulario.controls['tiposPedido'].value.map(item=>item.value);
        }
        else 
            return lista;
    }

    carregarComboGrupoPedido(){ 
        let lista:number[] = [];
        //if(this.listarTiposPedidoSelecionados().length > 0){
            //this.comboService.consultarComboGrupoPedidoPorTipoProcesso(this.listarTiposPedidoSelecionados()).pipe(
            this.comboService.consultarComboTipoPedidoPorTipoProcesso(lista).pipe(
                take<DadoComboDTO[]>(1)
            ).subscribe(res => { 
                this.listaGrupoTiposPedido = res;
                this.carregarGrupoPedidoSelected();
            }, err => this.showDangerMsg(err.error));
        //}
    }

    carregarGrupoPedidoSelected(){
        if(this.dadosConsulta !== null && this.dadosConsulta !== undefined 
            && this.dadosConsulta.filtro.tiposPedido !== null 
            && this.dadosConsulta.filtro.tiposPedido !== undefined ){
              this.tiposPedidoSelected = this.dadosConsulta.filtro.tiposPedido;
        }
    }

    carregarComboMotivosSolicitacao(){ 
        //console.log("carregarComboMotivosSolicitacao() this.listarTiposPedidoSelecionados() =============");
        //console.log(this.listarTiposPedidoSelecionados()) 
        if(this.listarTiposPedidoSelecionados().length > 0 || this.listarGruposTiposPedidoSelecionados().length > 0){
            //this.comboService.consultarComboFinalidadePorTipoProcesso(this.listarTiposPedidoSelecionados()).pipe(
            this.comboService.consultarComboTipoPedidoPorTipoProcesso(this.listarTiposPedidoSelecionados()).pipe(
                take<DadoComboDTO[]>(1)
            ).subscribe(res => {
                this.listaMotivoSolicitacao = res;
                //this.carregarMotivosSelected();
            }, err => this.showDangerMsg(err.error));
        }else{
            this.listaMotivoSolicitacao = [];
        }
    }

    carregarMotivosSelected(){
        if(this.dadosConsulta !== null && this.dadosConsulta !== undefined 
            && this.dadosConsulta.filtro.motivosSolicitacao !== null 
            && this.dadosConsulta.filtro.motivosSolicitacao !== undefined ){
              this.motivosSolicitacaoSelected = this.dadosConsulta.filtro.motivosSolicitacao;
        }
    }

    onChangeTipoPedido(): void {
        if(this.hasTipoProcessoGrupo(this.formulario.controls['tiposProcesso'].value)
            || this.hasTipoProcessoGrupo(this.formulario.controls['tiposPedido'].value)){

            this.carregarComboMotivosSolicitacao();
            
        }else{
            this.listaMotivoSolicitacao = [];
        }
    }

    onChangeTipoProcesso(): void {
        if(this.hasTipoProcessoGrupo(this.formulario.controls['tiposProcesso'].value)
            || this.hasTipoProcessoGrupo(this.formulario.controls['tiposPedido'].value)){

            //this.carregarComboGrupoPedido();
            this.carregarComboMotivosSolicitacao();
            
        }else{
            this.listaMotivoSolicitacao = [];
        }
    }

    private hasTipoProcessoGrupo(tipo:any):boolean{
        if(tipo != null && tipo != undefined && tipo.length>0){
            return true;     
        }
        return false;
    }

    carregarComboUF(){
        this.comboService.consultarComboUF().pipe(take(1)).subscribe(res => {
            this.listComboUF = res; 
            this.carregarComboUFSelected();
        }, err => this.showDangerMsg(err.error));
    }

    carregarComboUFSelected(){
        if(this.dadosConsulta !== null && this.dadosConsulta !== undefined 
            && this.dadosConsulta.filtro.ufsProcesso !== null 
            && this.dadosConsulta.filtro.ufsProcesso !== undefined ){
              this.ufsProcessoSelected = this.dadosConsulta.filtro.ufsProcesso;
        }
    }

    carregarFiliais(){
        if(this.isCentralDeAtendimento()){
            let filiais = this.sessaoService.getUsuario().dadosPrestadorExterno.idsFiliais;
            this.comboService.consultarComboFilial().pipe(take(1)).subscribe(res => {
                this.listComboFilial = res.filter(el=>filiais.includes(el.value));
                this.carregarFiliaisSelected();
            }, err => this.showDangerMsg(err.error));
        }else{
            this.comboService.consultarComboFilial().pipe(take(1)).subscribe(res => {
                this.listComboFilial = res;
                this.carregarFiliaisSelected();
            }, err => this.showDangerMsg(err.error));
        }
    }

    carregarFiliaisSelected(){
        if(this.dadosConsulta !== null && this.dadosConsulta !== undefined 
            && this.dadosConsulta.filtro.filiaisProcesso !== null 
            && this.dadosConsulta.filtro.filiaisProcesso !== undefined ){
              this.filiaisProcessoSelected = this.dadosConsulta.filtro.filiaisProcesso;
        }
    }

    carregarTiposProcesso(){
        this.comboService.consultarComboTipoProcesso().pipe(take(1)).subscribe(res => {
            this.listComboTipoProcesso = res;
            this.carregarTiposProcessoSelected();
        }, err => this.showDangerMsg(err.error));
    }

    carregarTiposProcessoSelected(){
        if(this.dadosConsulta !== null && this.dadosConsulta !== undefined 
            && this.dadosConsulta.filtro.tiposProcesso !== null 
            && this.dadosConsulta.filtro.tiposProcesso !== undefined ){
              this.tiposProcessoSelected = this.dadosConsulta.filtro.tiposProcesso;
              this.onChangeTipoProcesso();
              this.carregarMotivosSelected();
              this.carregarGrupoPedidoSelected();
        }
    }

    carregarSituacoesProcesso(){
        this.comboService.consultarComboSituacaoProcesso().pipe(take(1)).subscribe(res => {
            this.listComboSituacaoProcesso = res;
            this.carregarSituacoesProcessoSelected();
        }, err => this.showDangerMsg(err.error));
    }

    carregarSituacoesProcessoSelected(){
        if(this.dadosConsulta !== null && this.dadosConsulta !== undefined 
            && this.dadosConsulta.filtro.situacoesProcesso !== null 
            && this.dadosConsulta.filtro.situacoesProcesso !== undefined ){
              this.situacoesProcessoSelected = this.dadosConsulta.filtro.situacoesProcesso;
        }
    }

    carregarTipoBeneficiario(){
        this.comboService.consultarComboTipoBeneficiario().pipe(take(1)).subscribe(res => {
            this.listComboTipoBeneficiario = res;
            this.carregarTipoBeneficiarioSelected();
        }, err => this.showDangerMsg(err.error));
    }

    carregarTipoBeneficiarioSelected(){
        if(this.dadosConsulta !== null && this.dadosConsulta !== undefined 
            && this.dadosConsulta.filtro.tiposBeneficiario !== null 
            && this.dadosConsulta.filtro.tiposBeneficiario !== undefined ){
              this.tiposBeneficiarioSelected = this.dadosConsulta.filtro.tiposBeneficiario;
        }
    }

    carregarCondicaoProcesso(){
        this.comboService.consultarComboCondicaoProcesso().pipe(take(1)).subscribe(res => {
            this.listComboCondicaoProcesso = res;
        }, err => this.showDangerMsg(err.error));
    }

    carregarCaraterSolicitacao(){
        this.comboService.consultarComboCaraterSolicitacao().pipe(take(1)).subscribe(res => {
            this.listComboCaraterSolicitacao = res;
        }, err => this.showDangerMsg(err.error));
    }

    limparCampos() {
        this.listaMotivoSolicitacao = null;
        this.formulario.reset();
    }

    onChangeUFAtendimento(): void {
        let ufAtendimento: DadoComboDTO = this.formulario.controls['ufAtendimento'].value;

        if (ufAtendimento && ufAtendimento.value && ufAtendimento.value > 0) {
            this.formulario.controls['municipioAtendimento'].setValue(null);
            this.comboService.consultarDadosComboMunicipioPorUF(ufAtendimento.value).pipe(take(1)).subscribe(res => {
                this.listComboMunicipio = res;
                if (this.formulario.controls['ufAtendimento'] && this.formulario.controls['ufAtendimento'].value) {
                    this.listComboMunicipio.forEach(m => {
                        if (m.value == this.filtro.municipioAtendimento.value) {
                            this.formulario.controls['municipioAtendimento'].setValue(m);
                        }
                    });
                }
            }, err => this.showDangerMsg(err.error));
        }
    }

    consultarProcesso() {
        this.carregandoConsulta = true;
        let dataInicio = this.formulario.get('dataAberturaInicio').value
        let dataFim = this.formulario.get('dataAberturaFim').value
        if(dataInicio > dataFim){
            this.messageService.addMsgDanger("Data de Início Maior que a Data  Final");
            this.carregandoConsulta = false;
        }else{
            if (this.formulario.value) {
                if (!this.isFormularioAoMenosUmItemPreenchido(this.formulario)) {
                    this.carregandoConsulta = false;
                    this.showDangerMsg(this.bundle("MA016"));
                } else { 
                    this.processoService.consultarComBeneficiario(this.formulario.value).pipe(
                        take<Pageable<ProcessoDTO>>(1)
                    ).subscribe(async pageable => {
                        this.carregandoConsulta = false;
    
                        if (pageable.total == 0) {
                            this.showDangerMsg(this.bundle("MA003"));
                        } else {
                            this.data.storage = {
                                pageable: pageable,
                                filtro: this.formulario.value
                            };
    
                            await this.router.navigateByUrl('/pedidos/pesquisar/lista');
                        }
                    }, err => {
                        this.carregandoConsulta = false;
                        this.showDangerMsg(err.error);
                    });
                }
            }
        }

    }

    atualizarComboTiposBeneficiarios(): void {
        this.listComboTipoBeneficiario = [];
        if ((this.tiposProcesso) && (this.tiposProcesso.value)) {
            this.comboService.consultarComboTipoBeneficiarioPorTipoProcesso(this.tiposProcesso.value.map(x => x.value)).pipe(
                take<DadoComboDTO[]>(1)
            ).subscribe(res => this.listComboTipoBeneficiario = res, error => this.messageService.showDangerMsg(error.error));
        }
    }

    voltar(): void {
        this.location.back();
    }

    isCentralDeAtendimento(): boolean{
        if(this.sessaoService.getUsuario().hasPerfil(PerfilEnum.CENTRAL_ATENDIMENTO)){
            return true;
        }
        return false;
    }
}
