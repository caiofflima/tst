import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from '../../../../app/arquitetura/shared/services/crud-http-client.service';
import {Observable, of} from 'rxjs';
import {Patologia} from '../../../../app/shared/models/entidades';
import {map} from "rxjs/operators";
import {Util} from "../../../arquitetura/shared/util/util";
import {FiltroPatologia} from '../../../../app/shared/models/filtro/filtro-patologia';
import {MessageService} from "../../components/messages/message.service";

@Injectable()
export class PatologiaService extends CrudHttpClientService<Patologia> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('patologias', http, messageService);
    }

    public consultarTodos(): Observable<Patologia[]> {
        return this.http.get<Patologia[]>(this.url, this.options());
    }

    public consultarPorFiltro(filtro: FiltroPatologia): Observable<Patologia[]> {
        return this.http.get<Patologia[]>(`${this.url}/?${filtro.montarQueryString()}`, this.options());
    }

    consultarTodosAtivos(): Observable<Patologia[]> {
        return this.http.get<Patologia[]>(`${this.url}/consultarTodosAtivos`, this.options());
    }

    consultarTodasPatologiasEmInscriacaoDeProgramasPor(codigoBeneficiario?: number | string): Observable<Patologia[]> {
        return this.http.get<Patologia[]>(`${this.url}/beneficiario/${codigoBeneficiario}/inscricao-programas`, this.options()).pipe(
            map(Util.removeDuplicateByKey('id'))
        );
    }

    public consultarPatologiaPedido(idPedido?: string): Observable<Patologia[]> {
        return this.http.get<Patologia[]>(`${this.url}/patologia-pedido/${idPedido}`, this.options());
    }

    public consultarPorId(idPatologia?: number): Observable<Patologia> {

        if(idPatologia!==null && idPatologia!==undefined){
            return this.http.get<Patologia>(`${this.url}/${idPatologia}`, this.options());
        }
            
        return of(null);
    }

    public consultarDTOPorId(idPatologia?: number): Observable<Patologia> {
        return this.http.get<Patologia>(`${this.url}/dto/${idPatologia}`, this.options());
    }

    public incluir(patologia: Patologia): Observable<Patologia> {
        return this.http.post<Patologia>(this.url, patologia, this.options());
    }

    public alterar(patologia: Patologia): Observable<Patologia> {
        return this.http.put<Patologia>(this.url, patologia, this.options());
    }

    public excluir(id: number): Observable<any> {
        return this.http.delete(`${this.url}/${id}`, this.options());
    }

}
