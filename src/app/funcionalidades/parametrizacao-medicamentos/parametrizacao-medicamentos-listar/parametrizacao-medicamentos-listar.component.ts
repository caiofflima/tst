import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {take} from "rxjs/operators";
import {Location} from "@angular/common";

import {MessageService} from "../../../shared/components/messages/message.service";
import {BaseComponent} from "../../../shared/components/base.component";
import { FiltroConsultaMedicamento } from 'app/shared/models/filtro/filtro-consulta-medicamento';
import { Medicamento } from 'app/shared/models/entidades';
import { MedicamentoService } from 'app/shared/services/services';
import { Data } from 'app/shared/providers/data';

class ResultadoPesquisaMedicamento {
    id: string;
    nomeLaboratorio: string;
    nomeMedicamento: string;
    apresentacao: string;
    numeroTuss: string;
    valor: string;
    ativo: string;
}

@Component({
    selector: 'asc-parametrizacao-medicamentos-listar',
    templateUrl: './parametrizacao-medicamentos-listar.component.html'
})
export class ParametrizacaoMedicamentosListarComponent extends BaseComponent implements OnInit {
    [x: string]: any;

    filtroConsultaMedicamento: FiltroConsultaMedicamento;
    listaMedicamento: ResultadoPesquisaMedicamento[];
    listaLaboratoriosNome: string;
    listaMedicamentosNome: string;
    situacaoPedido: string;
    loading = false;
    id:number;

    constructor(
        override readonly messageService: MessageService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly location: Location,
        private readonly medicamentoService: MedicamentoService,
        private readonly data: Data
    ) {
        super(messageService);
    }

    ngOnInit(): void {
        console.log('=== STORAGE COMPLETO ===', this.data.storage);
        this.montaFiltro();
        this.pesquisar();
    }
    private montaFiltro(): FiltroConsultaMedicamento {
        this.filtroConsultaMedicamento = new FiltroConsultaMedicamento();

        this.filtroConsultaMedicamento.id = this.activatedRoute.snapshot.queryParams['id'];

        if (this.data.storage?.filtroConsultaMedicamento) {
            const storage = this.data.storage.filtroConsultaMedicamento;
            console.log('=== STORAGE filtroConsultaMedicamento ===', storage);

            if (storage.idListaLaboratorios && Array.isArray(storage.idListaLaboratorios)) {
                console.log('idListaLaboratorios:', storage.idListaLaboratorios);
                this.listaLaboratoriosNome = storage.idListaLaboratorios
                    .map(item => {
                        console.log('item laboratorio:', item);
                        if (typeof item === 'object' && item !== null) {
                            return item.label || item.descricao || item.nome || JSON.stringify(item);
                        }
                        return item;
                    })
                    .join(', ');
                console.log('listaLaboratoriosNome final:', this.listaLaboratoriosNome);
            }

            if (storage.idListaMedicamentos && Array.isArray(storage.idListaMedicamentos)) {
                console.log('idListaMedicamentos:', storage.idListaMedicamentos);
                this.listaMedicamentosNome = storage.idListaMedicamentos
                    .map(item => {
                        console.log('item medicamento:', item);
                        if (typeof item === 'object' && item !== null) {
                            return item.label || item.descricao || item.nome || JSON.stringify(item);
                        }
                        return item;
                    })
                    .join(', ');
                console.log('listaMedicamentosNome final:', this.listaMedicamentosNome);
            }
        }

        if (!this.listaLaboratoriosNome) {
            this.listaLaboratoriosNome = this.activatedRoute.snapshot.queryParams['listaLaboratoriosNome'];
            console.log('listaLaboratoriosNome do queryParams:', this.listaLaboratoriosNome);
        }

        if (!this.listaMedicamentosNome) {
            this.listaMedicamentosNome = this.activatedRoute.snapshot.queryParams['listaMedicamentosNome'];
            console.log('listaMedicamentosNome do queryParams:', this.listaMedicamentosNome);
        }

        this.filtroConsultaMedicamento.listaLaboratorios = this.converterListaArray(this.activatedRoute.snapshot.queryParams['listaLaboratorios']);
        this.filtroConsultaMedicamento.listaMedicamentos = this.converterListaArray(this.activatedRoute.snapshot.queryParams['listaMedicamentos']);
        this.filtroConsultaMedicamento.apresentacao = this.activatedRoute.snapshot.queryParams['apresentacao'];
        this.filtroConsultaMedicamento.numeroTuss = this.activatedRoute.snapshot.queryParams['numeroTuss']?Number(this.activatedRoute.snapshot.queryParams['numeroTuss']):null;
        this.filtroConsultaMedicamento.ativos = this.obterParametroBooleano(this.activatedRoute.snapshot.queryParams['ativos']);
        this.filtroConsultaMedicamento.generico = this.obterParametroBooleano(this.activatedRoute.snapshot.queryParams['generico']);

        return this.filtroConsultaMedicamento;
    }

    private converterListaArray(lista:any):number[]{
        if(lista === null || lista === undefined){
           return null; 
        }

        return Array.isArray(lista) ? lista.map(d=>parseInt(d, 10)) : lista.split(",").map(x=>Number(x.trim()));
    }

    private obterParametroBooleano(valor:string): boolean {
        if(valor!==null && valor){
            return true;
        }else if(valor!==null&& !valor){
            return false;
        }
        return null;
    }

    public pesquisar(): void {
        this.loading = true;
        this.medicamentoService.consultarPorFiltro(this.montaFiltro()).pipe(
            take<Medicamento[]>(1)
        ).subscribe(res => {
            this.listaMedicamento = res.map(d => ({
                id: d.id.toString(),
                nomeLaboratorio: d.laboratorio.nome,
                nomeMedicamento: d.nome,
                apresentacao: d.descricaoApresentacao,
                numeroTuss: d.numeroTuss?d.numeroTuss.toString():null,
                valor: d.valor?d.valor.toString():null,
                ativo: d.inativo.toString() === "SIM" ? "Não" : "Sim"           
            }));

            this.loading = false;
        }, err => {
            this.loading = false;
            this.showDangerMsg(err.error)
        });
    }

    isNaoPossuiFiltros(): boolean {
        const filtros = [
            this.filtroConsultaMedicamento.apresentacao,
            this.filtroConsultaMedicamento.ativos,
            this.filtroConsultaMedicamento.generico,
            this.filtroConsultaMedicamento.listaLaboratorios,
            this.filtroConsultaMedicamento.listaMedicamentos,
            this.filtroConsultaMedicamento.numeroTuss
        ]

        return filtros.every(filtro => !filtro);
       
    }

    voltar(): void {
        this.location.back();
    }
}
