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
        this.montaFiltro();
        this.pesquisar();
    }
    
    private montaFiltro(): FiltroConsultaMedicamento {
        this.filtroConsultaMedicamento = new FiltroConsultaMedicamento();
        
        const queryParams = this.activatedRoute.snapshot.queryParams;
        this.filtroConsultaMedicamento.id = queryParams['id'];
        
        this.processarStorageData();
        this.definirNomesLaboratorios(queryParams);
        this.definirNomesMedicamentos(queryParams);
        this.preencherFiltrosBasicos(queryParams);
        
        return this.filtroConsultaMedicamento;
    }
    
    private processarStorageData(): void {
        const storage = this.data.storage?.filtroConsultaMedicamento;
        if (!storage) {
            return;
        }
    
        this.processarLaboratoriosStorage(storage);
        this.processarMedicamentosStorage(storage);
    }
    
    private processarLaboratoriosStorage(storage: any): void {
        if (!this.isArrayValido(storage.idListaLaboratorios)) {
            return;
        }
    
        this.listaLaboratoriosNome = this.extrairNomesDeArray(storage.idListaLaboratorios);
    }
    
    private processarMedicamentosStorage(storage: any): void {
        if (!this.isArrayValido(storage.idListaMedicamentos)) {
            return;
        }
    
        this.listaMedicamentosNome = this.extrairNomesDeArray(storage.idListaMedicamentos);
    }
    
    private extrairNomesDeArray(items: any[]): string {
        return items
            .map(item => this.extrairNomeDoItem(item))
            .join(', ');
    }
    
    private extrairNomeDoItem(item: any): string {
        if (typeof item !== 'object' || item === null) {
            return item;
        }
    
        return item.label || item.descricao || item.nome || JSON.stringify(item);
    }
    
    private definirNomesLaboratorios(queryParams: any): void {
        if (!this.listaLaboratoriosNome) {
            this.listaLaboratoriosNome = queryParams['listaLaboratoriosNome'];
        }
    }
    
    private definirNomesMedicamentos(queryParams: any): void {
        if (!this.listaMedicamentosNome) {
            this.listaMedicamentosNome = queryParams['listaMedicamentosNome'];
        }
    }
    
    private preencherFiltrosBasicos(queryParams: any): void {
        this.filtroConsultaMedicamento.listaLaboratorios = this.converterListaArray(queryParams['listaLaboratorios']);
        this.filtroConsultaMedicamento.listaMedicamentos = this.converterListaArray(queryParams['listaMedicamentos']);
        this.filtroConsultaMedicamento.apresentacao = queryParams['apresentacao'];
        this.filtroConsultaMedicamento.numeroTuss = this.converterNumeroTuss(queryParams['numeroTuss']);
        this.filtroConsultaMedicamento.ativos = this.obterParametroBooleano(queryParams['ativos']);
        this.filtroConsultaMedicamento.generico = this.obterParametroBooleano(queryParams['generico']);
    }
    
    private converterNumeroTuss(numeroTuss: string): number | null {
        return numeroTuss ? Number(numeroTuss) : null;
    }
    
    private isArrayValido(array: any): boolean {
        return array && Array.isArray(array);
    }

    private converterListaArray(lista:any):number[]{
        if(lista === null || lista === undefined){
           return null; 
        }

        return Array.isArray(lista) ? lista.map(d=>parseInt(d, 10)) : lista.split(",").map(x=>Number(x.trim()));
    }

    private obterParametroBooleano(valor:any): boolean {
        if(valor === null || valor === undefined){
            return null;
        }
        if(valor === 'true' || valor === true){
            return true;
        }
        if(valor === 'false' || valor === false){
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
