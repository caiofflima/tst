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
import {Data} from "../../../shared/providers/data";

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
        private readonly comboService: ComboService,
        private readonly data: Data
    ) {
        super(messageService);
    }

    ngOnInit() {
        this.carregarCombos();
        this.preencherCamposSelecionados();
        this.limparStorage();
    }

    private preencherCamposSelecionados(): void {
        if (this.isStorageCarregado()) {
            const filtro = this.data.storage.dadosArmazenados;
            setTimeout(() => {
                this.formulario.patchValue({
                    somenteAtivos: filtro.somenteAtivos,
                    palavraChave: filtro.palavraChave
                });
            }, 50);

            this.preencherCamposSelecionadosPorCampo(filtro, "situacoesProcesso");

            this.preencherCamposSelecionadosPorCampo(filtro, "tiposProcesso");

            if(filtro.tiposProcesso){
                this.carregarComboTipoBeneficiarioPorTipoProcesso(filtro.tiposProcesso);
                this.preencherCamposSelecionadosPorCampo(filtro, "tiposBeneficiario");
            }
        }
    }

    private preencherCamposSelecionadosPorCampo(filtro:any, nomeCampo:any):void{
        const lista = filtro[nomeCampo];
        if(!lista){
            return;
        }
        const valores = lista.map(v => typeof v === 'object' ? v.value : v);

        setTimeout(() => {  this.formulario.get(nomeCampo)?.setValue(valores);}, 200);
    }

    private carregarCombos(){
        this.carregarComboSituacaoProcesso();
        this.carregarComboTipoProcesso();
    }

    private carregarComboSituacaoProcesso(){
        this.comboService.consultarComboSituacaoProcesso().pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(res => {
            this.listComboSituacaoProcesso = res;
            this.listComboSituacaoProcesso.push(this.tipoOcorrencia);
        }, err => this.showDangerMsg(err.error));
    }

    private carregarComboTipoProcesso(){
        this.comboService.consultarComboTipoProcesso().pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(res => { 
            this.listComboTipoProcesso = res
        }, err => this.showDangerMsg(err.error) );
    }

    private isStorageCarregado(): boolean {
        return ((this.data.storage && this.data.storage.dadosArmazenados));
    }

    onChangeTipoProcesso(): void {
        let tiposProcesso: DadoComboDTO[] = this.formulario.controls.tiposProcesso.value;
        this.listComboTipoBeneficiario = [];

        let listaTiposProcesso:number[] = tiposProcesso.map(x => Number(x));
        this.carregarComboTipoBeneficiarioPorTipoProcesso(listaTiposProcesso);
    }

    carregarComboTipoBeneficiarioPorTipoProcesso(listaTiposProcesso:any):void{
        if (listaTiposProcesso && listaTiposProcesso.length > 0) {
            this.comboService.consultarComboTipoBeneficiarioPorTipoProcesso(listaTiposProcesso).pipe(
                take<DadoComboDTO[]>(1)
            ).subscribe(res => this.listComboTipoBeneficiario = res, err => this.showDangerMsg(err.error));
        }
    }

    pesquisarEmails() {
        this.limparStorage();
        let dadosArmazenados = this.prepararDados();
        this.salvarStorage(dadosArmazenados);
        this.router.navigate(['/manutencao/parametros/email/buscar'], {
            queryParams: { ...dadosArmazenados }
        });
    }

    private prepararDados():any{
        const situacoesProcesso = this.getListaFormulario(this.formulario.get('situacoesProcesso').value, this.listComboSituacaoProcesso, true, false);
        const tiposProcesso = this.getListaFormulario(this.formulario.get('tiposProcesso').value, this.listComboTipoProcesso, true, false);
        const tiposBeneficiario = this.getListaFormulario(this.formulario.get('tiposBeneficiario').value , this.listComboTipoBeneficiario, true, false);

        const descricaoSituacoes = this.getListaFormulario(this.formulario.get('situacoesProcesso').value , this.listComboSituacaoProcesso, false, true);
        const descricaoTiposProcesso = this.getListaFormulario(this.formulario.get('tiposProcesso').value, this.listComboTipoProcesso, false, true);
        const descricaoTiposBeneficiario = this.getListaFormulario(this.formulario.get('tiposBeneficiario').value , this.listComboTipoBeneficiario, false, true); 

        return {
            situacoesProcesso,
            tiposProcesso,
            tiposBeneficiario,
            descricaoSituacoes,
            descricaoTiposProcesso,
            descricaoTiposBeneficiario,
            palavraChave: this.formulario.get('palavraChave').value,
            somenteAtivos: this.formulario.get('somenteAtivos').value
        }
    }

    private salvarStorage(dadosArmazenados:any):void{
        this.data.storage = { dadosArmazenados };
    }

    private limparStorage(){
        this.data.storage = {};
    }

    private getListaFormulario(formulario:any, combo: DadoComboDTO[], value:boolean, label:boolean):any{
        let retorno;
        if(formulario && formulario.length>0 && combo){
            const listaSelecionada = new Set(formulario.map(x=>Number(x)));
            retorno = combo.filter( item =>{ 
                return listaSelecionada.has(item?.value)
            });
            if(label){
                retorno = retorno.map(v => v.label); 
            }else if(value){
                retorno = retorno.map(v => v.value);
            }
        }else{
            retorno = null;
        };

        return retorno;
    }

    voltar(): void {
        this.location.back();
    }

    
    limparCampos() {
        this.limparStorage();
        this.formulario.reset();
    }

}
