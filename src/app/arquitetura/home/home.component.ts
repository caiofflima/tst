import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {BaseComponent} from '../../../app/shared/components/base.component';
import {MessageService} from '../../../app/shared/components/messages/message.service';
import {SessaoService} from "../shared/services/seguranca/sessao.service";
import {
    ResultadoPesquisaProcessosCredenciadoComponent
} from "../../funcionalidades/pesquisar-processos-credenciado/resultado-pesquisa-processos-credenciado/resultado-pesquisa-processos-credenciado.component";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent extends BaseComponent implements AfterViewInit {

    @ViewChild("resultadoPesquisa")
    resultadoPesquisa!: ResultadoPesquisaProcessosCredenciadoComponent;

    constructor(
        protected override messageService: MessageService,
        private sessaoService: SessaoService
    ) {
        super(messageService);
    }

    async ngAfterViewInit() {
        this.sessaoService.subjectIdCredenciado.subscribe(id => {
            if (this.resultadoPesquisa) {
                this.resultadoPesquisa.atualizarListaProcessos(id, 10, "/home");
            }
        });
    }

    get showImage(): boolean {
        return (!this.resultadoPesquisa) || !this.resultadoPesquisa.hasResultado();
    }

}
