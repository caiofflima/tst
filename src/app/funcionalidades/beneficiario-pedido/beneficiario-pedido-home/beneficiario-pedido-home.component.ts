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
import { Data } from "../../../shared/providers/data";
 
import { CheckboxChangeEvent } from 'primeng/checkbox';
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
        private readonly beneficiarioPedidoService: BeneficiarioPedidoService,
        private readonly data:Data 
    ) {
        super(messageService);
    }

    ngOnInit() {
        this.titulo = this.beneficiarioPedidoService.getTitulo()
        this.baseURL = this.beneficiarioPedidoService.getBaseURL()
        this.inicializarCombos();
        this.carregarDadosArmazenados();
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

    private carregarDadosArmazenados():void{

        if (this.isStorageCarregado()) {
          const filtro = this.data.storage.dadosArmazenados;
        
          setTimeout(() => {
              this.preencherCamposSelecionadosPorCampo(filtro, "tiposProcesso");
    
              this.preencherCamposSelecionadosPorCampo(filtro, "tiposBeneficiario");

              this.formulario.get('somenteAtivos').setValue(filtro.somenteAtivos);
          }, 50);
        }
      }

    private preencherCamposSelecionadosPorCampo(filtro:any, nomeCampo:any):void{
        const lista = filtro[nomeCampo];
        if(!lista){
            return;
        } 

        //const valores = lista.map(v => typeof v === 'object' ? v.value : v);
        
        setTimeout(() => {  this.formulario.get(nomeCampo)?.setValue(lista);}, 200);
    }
    novoPrazo(): void {
        this.router.navigate([`${this.baseURL}/novo`]);
    }

    pesquisar(): void {
        this.limparStorage();
        let dadosArmazenados = this.prepararDados();
        this.salvarStorage(dadosArmazenados);

        this.router.navigate([`${this.baseURL}/buscar`], {
            queryParams: { ...dadosArmazenados }
        }).then();
    }

    prepararDados():any{
        const tiposProcesso = this.getListaFormulario(this.formulario.get('tiposProcesso').value, this.listComboTipoProcesso, true, false);
        const tiposBeneficiario = this.getListaFormulario(this.formulario.get('tiposBeneficiario').value, this.listComboTipoBeneficiario, true, false);
        const descricaoTiposProcesso = this.getListaFormulario(this.formulario.get('tiposProcesso').value, this.listComboTipoProcesso, false, true);
        const descricaoTiposBeneficiario = this.getListaFormulario(this.formulario.get('tiposBeneficiario').value, this.listComboTipoBeneficiario, false, true);
     
        return {
            tiposProcesso,
            tiposBeneficiario,
            descricaoTiposProcesso,
            descricaoTiposBeneficiario,
            somenteAtivos: this.formulario.get('somenteAtivos').value
        };
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

      private isStorageCarregado(): boolean {
        return ((this.data.storage) && (this.data.storage.dadosArmazenados));
      }

      private salvarStorage(dadosArmazenados:any){
        this.data.storage = { dadosArmazenados } ;
      }
    
      private limparStorage(){
        this.data.storage = {};
      }

    limparCampos(): void {
        this.limparStorage();
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
