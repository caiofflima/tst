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
        console.log('=== VALORES DO FORMULARIO ===');
        console.log('apresentacao:', this.formulario.get('apresentacao').value);
        console.log('numeroTuss:', this.formulario.get('numeroTuss').value);
        console.log('ativos:', this.formulario.get('ativos').value);
        console.log('generico:', this.formulario.get('generico').value);

        const laboratorios = this.formulario.get('idListaLaboratorios').value;
        const medicamentos = this.formulario.get('idListaMedicamentos').value;

        const laboratoriosCompletos = (laboratorios && laboratorios.length > 0) ? laboratorios.map(val => {
            const numVal = typeof val === 'object' ? val.value : val;
            const item = this.listComboLaboratorios.find(lab => Number(lab.value) === Number(numVal));
            return item ? { label: item.label || item.descricao, value: item.value } : { label: '', value: numVal };
        }) : null;

        const medicamentosCompletos = (medicamentos && medicamentos.length > 0) ? medicamentos.map(val => {
            const numVal = typeof val === 'object' ? val.value : val;
            const item = this.listComboMedicamentos?.find(med => Number(med.value) === Number(numVal));
            return item ? { label: item.label || item.descricao, value: item.value } : { label: '', value: numVal };
        }) : null;

        this.data.storage = {
            filtroConsultaMedicamento: {
                ...this.formulario.value,
                idListaLaboratorios: laboratoriosCompletos,
                idListaMedicamentos: medicamentosCompletos,
                listaLaboratorios: this.formatarValorParam(this.formulario.get('idListaLaboratorios')),
                listaMedicamentos: this.formatarValorParam(this.formulario.get('idListaMedicamentos'))
            }
        };

        this.route.navigate(['manutencao/parametros/gerenciar-medicamentos/buscar'], {
            queryParams: {
                listaLaboratorios: this.formatarValorParam(this.formulario.get('idListaLaboratorios')),
                listaLaboratoriosNome: this.formatarNomeParam(this.formulario.get('idListaLaboratorios')),
                listaMedicamentos: this.formatarValorParam(this.formulario.get('idListaMedicamentos')),
                listaMedicamentosNome: this.formatarNomeParam(this.formulario.get('idListaMedicamentos')),
                apresentacao: this.formulario.get('apresentacao').value || null,
                numeroTuss: this.formulario.get('numeroTuss').value || null,
                ativos: this.formulario.get('ativos').value !== null ? this.formulario.get('ativos').value : null,
                generico: this.formulario.get('generico').value !== null ? this.formulario.get('generico').value : null
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
