import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {take} from 'rxjs/operators';
import {Location} from "@angular/common";
import {FormBuilder, FormGroup} from '@angular/forms';

import {BaseComponent} from "../../../shared/components/base.component";
import {MessageService} from "../../../shared/components/messages/message.service";
import {ComboService} from 'app/shared/services/services';
import {DadoComboDTO} from 'app/shared/models/dtos';
import {FiltroConsultaMedicamento} from 'app/shared/models/filtro/filtro-consulta-medicamento';
import {Data} from 'app/shared/providers/data';

@Component({
    selector: 'asc-parametrizacao-medicamentos-home',
    templateUrl: './parametrizacao-medicamentos-home.component.html',
    styleUrls: ['./parametrizacao-medicamentos-home.component.scss']
})
export class ParametrizacaoMedicamentosHomeComponent extends BaseComponent implements OnInit {

    listComboMedicamentos: DadoComboDTO[];
    listComboLaboratorios: DadoComboDTO[];
    listComboMedicamentosSelected: DadoComboDTO[];
    listComboLaboratoriosSelected: DadoComboDTO[];

    formulario: FormGroup;

    filtroConsultaMedicamento: FiltroConsultaMedicamento  = new FiltroConsultaMedicamento();
    
    constructor(
        override readonly messageService: MessageService,
        private readonly route: Router,
        private readonly location: Location,
        private readonly comboService: ComboService,
        private readonly formBuilder: FormBuilder,
        private readonly data: Data,
    ) {
        super(messageService);

        if (this.isStorageCarregado()) {
            this.filtroConsultaMedicamento = this.data.storage.filtroConsultaMedicamento;
        }

        this.formulario = this.formBuilder.group({
            'idListaLaboratorios': [null],
            'idListaMedicamentos': [null],
            'apresentacao': [this.filtroConsultaMedicamento.apresentacao],
            'numeroTuss': [this.filtroConsultaMedicamento.numeroTuss],
            'ativos': [this.filtroConsultaMedicamento.ativos],
            'generico': [this.filtroConsultaMedicamento.generico],
        });
    }

    ngOnInit(): void {
        this.inicializarCombos();
    }

    private isStorageCarregado():boolean{
        return ( (this.data.storage) && (this.data.storage.filtroConsultaMedicamento) );
    }

    public inicializarCombos(): void {
        this.preencherComboLaboratorio();
        this.preencherComboMedicamento(null);
    }

    private preencherComboLaboratorio(): void{
        this.comboService.consultarComboLaboratorios().pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(res => {
            this.listComboLaboratorios = res;
            this.preencherComboLaboratoriosSelecionados();
        }, err => this.showDangerMsg(err.error));

    }

    private preencherComboLaboratoriosSelecionados():void{
        if(this.isStorageCarregado()){
            setTimeout(() => {
                this.formulario.patchValue({
                    apresentacao: this.filtroConsultaMedicamento.apresentacao,
                    numeroTuss: this.filtroConsultaMedicamento.numeroTuss,
                    ativos: this.filtroConsultaMedicamento.ativos,
                    generico: this.filtroConsultaMedicamento.generico
                });
            }, 50);

            if(this.filtroConsultaMedicamento.idListaLaboratorios){
                const valores = this.filtroConsultaMedicamento.idListaLaboratorios.map(v =>
                    typeof v === 'object' ? v.value : v
                );

                setTimeout(() => {
                    this.formulario.get('idListaLaboratorios').setValue(valores);
                }, 100);

                this.preencherComboMedicamento(valores);
            }
        }
    }

    private preencherComboMedicamentosSelecionados():void{
        if(this.isStorageCarregado() && this.filtroConsultaMedicamento.idListaMedicamentos){
            const valores = this.filtroConsultaMedicamento.idListaMedicamentos.map(v =>
                typeof v === 'object' ? v.value : v
            );

            setTimeout(() => {
                this.formulario.get('idListaMedicamentos').setValue(valores);
            }, 200);
        }
    }

    private preencherComboMedicamento(lista:number[]): void{
        if(lista){
            this.comboService.consultarComboMedicamentos(lista).pipe( take<DadoComboDTO[]>(1) ).subscribe(
                res => {
                this.listComboMedicamentos = res; 
                this.preencherComboMedicamentosSelecionados();
            }, err => this.showDangerMsg(err.error));
        }else if(this.formulario.get('idlistaLaboratorios')) {
            if(this.formulario.get('idlistaLaboratorios').value){ 
                this.comboService.consultarComboMedicamentos(this.formulario.get('idlistaLaboratorios')
                .value.map(v => v.value)).pipe( take<DadoComboDTO[]>(1) ).subscribe(res => {
                    this.listComboMedicamentos = res; 
                    this.preencherComboMedicamentosSelecionados();
                }, err => this.showDangerMsg(err.error));
            }      
        }
    }

