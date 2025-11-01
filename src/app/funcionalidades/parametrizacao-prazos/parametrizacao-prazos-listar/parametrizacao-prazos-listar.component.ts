import {Component, ViewChild} from '@angular/core';
import {MessageService} from "../../../shared/components/messages/message.service";
import {BaseComponent} from "../../../shared/components/base.component";
import {ActivatedRoute, Router} from '@angular/router';
import {PrazoTratamentoService} from "../../../shared/services/comum/prazo-tratamento.service";
import {take} from "rxjs/operators";
import {PrazoTratamento} from "../../../shared/models/entidades";
import {NumberUtil} from "../../../shared/util/number-util";
import {Location} from "@angular/common";


@Component({
    selector: 'asc-parametrizacao-prazos-listar',
    templateUrl: './parametrizacao-prazos-listar.component.html',
    styleUrls: ['./parametrizacao-prazos-listar.component.scss']
})
export class ParametrizacaoPrazosListarComponent extends BaseComponent {
     @ViewChild('caixaTableParametrizacaoPrazosListar')caixaTableParametrizacaoPrazosListar:any
     
    public id: number;
    public idsSituacaoProcesso: number[];
    public tiposBeneficiario: number[];
    public mudancaAutomatica: boolean;
    public idsTipoProcesso: number[];
    public somenteAtivos: boolean;
    public palavraChave: string;
    public diasUteis: boolean;

    loading = false;
    listaTotal: number = 0;
    listaPrazoTratamento: PrazoTratamento[];
    descricaoSituacoes: string;
    descricaoTiposProcesso: string;
    descricaoTiposBeneficiario: string;

    constructor(
        override readonly messageService: MessageService,
        private readonly location: Location,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly prazoTratamentoService: PrazoTratamentoService,
    ) {
        super(messageService);

        this.id = this.route.snapshot.queryParams['id'];
        this.idsSituacaoProcesso = NumberUtil.getArray(this.route.snapshot.queryParams['situacoesProcesso']);
        this.idsTipoProcesso = NumberUtil.getArray(this.route.snapshot.queryParams['tiposProcesso']);
        this.tiposBeneficiario = this.route.snapshot.queryParams['tiposBeneficiario'];
        this.palavraChave = this.route.snapshot.queryParams['palavraChave'];
        this.somenteAtivos = this.route.snapshot.queryParams['somenteAtivos'];
        this.mudancaAutomatica = this.route.snapshot.queryParams['mudancaAutomatica'];
        this.diasUteis = this.route.snapshot.queryParams['diasUteis'];
        this.descricaoSituacoes = this.route.snapshot.queryParams['descricaoSituacoes'];
        this.descricaoTiposProcesso = this.route.snapshot.queryParams['descricaoTiposProcesso'];
        this.descricaoTiposBeneficiario = this.route.snapshot.queryParams['descricaoTiposBeneficiario'];

        this.loading = true;
        this.prazoTratamentoService.consultarPorFiltro(this.id, this.idsTipoProcesso, this.idsSituacaoProcesso,
            this.palavraChave, this.diasUteis, this.somenteAtivos, this.mudancaAutomatica, this.tiposBeneficiario
        ).pipe(
            take<PrazoTratamento[]>(1)
        ).subscribe(res => {
            this.listaPrazoTratamento = res.map(l => ({
                ...l,
                nomeTiposBeneficiario: l.nomeTiposBeneficiario || '—',
                tipoProcesso: l.tipoProcesso || '—',
                mudancaAutomatica: l.mudancaAutomatica || '—',
                inativo: l.inativo === 'SIM' ? 'Sim' : 'Não'
            }));
            this.loading = false;
        }, err => {
            this.loading = false;
            this.showDangerMsg(err.error);
        });
    }

    public novo() {
        this.router.navigate(['/manutencao/parametros/prazos-status/novo']);
    }

    public editar(prazoTratamento: PrazoTratamento) {
        this.router.navigateByUrl('/manutencao/parametros/prazos-status/editar/' + prazoTratamento.id);
    }

    voltar(): void {
        this.location.back();
    }
        applyGlobalFilter(evento:Event){
        const input = evento.target as HTMLInputElement
        const value = input.value
        this.caixaTableParametrizacaoPrazosListar.filterGlobal(value,'contains')
    }

}
