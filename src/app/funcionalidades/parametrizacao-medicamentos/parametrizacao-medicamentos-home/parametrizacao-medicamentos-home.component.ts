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
            'idListaLaboratorios': [this.filtroConsultaMedicamento.idListaLaboratorios],
            'idListaMedicamentos': [this.filtroConsultaMedicamento.idListaMedicamentos],
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
            if(this.listComboLaboratorios && this.filtroConsultaMedicamento.idListaLaboratorios){
                let lista:DadoComboDTO[]=[];

                this.filtroConsultaMedicamento.idListaLaboratorios.forEach(item => {
                    let temp = this.listComboLaboratorios.find(d=> Number(d.value) === Number(item.value));
                    lista.push(temp);
                });

                if(lista!==null && lista.length>0){
                    this.listComboLaboratoriosSelected= lista;

                    if(this.listComboLaboratoriosSelected){
                        this.preencherComboMedicamento(this.filtroConsultaMedicamento.idListaLaboratorios.map(v => v.value));
                    }
                    
                }else{
                    this.listComboLaboratoriosSelected = [];
                }	
            }
        }
    }

    private preencherComboMedicamentosSelecionados():void{
        if(this.isStorageCarregado()){ 

            if(this.listComboLaboratorios && this.filtroConsultaMedicamento.idListaMedicamentos){
                let lista:DadoComboDTO[]=[];
                this.filtroConsultaMedicamento.idListaMedicamentos.forEach(item => {
                    let temp = this.listComboMedicamentos.find(d=> Number(d.value) === Number(item.value));
                    lista.push(temp);
                });

                if(lista!==null && lista.length>0){
                    this.listComboMedicamentosSelected= lista;
                }else{
                    this.listComboMedicamentosSelected = [];
                }	
            }
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
        console.log("Buscar medicamentos ----------------------- ");
        console.log(this.formulario.get('idListaLaboratorios').value);
        if(this.formulario.get('idListaLaboratorios').value){ 
            //let lista  = this.formulario.get('idListaLaboratorios').value.map(v => v.value);
            let lista  = this.formulario.get('idListaLaboratorios').value;
            console.log("listalistalistalistalista Buscar medicamentos ----------------------- ");
        console.log(lista);
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
        this.formulario.reset();
        this.formulario.markAsPristine();
        this.formulario.markAsUntouched();
        this.formulario.updateValueAndValidity();
    }

    pesquisar(): void {

        this.data.storage = {
            filtroConsultaMedicamento: {...this.formulario.value, 
                listaLaboratorios: this.formatarValorParam(this.formulario.get('idListaLaboratorios')), 
                listaMedicamentos: this.formatarValorParam(this.formulario.get('idListaMedicamentos'))}
        };

        this.route.navigate(['manutencao/parametros/gerenciar-medicamentos/buscar'], {
            queryParams: {
                listaLaboratorios: this.formatarValorParam(this.formulario.get('idListaLaboratorios')),
                listaLaboratoriosNome: this.formatarNomeParam(this.formulario.get('idListaLaboratorios')),
                listaMedicamentos: this.formatarValorParam(this.formulario.get('idListaMedicamentos')),
                listaMedicamentosNome: this.formatarNomeParam(this.formulario.get('idListaMedicamentos')),
                apresentacao: this.formulario.get('apresentacao').value?this.formulario.get('apresentacao').value:null,
                numeroTuss: this.formulario.get('numeroTuss').value?this.formulario.get('numeroTuss').value:null,
                ativos: this.formulario.get('ativos').value?this.formulario.get('ativos').value:null,
                generico: this.formulario.get('generico').value?this.formulario.get('generico').value:null
            }
        }).then();
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
            if (typeof v === 'object' && v.label !== undefined) {
                return v.label;
            }
            return v;
        }).join(',');
    }

    public voltar(): void {
        this.location.back();
    }

}
