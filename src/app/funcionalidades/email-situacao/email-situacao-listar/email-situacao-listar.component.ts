import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MessageService} from 'app/shared/components/messages/message.service';
import {FiltroConsultaEmail} from 'app/shared/models/filtro/filtro-consulta-email';
import {BaseComponent} from 'app/shared/components/base.component';
import {EmailService} from 'app/shared/services/comum/email.service';
import {take} from "rxjs/operators";
import {Location} from "@angular/common";
import {Pageable} from "../../../shared/components/pageable.model";
import {Email} from "../../../shared/models/comum/email";

@Component({
    selector: 'app-email-situacao-listar',
    templateUrl: './email-situacao-listar.component.html',
    styleUrls: ['./email-situacao-listar.component.scss']
})

export class EmailSituacaoListarComponent extends BaseComponent {

    @ViewChild('caixaTableEmailSituacaoListar')caixaTableEmailSituacaoListar:any


    loading = false;
    listaTotal: number = 0;
    descricaoSituacoes: string;
    descricaoTiposProcesso: string;
    descricaoTiposBeneficiario: string;

    filtro: FiltroConsultaEmail = new FiltroConsultaEmail();
    listaEmails: Email[];

    constructor(
        override readonly messageService: MessageService,
        private readonly emailService: EmailService,
        private readonly route: ActivatedRoute,
        private readonly location: Location,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {
        super(messageService);

        this.filtro.id = this.route.snapshot.queryParams['id'];
        this.filtro.situacoesProcesso = this.route.snapshot.queryParams['situacoesProcesso'];
        this.filtro.tiposProcesso = this.route.snapshot.queryParams['tiposProcesso'];
        this.filtro.tiposBeneficiario = this.route.snapshot.queryParams['tiposBeneficiario'];
        this.filtro.palavraChave = this.route.snapshot.queryParams['palavraChave'];
        this.filtro.somenteAtivos = this.route.snapshot.queryParams['somenteAtivos'];
        this.descricaoSituacoes = this.route.snapshot.queryParams['descricaoSituacoes'] || 'Todas';
        this.descricaoTiposProcesso = this.route.snapshot.queryParams['descricaoTiposProcesso'] || 'Todas';
        this.descricaoTiposBeneficiario = this.route.snapshot.queryParams['descricaoTiposBeneficiario'] || 'Todas';
    }

    ngOnInit(): void {
        this.pesquisaInicial();
    }

    public pesquisaInicial(): void {
        this.loading = true;
        this.emailService.consultar(this.filtro, null, null).pipe(
            take<Pageable<Email>>(1)
        ).subscribe(res => {
            this.listaTotal = res.total;
            this.listaEmails = res.dados.map(i => ({
                ...i,
                inativo: (i.inativo) ? 'Sim' : 'Não',
                nomeSituacaoProcesso: i.idTipoOcorrencia !== null ? 'OBSERVAÇÃO' : i.nomeSituacaoProcesso
            })); 
            this.loading = false;
            this.changeDetectorRef.detectChanges();
        }, error => {
            this.showDangerMsg(error.error);
            this.loading = false;
        });
    }

    public pesquisar($event): void {
        this.loading = true;

        this.emailService.consultar(this.filtro, $event.rows, $event.first).pipe(
            take<Pageable<Email>>(1)
        ).subscribe(res => {
            this.listaTotal = res.total;
            this.listaEmails = res.dados.map(i => ({
                ...i,
                inativo: (i.inativo) ? 'Sim' : 'Não',
                nomeSituacaoProcesso: (i.idTipoOcorrencia !== null ? 'OBSERVAÇÃO' : i.nomeSituacaoProcesso)
            })); 
            this.loading = false;
            this.changeDetectorRef.detectChanges();
        }, error => {
            this.showDangerMsg(error.error);
            this.loading = false;
        });
    }

    voltar() {
        this.location.back();
    }

    applyGlobalFilter(evento:Event){
        const input = evento.target as HTMLInputElement
        const value = input.value
        this.caixaTableEmailSituacaoListar.filterGlobal(value,'contains')
    }
      
}
