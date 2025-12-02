import {debounceTime, distinctUntilChanged, take} from 'rxjs/operators';
import {MedicamentoService} from '../../../shared/services/comum/pedido/medicamento.service';
import {BaseComponent} from 'app/shared/components/base.component';
import {Component, OnInit} from '@angular/core';
import {MessageService, PatologiaService} from 'app/shared/services/services';
import {Router} from '@angular/router';
import {Medicamento} from 'app/shared/models/comum/medicamento';
import {Patologia} from "../../../shared/models/comum/patologia";
import {FormControl} from "@angular/forms";
import {Location} from "@angular/common";
import {FiltroPatologia} from 'app/shared/models/filtro/filtro-patologia';
import { Option } from 'sidsc-components/dsc-select';
import { Data } from 'app/shared/providers/data';

@Component({
    selector: 'asc-vinc-med-patologia-home',
    templateUrl: './vinc-med-patologia-home.component.html',
    styleUrls: ['./vinc-med-patologia-home.component.scss']
})
export class VincMedPatologiaHomeComponent extends BaseComponent implements OnInit {

    timeout: any;
    ativos: boolean;
    patologias: Option[] = [{
        value: null,
        label: this.bundle('MHSPH')
    }];
    patologia: number = null;
    medicamentos: Option[] = [];
    medicamento = new FormControl();
    termoBusca: string = '';

    constructor(
        override readonly messageService: MessageService,
        private readonly patologiaService: PatologiaService,
        private readonly medicamentoService: MedicamentoService,
        private readonly router: Router,
        private readonly location: Location,
        private readonly data: Data
    ) {
        super(messageService);
        this.buscarMedicamentosComFiltro();
        this.restaurarFiltros();
    }

    ngOnInit() {
        if (!this.data.storage?.vincMedPatologiaFiltros) {
            this.ativos = false;
        }
        this.buscarPatologias();
    }

    private restaurarFiltros() {
        if (this.data.storage?.vincMedPatologiaFiltros) {
            const filtros = this.data.storage.vincMedPatologiaFiltros;
            this.ativos = filtros.ativos || false;
            this.patologia = filtros.patologia;
            if (filtros.medicamento) {
                this.medicamento.setValue(filtros.medicamento);
            }
            if (filtros.medicamentosOptions) {
                this.medicamentos = filtros.medicamentosOptions;
            }
        }
    }

    public buscarMedicamentos(): void {
        this.medicamentoService.consultarTodosMedicamentosAtivos(false).subscribe(result => {
            this.medicamentos = result.map(item => ({
                value: item.id,
                label: this.formatarNumeroTiss(item.numeroTiss) + ' / ' + item.laboratorio.nome + ' / ' + item.nome + ' / ' + item.descricaoApresentacao,
            }));
        });
    }