    public buscarMedicamentos(evento:any){
        if(this.formulario.get('idListaLaboratorios').value){
            let lista  = this.formulario.get('idListaLaboratorios').value;
            if(lista && lista.length>0){
                this.comboService.consultarComboMedicamentos(lista).pipe(
                    take<DadoComboDTO[]>(1)
                ).subscribe(res => {
                    this.listComboMedicamentos = res;

                }, err => this.showDangerMsg(err.error));
            }else{
                this.listComboMedicamentos = null;
            }
        }
    }

    public limitarTamanho(event:any){
        let valor = event.target.value;
        if(valor.length > 9){
            event.target.value = valor.slice(0,9);
            this.filtroConsultaMedicamento.numeroTuss = Number(event.target.value );
        }
    }

    public limparCampos(): void {
        this.filtroConsultaMedicamento = new FiltroConsultaMedicamento();
        this.data.storage = null;
        this.formulario.reset();
        this.formulario.markAsPristine();
        this.formulario.markAsUntouched();
        this.formulario.updateValueAndValidity();
    }

    pesquisar(): void {
        const dadosCompletos = this.obterDadosCompletos();
        this.persistirDados(dadosCompletos);
        this.navegarComFiltros();
    }
    
    private obterDadosCompletos() {
        return {
            laboratorios: this.completarItens('idListaLaboratorios', this.listComboLaboratorios),
            medicamentos: this.completarItens('idListaMedicamentos', this.listComboMedicamentos)
        };
    }
    
    private completarItens(campo: string, listaReferencia: any[]): any[] | null {
        const valores = this.formulario.get(campo).value;
        if (!valores?.length) return null;
    
        return valores.map(val => this.montarItemCompleto(val, listaReferencia));
    }
    
    private montarItemCompleto(valor: any, lista: any[]): any {
        const numVal = typeof valor === 'object' ? valor.value : valor;
        const encontrado = lista?.find(item => Number(item.value) === Number(numVal));
        
        return encontrado
            ? { label: encontrado.label || encontrado.descricao, value: encontrado.value }
            : { label: '', value: numVal };
    }
    
    private persistirDados(dados: any): void {
        this.data.storage = {
            filtroConsultaMedicamento: {
                ...this.formulario.value,
                idListaLaboratorios: dados.laboratorios,
                idListaMedicamentos: dados.medicamentos,
                listaLaboratorios: this.formatarValorParam(this.getControl('idListaLaboratorios')),
                listaMedicamentos: this.formatarValorParam(this.getControl('idListaMedicamentos'))
            }
        };
    }
    
    private navegarComFiltros(): void {
        this.route.navigate(
            ['manutencao/parametros/gerenciar-medicamentos/buscar'],
            { queryParams: this.montarQueryParams() }
        );
    }
    
    private montarQueryParams(): any {
        return {
            listaLaboratorios: this.formatarValorParam(this.getControl('idListaLaboratorios')),
            listaLaboratoriosNome: this.formatarNomeParam(this.getControl('idListaLaboratorios')),
            listaMedicamentos: this.formatarValorParam(this.getControl('idListaMedicamentos')),
            listaMedicamentosNome: this.formatarNomeParam(this.getControl('idListaMedicamentos')),
            apresentacao: this.getControlValue('apresentacao') ?? null,
            numeroTuss: this.getControlValue('numeroTuss') ?? null,
            ativos: this.getControlValue('ativos') ?? null,
            generico: this.getControlValue('generico') ?? null
        };
    }
    
    private getControl(campo: string) {
        return this.formulario.get(campo);
    }
    
    private getControlValue(campo: string): any {
        return this.formulario.get(campo).value;
    }

    private formatarValorParam(elemento:any):string{
        if (!elemento.value) return null;
        return elemento.value.map(v => {
            if (typeof v === 'object' && v.value !== undefined) {
                return v.value;
            }
            return v;
        }).join(',');
    }

    private formatarNomeParam(elemento:any):string{
        if (!elemento.value) return null;
        return elemento.value.map(v => {
            if (typeof v === 'object' && v !== null) {
                if (v.label !== undefined) {
                    return v.label;
                }
                if (v.descricao !== undefined) {
                    return v.descricao;
                }
            }
            return v;
        }).join(', ');
    }

    public voltar(): void {
        this.location.back();
    }

}
