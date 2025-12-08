import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {SelectItem} from "primeng/api";
import {BaseComponent} from "../../../shared/components/base.component";
import {MessageService} from "../../../shared/components/messages/message.service";
import {FormControl} from "@angular/forms";
import {Location} from "@angular/common";
import { FiltroConsultaMotivoNegacao } from 'app/shared/models/filtro/filtro-consulta-motivo-negacao';
import { SituacaoProcesso } from 'app/shared/models/entidades';
import { ComboService, SituacaoProcessoService } from 'app/shared/services/services';
import {Data} from "../../../shared/providers/data";

@Component({
    selector: 'asc-parametrizacao-motivo-negacao-home',
    templateUrl: './parametrizacao-motivo-negacao-home.component.html',
    styleUrls: ['./parametrizacao-motivo-negacao-home.component.scss']
})
export class ParametrizacaoMotivoNegacaoHomeComponent extends BaseComponent implements OnInit {

    filtro: FiltroConsultaMotivoNegacao;
    situacaoPedidos: SelectItem[];
    situacaoPedido: SituacaoProcesso;
    idSituacaoPedidoCombo = new FormControl(null);
    icNiveisNegacaoCombo = new FormControl(null);
    tituloNegacao = new FormControl(null);
    motivoNegacao = new FormControl(null);
    
    idSituacaoPedido: number;
    nomeSituacaoPedido: string;
    icNivelNegacao: string;
    situacaoAutorizacao: string = "AUTORIZAÇÃO";
    nivelNegacaoSelecionado: string;
    
    icNiveisNegacaoSelecionado: string;

    mostrarSituacaoDoPedidoCombo = true;

    icNiveisNegacao: SelectItem[] = [{
        value: "S",
        label: "PEDIDO"
    }, {
        value: "D",
        label: "PROCEDIMENTO"
    }];

    constructor(
        override readonly messageService: MessageService,
        private readonly service: ComboService,
        private readonly situacaoProcessoService: SituacaoProcessoService,
        private readonly route: Router,
        private readonly location: Location,
        private readonly data:Data
    ) {
        super(messageService)
    }

    ngOnInit(): void {
        this.filtro = new FiltroConsultaMotivoNegacao();
        this.carregarDados();
    }

    carregarDados():void{
        if (this.isStorageCarregado()) {
            const filtro = this.data.storage.dadosArmazenados;
            setTimeout(() => {
                if(filtro.icNivelNegacao){
                    this.icNiveisNegacaoCombo.setValue(filtro.icNivelNegacao);
                    this.nivelNegacaoSelecionado = filtro.icNivelNegacao;
                    this.getTiposPedidos();
                    if(this.mostrarSituacaoDoPedidoCombo){
                        this.idSituacaoPedidoCombo.setValue(filtro.idSituacaoPedido);
                    }    
                }

                this.tituloNegacao.setValue(filtro.tituloNegacao);
                this.motivoNegacao.setValue(filtro.motivoNegacao);
                this.filtro.somenteAtivo = filtro.somenteAtivo;
            }, 50);
        }
    }

    private salvarStorage(dadosArmazenados: any): void {
        this.data.storage = {dadosArmazenados };
    }

    private isStorageCarregado(): boolean {
        return (this.data.storage && this.data.storage.dadosArmazenados);
    }

    getTiposPedidos(): void {
        if(this.nivelNegacaoSelecionado ===null || this.nivelNegacaoSelecionado === undefined){
            this.situacaoPedidos = [];
            this.mostrarSituacaoDoPedidoCombo = true;
            this.idSituacaoPedidoCombo.setValue("");
        }else if(this.nivelNegacaoSelecionado == 'S') {
                this.mostrarSituacaoDoPedidoCombo = true;
                this.situacaoProcessoService.consultarSituacoesProcessoNegativas().subscribe(result=> {
                    this.situacaoPedidos = result.map(item => ({
                        value: item.id, 
                        label: item.nome})).sort((a,b)=> a.label.localeCompare(b.label))  
                });
        } else {
            this.mostrarSituacaoDoPedidoCombo = false;
            this.situacaoPedidos = [];
            this.idSituacaoPedidoCombo.setValue("");
            this.service.consultarComboSituacaoProcesso().subscribe(result => {
                this.situacaoPedidos = result.map(item => ({
                    label: item.label,
                    value: item
                }));
            });
        } 
    }

    tipoSelecionado(tipo: any) {
        let situacao = this.getSituacaoPedido(tipo.value);

        if(situacao){
            this.idSituacaoPedido = situacao.value;
            this.nomeSituacaoPedido = situacao.label;
        }
    }

    getSituacaoPedido(id:any):any{
        if(id!==null && id!==undefined){
            return this.situacaoPedidos.find(item=>item.value===id);
        }
        return null;
    }

    nivelNegacaoSeleconado(nivel: any) {
       if(nivel !==null && nivel!== undefined){
            this.icNivelNegacao = nivel.value;
            this.nivelNegacaoSelecionado = nivel.value;

            if(this.nivelNegacaoSelecionado  !==null && this.nivelNegacaoSelecionado !== undefined) {
                this.getTiposPedidos();
            }else{
                this.reiniciarSituacaoPedido();
            }
       }
    }

    reiniciarSituacaoPedido(){
        this.situacaoPedidos = [];
        this.idSituacaoPedidoCombo.setValue("");
        this.idSituacaoPedido = null;
        this.nomeSituacaoPedido = null;
    }
  
    prepararDados():any{
        return {
            nomeSituacaoPedido: this.nomeSituacaoPedido ?? "",
            idSituacaoPedido: this.idSituacaoPedido ?? "",
            tituloNegacao: this.validarRetornarValor(this.tituloNegacao),
            motivoNegacao: this.validarRetornarValor(this.motivoNegacao),
            somenteAtivo: this.filtro.somenteAtivo || "",
            icNivelNegacao: this.icNivelNegacao ?? ""
        }
    }

    validarRetornarValor(item:any):any{
        return item ? item.value : "";
    }

    pesquisar(): void {
        this.limparStorage();
        let dadosArmazenados = this.prepararDados();
        this.salvarStorage(dadosArmazenados);

        this.route.navigate(['manutencao/parametros/motivo-negacao/buscar'], {
            queryParams: { ... dadosArmazenados }
        }).then();
    }

    public voltar(): void {
        this.location.back();
    }

    mostrarComboSituacaoDoPedido(): boolean {
        return this.mostrarSituacaoDoPedidoCombo;
    }

    private limparStorage(){
        this.data.storage = {};
    }
 
    public limparCampos(): void {
        this.limparStorage();
        this.filtro = new FiltroConsultaMotivoNegacao();
        this.idSituacaoPedidoCombo.setValue("");
        this.icNiveisNegacaoCombo.setValue("");
        this.motivoNegacao.reset();
        this.tituloNegacao.reset();
        this.reiniciarSituacaoPedido();
    }

}
