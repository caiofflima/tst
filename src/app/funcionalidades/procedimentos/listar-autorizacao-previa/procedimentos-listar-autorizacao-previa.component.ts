import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {BundleUtil} from "app/arquitetura/shared/util/bundle-util";
import { Procedimento } from 'app/shared/models/entidades';
import { DuvidasService } from 'app/shared/services/comum/duvidas.service';
import { ProcedimentoService, MessageService } from 'app/shared/services/services';

@Component({
    selector: 'app-list-procedimentos',
    templateUrl: './procedimentos-listar-autorizacao-previa.component.html',
    styleUrls: ['./procedimentos-listar-autorizacao-previa.component.scss'],
    providers: [
        DuvidasService
    ]
})
export class ProcedimentosListarAutorizacaoPreviaComponent implements OnInit {
    listaProcedimentos: Procedimento[];
    procedimento: Procedimento;
    loading = false;
    rowCounter: number = 10;

    constructor(
        private readonly procedimentoService: ProcedimentoService,
        private readonly location: Location,
        private messageService: MessageService,
        public readonly duvidasService: DuvidasService
        ) {
        
    }

    ngOnInit() {
        this.carregarProcedimentosAutorizacaoPrevia();
    }

	carregarProcedimentosAutorizacaoPrevia() {
        this.loading = true;
		this.procedimentoService.listarProcedimentosAutorizacaoPrevia().subscribe(procedimentos => {
			this.listaProcedimentos = procedimentos;
            this.loading = false;
		}, error => {
            this.loading = false;
            this.messageService.addMsgDanger(error.message);
		})
	}

    voltar(): void {
        this.location.back();
    }
    
    public bundle(key: string, args?: any): string {
        return BundleUtil.fromBundle(key, args);
    }
}
