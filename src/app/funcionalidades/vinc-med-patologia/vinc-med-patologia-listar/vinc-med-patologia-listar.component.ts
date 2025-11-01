import {MedicamentoPatologia} from '../../../shared/models/comum/medicamento-patologia';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseComponent} from 'app/shared/components/base.component';
import {MedicamentoPatologiaService} from 'app/shared/services/comum/medicamento-patologia.service';
import {MedicamentoService} from 'app/shared/services/comum/pedido/medicamento.service';
import {MessageService, PatologiaService} from 'app/shared/services/services';
import {Location} from "@angular/common";
import {take} from "rxjs/operators";
import {Medicamento} from "../../../shared/models/comum/medicamento";
import {Patologia} from "../../../shared/models/comum/patologia";

class ResultadoPesquisa {
    idPatologia: number;
    idMedicamento: number;
    nomePatologia: string;
    nomeMedicamento: string;
    inativo: string;
}

@Component({
    selector: 'asc-vinc-med-patologia-listar',
    templateUrl: './vinc-med-patologia-listar.component.html',
    styleUrls: ['./vinc-med-patologia-listar.component.scss']
})
export class VincMedPatologiaListarComponent extends BaseComponent implements OnInit {

    lista: ResultadoPesquisa[];

    patologiaDesc: string;
    medicamentoDesc: string;
    ativoDesc: string;

    constructor(
        override readonly messageService: MessageService,
        private readonly patologiaService: PatologiaService,
        private readonly medicamentoService: MedicamentoService,
        private readonly medicamentoPatologiaService: MedicamentoPatologiaService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly location: Location
    ) {
        super(messageService);
    }

    ngOnInit() {
        const ativos: boolean = this.route.snapshot.queryParams['ativos'] === "true";
        const idMedicamento: number = this.route.snapshot.queryParams['medicamento'];
        const idPatologia: number = this.route.snapshot.queryParams['patologia'];

        this.ativoDesc = ativos ? 'Sim' : 'Não';
        if (idMedicamento) {
            this.medicamentoService.consultarPorId(idMedicamento).pipe(
                take<Medicamento>(1)
            ).subscribe(ob => this.medicamentoDesc = this.formatarNumeroTiss(ob.numeroTiss) + ' / ' + ob.laboratorio.nome + ' / ' + ob.nome + ' / ' + ob.descricaoApresentacao);
        }
        if (idPatologia) {
            this.patologiaService.consultarPorId(idPatologia).pipe(
                take<Patologia>(1)
            ).subscribe(p => this.patologiaDesc = p.codigo + ' - ' + p.nome);
        }

        this.medicamentoPatologiaService.consultarPorFiltro(idPatologia, idMedicamento, ativos).pipe(
            take<MedicamentoPatologia[]>(1)
        ).subscribe(medicamentos => {
            this.lista = medicamentos.map(m => ({
                id: m.id,
                idPatologia: m.idPatologia,
                idMedicamento: m.idMedicamento,
                nomePatologia: `${m.patologiaCodigo} - ${m.nomePatologia}`,
                nomeMedicamento: `${this.formatarNumeroTiss(m.numeroTiss)} / ${m.nomeLaboratorio} / ${m.nomeMedicamento} / ${m.nomeApresentacao} `,
                inativo: m.inativo === 'SIM' ? 'Sim' : 'Não'
            }));
            if (!this.lista.length) {
                this.messageService.addMsgDanger(this.bundle("MA142"))
            }
        }, error => this.showDangerMsg(error.error));
    }

    public voltar() {
        this.location.back();
    }

    formatarNumeroTiss(numeroTiss: number): string {
        var numeroTissStr = numeroTiss.toString();
        while (numeroTissStr.length < 10) {
            numeroTissStr = '0' + numeroTissStr;
        }
        return numeroTissStr;
    }
}
