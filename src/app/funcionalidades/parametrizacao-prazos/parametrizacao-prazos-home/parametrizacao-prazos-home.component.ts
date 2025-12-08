import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {take} from "rxjs/operators";
import {Location} from "@angular/common";
import {FormBuilder} from "@angular/forms";

import {MessageService} from "../../../shared/components/messages/message.service";
import {BaseComponent} from "../../../shared/components/base.component";
import {ComboService} from "../../../shared/services/comum/combo.service";
import {DadoComboDTO} from "../../../shared/models/dto/dado-combo";
import {Data} from "../../../shared/providers/data";
 
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
        private readonly data:Data
    ) {
        super(messageService);
    }

    ngOnInit() {
        this.inicializarCombos();
        this.carregarDadosArmazenados();
    }

    private carregarDadosArmazenados():void{

        if (this.isStorageCarregado()) {
          const filtro = this.data.storage.dadosArmazenados;
          setTimeout(() => {
                this.formulario.patchValue({
                    mudancaAutomatica: filtro.mudancaAutomatica,
                    diasUteis: filtro.diasUteis,
                    somenteAtivos: filtro.somenteAtivos,
                    palavraChave: filtro.palavraChave
                });
            }, 50);  
            this.preencherCamposSelecionadosPorCampo(filtro, "listComboSituacaoProcesso", "situacoesProcesso");
    
            this.preencherCamposSelecionadosPorCampo(filtro, "listComboTipoProcesso", "tiposProcesso");

            this.preencherCamposSelecionadosPorCampo(filtro, "listComboTipoBeneficiario", "tiposBeneficiario");

        }
      }
    
      private preencherCamposSelecionadosPorCampo(filtro:any, nomeCampo:any, nomeCampoFormulario:any):void{
        const lista = filtro[nomeCampoFormulario];
        if(!lista){
            return;
        }
        //const valores = lista.map(v => typeof v === 'object' ? v.value : v);
        
        setTimeout(() => {  this.formulario.get(nomeCampoFormulario)?.setValue(lista);}, 200);
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
        this.limparStorage();
        let dadosArmazenados = this.prepararDados();
        this.gravarStorage(dadosArmazenados);

        this.router.navigate(['/manutencao/parametros/prazos-status/buscar'], {
            queryParams: { ...dadosArmazenados}
        }).then();
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

    prepararDados():any{
        const situacoesProcesso = this.getListaFormulario(this.formulario.get('situacoesProcesso').value, this.listComboSituacaoProcesso,true, false);
        const tiposProcesso = this.getListaFormulario(this.formulario.get('tiposProcesso').value, this.listComboTipoProcesso,true, false);
        const tiposBeneficiario = this.getListaFormulario(this.formulario.get('tiposBeneficiario').value, this.listComboTipoBeneficiario,true, false);
        
        const descricaoSituacoes = this.getListaFormulario(this.formulario.get('situacoesProcesso').value, this.listComboSituacaoProcesso, false, true);
        const descricaoTiposProcesso = this.getListaFormulario(this.formulario.get('tiposProcesso').value, this.listComboTipoProcesso, false, true);
        const descricaoTiposBeneficiario = this.getListaFormulario(this.formulario.get('tiposBeneficiario').value, this.listComboTipoBeneficiario, false, true);
        
        return {
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
    }

    private isStorageCarregado(): boolean {
        return ((this.data.storage) && (this.data.storage.dadosArmazenados));
    }

    gravarStorage(dadosArmazenados:any):void{
       this.data.storage = {dadosArmazenados}; 
    }

    limparStorage():void{
        this.data.storage = {}; 
    }

    limparCampos(): void {
        this.limparStorage();
        this.formulario.reset();
        this.formulario.markAsPristine();
        this.formulario.markAsUntouched();
        this.formulario.updateValueAndValidity();
    }

    voltar(): void {
        this.location.back();
    }
}
