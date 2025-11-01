import {ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {MessageService} from "../../services/services";
import {AscAutoCompleteComponent} from "./asc-auto-complete.component";
import {Procedimento} from "../../models/comum/procedimento";
import {IdadePipe} from "../../pipes/idade.pipe";
import * as constantes from "../../constantes";
import { ProcedimentoService } from '../../services/comum/procedimento.service';


const extrairNome = (p: Procedimento) => {
    let estrutNum = constantes.somenteNumeros(p.estruturaNumerica);
    return `${estrutNum} - ${p.descricaoProcedimento}`;
}

type InitProcedimento = {
    idTipoProcesso: number,
    dataNascimento: Date,
    sexo: string,
    idade?: number
}

@Component({
    selector: 'asc-auto-complete-procedimento',
    templateUrl: './asc-auto-complete.component.html',
    styleUrls: ['./asc-auto-complete.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AscAutoCompleteProcedimentoComponent extends AscAutoCompleteComponent<Procedimento> implements OnInit {

    @Input()
    solicitacaoCredenciado: boolean;

    parametrosFixos: InitProcedimento;

    constructor(
        override readonly messageService: MessageService,
        override readonly changeDetectorRef: ChangeDetectorRef,
        private readonly service: ProcedimentoService
    ) {
        super(messageService, changeDetectorRef, (p: Procedimento) => extrairNome(p), (p: Procedimento) => p.id, "Procedimento");
    }

    public initAutoComplete(params: InitProcedimento): void {
        this.parametrosFixos = params;
        this.parametrosFixos.idade = new IdadePipe().transform(this.parametrosFixos.dataNascimento);
    }

    search(e: any) {
        let idade = this.parametrosFixos.idade;
        let sexo = this.parametrosFixos.sexo;
        let idTipoProcesso = this.parametrosFixos.idTipoProcesso;
        let observable = this.service.consultarProcedimentosPorTipoProcessoAndSexoAndIdadeAndTexto(idTipoProcesso,
            sexo, idade, e.query);
        this.carregarLista(observable);
    }
}
