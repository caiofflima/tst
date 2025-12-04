import {FiltroPatologia} from '../../../shared/models/filtro/filtro-patologia';
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {MessageService} from 'app/shared/components/messages/message.service';
import {PatologiaService} from 'app/shared/services/services';
import {BaseComponent} from 'app/shared/components/base.component';
import {FormControl} from "@angular/forms";
import {Location} from "@angular/common";

@Component({
    selector: 'asc-patologia-home',
    templateUrl: './patologia-home.component.html',
    styleUrls: ['./patologia-home.component.scss']
})
export class PatologiaHomeComponent extends BaseComponent implements OnInit {

    evento = new FormControl(null);
    percReembolso = new FormControl(null);
    nome = new FormControl(null);
    filtro: FiltroPatologia;

    categories: any[] = [
        {
            name: 'Sim',
            key: 'S'
        },
        {
            name: 'Não',
            key: 'N'
        }
    ];

    selectedCategory: any = null;

    constructor(
        override readonly messageService: MessageService,
        private readonly patologiaService: PatologiaService,
        private readonly router: Router,
        private readonly location: Location
    ) {

        super(messageService);

    }

    ngOnInit() {
        this.selectedCategory = this.categories[1];
        this.filtro = new FiltroPatologia();


    }

    pesquisar() {
        if (this.filtro.nome && this.filtro.nome.length <= 3) {
            super.showDangerMsg("Campo Descrição deve conter mais de 3 (três) caracteres!")
            return;
        }
        this.router.navigate(['/manutencao/patologia/buscar'], {
            queryParams: {
                nome: this.filtro.nome === null ? '' : this.filtro.nome,
                codigo: this.filtro.codigo === null ? '' : this.filtro.codigo,
                evento: this.evento.value,
                percReembolso: this.percReembolso === null ? '' : this.filtro.percReembolso,
                teto: this.filtro.teto === null ? '' : this.filtro.teto,
                pf: this.filtro.pf === null ? '' : this.filtro.pf,
                ativos: this.filtro.ativos === null ? '' : this.filtro.ativos
            }
        });
    }

    limparCampos() {
        this.filtro = new FiltroPatologia();
    }

    nova() {
        this.router.navigate(['/manutencao/patologia/novo']);
    }

    retornar() {
        this.router.navigate(['/manutencao/patologia/']);
    }

    voltar(): void {
        this.location.back();
    }
}