    buscarRegistrosMedicamentos(): void {
        if (this.termoBusca.length >= 3) {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
            this.consultarPorFiltro();
            }, 300);
        }
    }

    buscarMedicamentosComFiltro() {
        if (this.termoBusca.length >= 3) {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
              this.consultarMedicamentosComFiltro();
            }, 300);
        }else{
            this.medicamentos = [{
                value: null,
                label: this.bundle(null)
            }]
        }
    }

    consultarMedicamentosComFiltro(){
        this.medicamentoService.consultar(this.termoBusca).pipe(
            take<Medicamento[]>(1)
        ).subscribe(res => {
            this.medicamentos = [{
                value: null,
                label: this.bundle(null)
            }, ...res.map(ob => ({
                filtering: ob.id + ' - ' + ob.nome.toUpperCase() + ' - ' + ob.codigoApresentacao.toUpperCase() + ' - ' + ob.laboratorio.nome.toUpperCase(),
                label: this.formatarNumeroTiss(ob.numeroTiss) + ' / ' + ob.laboratorio.nome + ' / ' + ob.nome + ' / ' + ob.descricaoApresentacao,
                value: ob.id
            }))]
        });
    }

    buscarRegistros(): void {
      if (this.termoBusca.length >= 3) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.consultarPorFiltro();
        }, 300);
      }
    }

    public buscarPatologias() {
        this.patologiaService.consultarTodos().pipe(
            take<Patologia[]>(1)
        ).subscribe(res =>
            this.patologias = [{
                value: null,
                label: this.bundle('MHSPH')
            }, ...res.map(p => ({
                label: p.codigo + ' - ' + p.nome,
                value: p.id
            }))]
        );
    }

    public consultarPorFiltro(){
        let filtro: FiltroPatologia = new FiltroPatologia();
        filtro.nome = this.termoBusca;

        this.patologiaService.consultarPorFiltro(filtro).pipe(
            take<Patologia[]>(1)
        ).subscribe(res =>
            this.patologias = [{
                value: null,
                label: this.bundle('MHSPH')
            }, ...res.map(p => ({
                label: p.codigo + ' - ' + p.nome,
                value: p.id
            }))]
        );
    }

    limparCampos() {
        this.ativos = false;
        this.patologia = null;
        this.medicamento.reset();
    }

    public nova() {
        this.router.navigate(['/manutencao/vinc-med-patologia/novo'], {});
    }

    public consultarMedicamentoPorNome(nome:string){
        this.medicamentoService.consultar(nome).pipe(
            take<Medicamento[]>(1)
        ).subscribe(res => {
            this.medicamentos = [{
                value: null,
                label: this.bundle(null)
            }, ...res.map(ob => ({
                filtering: ob.id + ' - ' + ob.nome.toUpperCase() + ' - ' + ob.codigoApresentacao.toUpperCase() + ' - ' + ob.laboratorio.nome.toUpperCase(),
                label: this.formatarNumeroTiss(ob.numeroTiss) + ' / ' + ob.laboratorio.nome + ' / ' + ob.nome + ' / ' + ob.descricaoApresentacao,
                value: ob.id
            }))]
        });
    }

    filtroMedicamento(event: string) {
        if (event && event.length > 2) {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
              this.consultarMedicamentoPorNome(event);
            }, 100);           
        } else {
            this.medicamentos = [];
        }
    }

     filtroMedicamentos(event: string) {
        if (event && event.length > 1) {
            this.medicamentoService.consultarTodosMedicamentosAtivos(false).pipe(
                debounceTime<Medicamento[]>(1000),
                take<Medicamento[]>(1)
            ).subscribe(res => {
                this.medicamentos = [{
                    value: null,
                    label: this.bundle(null)
                }, ...res.map(ob => ({
                    filtering: ob.id + ' - ' + ob.nome.toUpperCase() + ' - ' + ob.codigoApresentacao.toUpperCase() + ' - ' + ob.laboratorio.nome.toUpperCase(),
                    label: this.formatarNumeroTiss(ob.numeroTiss) + ' / ' + ob.laboratorio.nome + ' / ' + ob.nome + ' / ' + ob.descricaoApresentacao,
                    value: ob.id
                }))]
            })
        } else {
            this.medicamentos = [];
        }
    }

    voltar(): void {
        this.location.back();
    }

    pesquisar(): void {
        this.data.storage = {
            vincMedPatologiaFiltros: {
                patologia: this.patologia,
                medicamento: this.medicamento.value,
                ativos: this.ativos,
                medicamentosOptions: this.medicamentos
            }
        };

        this.router.navigate(['/manutencao/vinc-med-patologia/listar'], {
            queryParams: {
                patologia: this.patologia || '',
                medicamento: this.medicamento.value || '',
                ativos: this.ativos
            }
        });
    }

    formatarNumeroTiss(numeroTiss: number): string {
        let numeroTissStr = numeroTiss.toString();
        while (numeroTissStr.length < 10) {
            numeroTissStr = '0' + numeroTissStr;
        }
        return numeroTissStr;
    }
}
