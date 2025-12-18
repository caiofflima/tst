import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl} from "@angular/forms";
import {Location} from "@angular/common";

import {FiltroPatologia} from '../../../shared/models/filtro/filtro-patologia';
import {MessageService} from 'app/shared/components/messages/message.service';
import {PatologiaService} from 'app/shared/services/services';
import {BaseComponent} from 'app/shared/components/base.component';
import {Data} from "../../../shared/providers/data";

@Component({
    selector: 'asc-patologia-home',
    templateUrl: './patologia-home.component.html',
    styleUrls: ['./patologia-home.component.scss']
})

export class PatologiaHomeComponent extends BaseComponent implements OnInit {
    evento = new FormControl(null);
    nome = new FormControl(null);
    percReembolso = new FormControl(null);
    codigo = new FormControl(null);
    ativos = new FormControl(null);

    filtro: FiltroPatologia;
    categories: any[] = [ {  name: 'Sim', key: 'S' },{ name: 'Não', key: 'N' } ];
    selectedCategory: any = null;

    constructor(
        override readonly messageService: MessageService,
        private readonly patologiaService: PatologiaService,
        private readonly router: Router,
        private readonly location: Location,
        private readonly data: Data
    ) {
        super(messageService);
    }

    ngOnInit() {
        this.selectedCategory = this.categories[1];
        this.filtro = new FiltroPatologia();
        this.preencherDadosSelecionados();
    }

    private preencherDadosSelecionados():void{ 
        if(this.isStorageCarregado()){
            let filtro = this.data.storage.dadosArmazenarPatologia;
            setTimeout(() => {
                this.evento.setValue(filtro.evento);
                this.nome.setValue(filtro.nome);
                //this.percReembolso.setValue(filtro.percReembolso);
                this.codigo.setValue(filtro.codigo);
                this.filtro.percReembolso = (filtro.percReembolso);
                this.filtro.teto = filtro.teto;
                this.filtro.pf = filtro.pf;
                this.filtro.ativos = filtro.ativos;
            }, 50);
        }
    }

    pesquisar() {
        if (this.nome.value && this.nome?.value.length <= 3) {
            super.showDangerMsg("Campo Descrição deve conter mais de 3 (três) caracteres!")
            return;
        }

        let dadosArmazenarPatologia = this.prepararDados();

        this.salvarStorage(dadosArmazenarPatologia);

        this.router.navigate(['/manutencao/patologia/buscar'], {
            queryParams: { ...dadosArmazenarPatologia }
        });
    }

    prepararDados():any{
        return {
            nome: this.nome.value ?? '',
            codigo: this.codigo.value ?? '',
            evento: this.evento.value,
            percReembolso: this.filtro.percReembolso ?? '',
            teto: this.filtro.teto ?? '',
            pf: this.filtro.pf ?? '',
            ativos: this.filtro.ativos ?? ''
        }
    }

    private isStorageCarregado():boolean{
        return this.data.storage?.dadosArmazenarPatologia;
    }

    salvarStorage(dadosArmazenarPatologia:any){
        this.data.storage = { dadosArmazenarPatologia };
    }

    limparStorage():void{
        this.data.storage = {};
    }

    limparCampos() {
        this.limparStorage();
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
