import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {BaseComponent} from "../../../../app/shared/components/base.component";
import {MessageService, ProcessoService, SIASCFluxoService} from "../../../../app/shared/services/services";
import {DadoComboDTO, ProcessoDTO} from "../../../../app/shared/models/dtos";
import {Data} from "../../../../app/shared/providers/data";

@Component({
    selector: 'app-pesquisar-processos-credenciado-listar',
    templateUrl: 'pesquisar-processos-credenciado-listar.component.html',
    styleUrls: ['pesquisar-processos-credenciado-listar.component.scss']
})
export class PesquisarProcessosCredenciadoListarComponent extends BaseComponent implements OnInit {

    listComboTipoProcesso: DadoComboDTO[];
    listComboSituacaoProcesso: DadoComboDTO[];
    listaProcessos: ProcessoDTO[] = [];
    matricula: string;
    private voltarPara: string;

    constructor(
        override readonly messageService: MessageService,
        private readonly fb: FormBuilder,
        private readonly router: Router,
        private readonly processoService: ProcessoService,
        private readonly siascFluxoService: SIASCFluxoService,
        private readonly data: Data,
        private readonly route: ActivatedRoute
    ) {
        super(messageService);
    }

    get filtro(): any {
        return this.data.storage['filtro'];
    }

    get colaborador(): any {
        return this.data.storage['colaborador'];
    }

    ngOnInit() {
        this.route.params.subscribe(p => {
            this.voltarPara = p['voltarPara'];
        });
        if (this.filtro) {
            this.processoService
            .consultarProcessosAutorizador(this.filtro)
            .subscribe(next => {
                this.listaProcessos = next;
            });
        } else {
            this.retornarParaConsultar();
        }
    }

    /*public pesquisarProcessos(): void {

    }*/

    public realizarNovoPedido(): void {
        //this.disponibilizarTitularSessionStorage();
        this.router.navigateByUrl('/pedido/autorizacao-previa');
    }

    public iniciarAtendimento(): void {
        //this.disponibilizarTitularSessionStorage();
        this.router.navigateByUrl('/home');
    }

   /* private disponibilizarTitularSessionStorage(): void {

    } */

    public retornarParaConsultar(): void {
        if (this.voltarPara)
            this.router.navigateByUrl(atob(this.voltarPara));
    }

}
