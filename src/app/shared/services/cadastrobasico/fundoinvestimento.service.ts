import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CrudHttpClientService} from '../../../../app/arquitetura/shared/services/crud-http-client.service';
import {FundoInvestimento} from '../../../../app/shared/models/fundoinvestimento';
import {MessageService} from "../../components/messages/message.service";


@Injectable()
export class FundoInvestimentoService extends CrudHttpClientService<FundoInvestimento> {

    constructor(
        override readonly messageService: MessageService,
        protected override http: HttpClient
    ) {
        super('cadastrobasico/fundoinvestimento', http, messageService);
    }

    public filtrar(fundoinvestimento: FundoInvestimento): Observable<Array<FundoInvestimento>> {
        return this.http.post<Array<FundoInvestimento>>(this.url + "/filtrar", fundoinvestimento);
    }

    /**
     * listarTodos Pesquisa todos os registros de fundo de investimento.
     */
    public listarTodos(): Observable<Array<FundoInvestimento>> {
        return this.http.get<Array<FundoInvestimento>>(this.url + '/listar-todos');
    }

    /**
     * Incluir novo fundo de investimento.
     */
    public incluir(fundoinvestimento: FundoInvestimento): Observable<boolean> {
        return this.http.post<boolean>(this.url + "/incluir", fundoinvestimento);
    }

    public consultaPorId(id): Observable<FundoInvestimento> {
        return this.http.get<FundoInvestimento>(this.url + '/consulta-por-id/' + id);
    }

    public atualizar(fundoinvestimento: FundoInvestimento): Observable<Boolean> {
        return this.http.put<Boolean>(this.url + '/atualizar', fundoinvestimento, this.options());
    }

    public remover(fundoinvestimento: any): Observable<Boolean> {
        return this.http.delete<Boolean>(this.url + '/remover/' + fundoinvestimento.id, this.options());
    }
}
