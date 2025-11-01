import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {MedicamentoPatologiaPedido} from "../../models/comum/medicamento-patologia-pedido";
import {of} from "rxjs";
import { CrudHttpClientService } from 'app/arquitetura/shared/services/crud-http-client.service';
import { MessageService } from '../../components/messages/message.service';

@Injectable()
export class MedicamentoPatologiaPedidoService extends CrudHttpClientService<MedicamentoPatologiaPedido> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('medicamentos-patologia-pedido', http, messageService);
    }

    incluir(medicamentoPatologia: MedicamentoPatologiaPedido): Observable<MedicamentoPatologiaPedido> {
        return this.http.post(`${this.url}`, medicamentoPatologia, this.options())
    }

    excluir(id: number): Observable<any> {
        if (id) {
            return this.http.delete(`${this.url}/${id}`, this.options())
        }

        return of({});
    }

    atualizar(medicamentoPatologia: MedicamentoPatologiaPedido): Observable<MedicamentoPatologiaPedido> {
        return this.http.put(`${this.url}`, medicamentoPatologia, this.options());
    }

    public consultarPorIdPedido(idPedido: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}/pedido/${idPedido}`, this.options());
    }
}
