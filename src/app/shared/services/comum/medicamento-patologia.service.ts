import {MedicamentoPatologia} from '../../models/comum/medicamento-patologia';
import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {CrudHttpClientService} from '../../../../app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import {MessageService} from "../../components/messages/message.service";

@Injectable()
export class MedicamentoPatologiaService extends CrudHttpClientService<MedicamentoPatologia> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('medicamentos-patologias', http, messageService);
    }

    public consultarPorFiltro(idPatologia: number, idMedicamento: number, ativo: boolean = false): Observable<MedicamentoPatologia[]> {
        let params = new HttpParams();
        if (idPatologia) {
            params = params.append("idPatologia", String(idPatologia));
        }
        if (idMedicamento) {
            params = params.append("idMedicamento", String(idMedicamento));
        }
        if (ativo) {
            params = params.append("ativo", String(ativo));
        }

        return this.http.get<MedicamentoPatologia[]>(this.url, this.options({params}));
    }

    public excluir(idMedicamentoPatologia: number): Observable<any> {
        return this.http.delete(`${this.url}/${idMedicamentoPatologia}`, this.options());
    }

}
