import {Injectable} from "@angular/core";
import {CrudHttpClientService} from "../../../arquitetura/shared/services/crud-http-client.service";
import {Atendimento} from "../../models/comum/atendimento";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {tap} from "rxjs/operators";
import {MessageService} from "../../components/messages/message.service";

@Injectable()
export class AtendimentoService extends CrudHttpClientService<Atendimento> {

    static atendimento: Atendimento;

    static changed = new Subject<Atendimento>();

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('atendimentos', http, messageService);
    }

    public iniciar(matricula: string, familiaSelecionada?: string): Observable<Atendimento> {
        let params = new HttpParams();
        params = params.set('familia', familiaSelecionada);
        let options = this.options();
        if (params.keys().length > 0) {
            options = this.options({params});
        }
        return this.http.get<Atendimento>(`${this.url}/iniciar/${matricula}`, this.options()).pipe(
            tap<Atendimento>(value => {
                AtendimentoService.atendimento = value;
                AtendimentoService.changed.next(value);

                if(familiaSelecionada !== undefined) {
                    value.familia = familiaSelecionada;
                    sessionStorage.setItem("familia", familiaSelecionada);
                } else {
                    value.familia = null;
                    sessionStorage.setItem("familia", "");
                }
            })
        );
    }

    public finalizar(): Observable<Atendimento> {
        return this.http.get<Atendimento>(`${this.url}/finalizar`, this.options()).pipe(
            tap(() => {
                AtendimentoService.atendimento = null;
                AtendimentoService.changed.next(null);
            })
        );
    }

    static get matricula(): string {
        return this.atendimento ? this.atendimento.matricula.replace('-', '') : null;
    }

    static get familia(): string {
        return this.atendimento ? this.atendimento.familia : null;
    }
}
