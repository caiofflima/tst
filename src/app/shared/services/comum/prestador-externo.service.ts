import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from 'app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import {MessageService} from "../../components/messages/message.service";
import {FiltroConsultaPrestadorExterno} from "../../models/filtro/filtro-consulta-prestador-externo";
import {PrestadorExterno} from 'app/shared/models/comum/prestador-externo';

@Injectable()
export class PrestadorExternoService extends CrudHttpClientService<any> {

    constructor(
        override readonly messageService: MessageService,
        protected override http: HttpClient
    ) {
        super('prestadores-externos', http, messageService);
    }

    public consultarPorCPF(cpf: string): Observable<any> {
        return this.http.get(this.url + '/cpf/' + cpf, this.options());
    }

    public consultarPorCpfAlteracao(cpf: string, id: number): Observable<any> {
        return this.http.get(this.url + '/cpf/' + cpf + '/id/' + id, this.options());
    }

    public consultarPorIdCredenciado(idCredenciado: number): Observable<any> {
        return this.http.get(this.url + '/operadores/' + idCredenciado, this.options());
    }

    public consultarPorId(id: number): Observable<any> {
        return this.http.get(this.url + '/' + id, this.options());
    }

    public consultarPorFiltro(filtro: FiltroConsultaPrestadorExterno): Observable<any> {
        return this.http.post(this.url + '/consulta/filtro', filtro, this.options());
    }

    public consultarUsuarioExternoPorFiltro(filtro: FiltroConsultaPrestadorExterno): Observable<any> {
        return this.http.post(this.url + '/consulta/filtro-usuario-externo', filtro, this.options());
    }

    public salvar(prestador: PrestadorExterno): Observable<any> {
        return this.http.post<PrestadorExterno>(this.url, prestador, this.options());
    }

    public alterarStatus(id: number, status: string): Observable<any> {
        return this.http.get(this.url + '/id/' + id + '/status/' + status, this.options());
    }
}
