import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MessageService} from "../../../shared/components/messages/message.service";
import {BaseComponent} from "../../../shared/components/base.component";
import {take} from "rxjs/operators";
import {Location} from "@angular/common";
import { FiltroConsultaMotivoNegacao } from 'app/shared/models/filtro/filtro-consulta-motivo-negacao';
import { MotivoNegacaoService } from 'app/shared/services/services';
import { MotivoNegacao, SituacaoProcesso } from 'app/shared/models/entidades';

class ResultadoPesquisa {
    situacaoPedido: SituacaoProcesso;
    id: string;
    tituloNegacao: string;
    motivoNegacao: string;
    inativo: string;
}

@Component({
    selector: 'asc-parametrizacao-motivo-negacao-listar',
    templateUrl: './parametrizacao-motivo-negacao-listar.component.html',
    styleUrls: ['./parametrizacao-motivo-negacao-listar.component.scss']
})

export class ParametrizacaoMotivoNegacaoListarComponent extends BaseComponent implements OnInit {
    @ViewChild('caixaTableBeneficiarioPedidoListar')caixaTableBeneficiarioPedidoListar:any

    filtroMotivoNegacao: FiltroConsultaMotivoNegacao;
    listaMotivosNegacao: ResultadoPesquisa[];
    situacaoPedido: string;
    loading = false;

    constructor(
        override readonly messageService: MessageService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly motivoNegacaoService: MotivoNegacaoService,
        private readonly location: Location
    ) {
        super(messageService);
    }

    ngOnInit(): void {
        this.pesquisar();
    }

    private montaFiltro(): FiltroConsultaMotivoNegacao {
        this.filtroMotivoNegacao = new FiltroConsultaMotivoNegacao();
        this.situacaoPedido = this.activatedRoute.snapshot.queryParams['nomeSituacaoPedido']
        this.filtroMotivoNegacao.idSituacaoPedido = this.activatedRoute.snapshot.queryParams['idSituacaoPedido'];
        this.filtroMotivoNegacao.tituloNegacao = this.activatedRoute.snapshot.queryParams['tituloNegacao'];
        this.filtroMotivoNegacao.motivoNegacao = this.activatedRoute.snapshot.queryParams['motivoNegacao'];
        this.filtroMotivoNegacao.somenteAtivo = this.obterParamatroSomenteAtivo()
                this.filtroMotivoNegacao.icNivelNegacao = this.activatedRoute.snapshot.queryParams['icNivelNegacao'];

        return this.filtroMotivoNegacao;
    }

    private obterParamatroSomenteAtivo(): string {
        const somenteAtivo = this.activatedRoute.snapshot.queryParams['somenteAtivo'];
        return somenteAtivo ? somenteAtivo[0] : '';
    }

    public pesquisar(): void {
        this.loading = true;
        this.motivoNegacaoService.consultaMotivoNegacaoPorFiltro(this.montaFiltro()).pipe(
            take<MotivoNegacao[]>(1)
        ).subscribe(res => {
            this.listaMotivosNegacao = res.map(d => ({
                
                situacaoPedido: d.situacaoProcesso,
                nivelNegacao: d.nivelNegacao,
                tituloNegacao: d.titulo,
                motivoNegacao: d.descricaoHistorico,
                inativo: d.inativo == "SIM" ? "Sim" : "Não",
                id: d.id.toString()
            }));

            this.loading = false;
        }, err => {
            this.loading = false;
            this.showDangerMsg(err.error)
        });
    }

    isNaoPossuiFiltros(): boolean {
        const filtros = [
            this.filtroMotivoNegacao.idSituacaoPedido,
            this.filtroMotivoNegacao.motivoNegacao,
            this.filtroMotivoNegacao.tituloNegacao,
            this.filtroMotivoNegacao.somenteAtivo,
            this.filtroMotivoNegacao.icNivelNegacao
        ]

        return filtros.every(filtro => !filtro);
       
    }

    voltar(): void {
        this.location.back();
    }

    applyGlobalFilter(evento:Event){
        const input = evento.target as HTMLInputElement
        const value = input.value
        this.caixaTableBeneficiarioPedidoListar.filterGlobal(value,'contains')
    }
}
