import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {CrudHttpClientService} from '../../../../app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import {ProgressoDTO} from "../../models/dto/progresso";
import {catchError} from "rxjs/operators";
import {of} from "rxjs";
import {PrazoTratamento} from "../../models/comum/prazo-tratamento";
import {Pageable} from "../../components/pageable.model";
import {MessageService} from "../../components/messages/message.service";

@Injectable()
export class PrazoTratamentoService extends CrudHttpClientService<PrazoTratamento> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('prazos-tratamento', http, messageService);
    }

    public consultarProgressoPrazoPorPedido(idPedido: number): Observable<any> {
        return this.http.get(this.url + '/progresso/' + idPedido, this.options()).pipe(
            catchError(() => of({}))
        );
    }

    public consultarPorFiltro(id: number, idsTipoProcesso: number[], idsSituacaoProcesso: number[], palavraChave: string,
                              diasUteis: boolean, somenteAtivos: boolean, mudancaAutomatica: boolean,
                              tiposBeneficiario: number[]): Observable<PrazoTratamento[]> {
        let params = new HttpParams();

        if (id) {
            params = params.set('id', id.toString());
        }
        if (idsTipoProcesso) {
            idsTipoProcesso.forEach(i => params = params.append('idsTipoProcesso', i.toString()));
        }
        if (idsSituacaoProcesso) {
            idsSituacaoProcesso.forEach(i => params = params.append('idsSituacaoProcesso', i.toString()));
        }
        if (palavraChave) {
            params = params.set('palavraChave', palavraChave);
        }
        if (diasUteis) {
            params = params.set('diasUteis', String(diasUteis));
        }
        if (somenteAtivos) {
            params = params.set('somenteAtivos', String(somenteAtivos));
        }
        if (mudancaAutomatica) {
            params = params.set('mudancaAutomatica', String(mudancaAutomatica));
        }
        if (tiposBeneficiario) {
            tiposBeneficiario.forEach(i => params = params.append('tiposBeneficiario', i.toString()));
        }

        return this.http.get<PrazoTratamento[]>(this.url, this.options({params}));
    }
}
