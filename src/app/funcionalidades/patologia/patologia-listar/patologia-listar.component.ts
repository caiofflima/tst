import {Patologia} from '../../../shared/models/comum/patologia';
import {FiltroPatologia} from '../../../shared/models/filtro/filtro-patologia';
import {PatologiaService} from '../../../shared/services/comum/patologia.service';
import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseComponent} from 'app/shared/components/base.component';
import {MessageService} from 'app/shared/services/services';
import {take} from "rxjs/operators";
import {Location} from "@angular/common";

@Component({
    selector: 'asc-patologia-listar',
    templateUrl: './patologia-listar.component.html',
    styleUrls: ['./patologia-listar.component.scss']
})
export class PatologiaListarComponent extends BaseComponent implements OnInit {
@ViewChild('caixaTablePatologiaListar')caixaTablePatologiaListar:any
    listaPatologias: any[];
    filtro: FiltroPatologia;

    constructor(
        override readonly messageService: MessageService,
        private readonly patologiaService: PatologiaService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly location: Location
    ) {
        super(messageService);
    }

    ngOnInit() {
        this.pesquisar();
    }
applyGlobalFilter(evento:Event){
        const input = evento.target as HTMLInputElement
        const value = input.value
        this.caixaTablePatologiaListar.filterGlobal(value,'contains')
    }
    pesquisar() {
        this.patologiaService.consultarPorFiltro(this.montaFiltrio()).pipe(
            take<Patologia[]>(1)
        ).subscribe(res => {
            this.listaPatologias = res.map(x => {
                const ret: any = {...x};
                ret.reembolso = Number(x.reembolso).toFixed(2).replace('.', ',') + "%";
                ret.inativo = x.inativo == "SIM" ? "Sim" : "Não";
                ret.compoeTeto = x.compoeTeto == "SIM" ? "Sim" : "Não";
                ret.calculoPartipacao = x.calculoPartipacao == "SIM" ? "Sim" : "Não";
                return ret;
            });
        }, error => this.showDangerMsg(error.error));
    }

    private montaFiltrio(): FiltroPatologia {
        this.filtro = new FiltroPatologia();

        this.filtro.codigo = this.route.snapshot.queryParams['codigo'] || '';
        this.filtro.nome = this.route.snapshot.queryParams['nome'] || '';
        this.filtro.evento = this.route.snapshot.queryParams['evento'] || '';
        this.filtro.percReembolso = this.route.snapshot.queryParams['percReembolso'] || '';
        this.filtro.teto = this.route.snapshot.queryParams['teto'] || '';
        this.filtro.pf = this.route.snapshot.queryParams['pf'] || '';
        this.filtro.ativos = this.route.snapshot.queryParams['ativos'] || '';

        return this.filtro;
    }

    editar(patologia: Patologia) {
        this.router.navigateByUrl('/manutencao/patologia/editar/' + patologia.id);
    }

    nova() {
        this.router.navigate(['/manutencao/patologia/novo']);
    }

    voltar(): void {
        this.location.back();
    }
}
