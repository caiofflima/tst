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
        private readonly location: Location
    ) {
        super(messageService)
    }

    ngOnInit(): void {
        this.filtro = new FiltroConsultaMotivoNegacao();
    }

    public limparCampos(): void {
        this.filtro = new FiltroConsultaMotivoNegacao();
        this.idSituacaoPedidoCombo.setValue("");
        this.icNiveisNegacaoCombo.setValue("")
    }

    getTiposPedidos(): void {
        if(this.nivelNegacaoSelecionado == 'S') {
            this.mostrarSituacaoDoPedidoCombo = true;
            this.situacaoProcessoService.consultarSituacoesProcessoNegativas().subscribe(result=> {
                this.situacaoPedidos = result.map(item => ({
                    value: item.id, 
                    label: item.nome})).sort((a,b)=> a.label.localeCompare(b.label))  
            });
        } else {
            this.mostrarSituacaoDoPedidoCombo = false;
            this.service.consultarComboSituacaoProcesso().subscribe(result => {
                this.situacaoPedidos = result.map(item => ({
                    label: item.label,
                    value: item
                }));
            });
        }

    }

    pesquisar(): void {
        this.route.navigate(['manutencao/parametros/motivo-negacao/buscar'], {
            queryParams: {
                nomeSituacaoPedido: this.nomeSituacaoPedido ? this.nomeSituacaoPedido : "",
                idSituacaoPedido: this.idSituacaoPedido ? this.idSituacaoPedido : "",
                tituloNegacao: this.filtro.tituloNegacao || "",
                motivoNegacao: this.filtro.motivoNegacao || "",
                somenteAtivo: this.filtro.somenteAtivo || "",
                icNivelNegacao: this.icNivelNegacao ? this.icNivelNegacao : ""
            }
        }).then();
    }

    tipoSelecionado(tipo: any) {
        this.idSituacaoPedido = tipo.value;
        this.nomeSituacaoPedido = tipo.label;
    }

    nivelNegacaoSeleconado(nivel: any) {
       this.icNivelNegacao = nivel;
       this.nivelNegacaoSelecionado = nivel;
       if(this.nivelNegacaoSelecionado !== undefined) {
        this.getTiposPedidos();
       }
       
    }

    public voltar(): void {
        this.location.back();
    }

    mostrarComboSituacaoDoPedido(): boolean {
        return this.mostrarSituacaoDoPedidoCombo;
    }
}
