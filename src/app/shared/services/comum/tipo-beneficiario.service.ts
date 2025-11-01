import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from 'app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from "rxjs";
import {DadoComboDTO} from "../../models/dto/dado-combo";
import {MessageService} from "../../components/messages/message.service";

@Injectable()
export class TipoBeneficiarioService extends CrudHttpClientService<DadoComboDTO> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('combos', http, messageService);
    }

    public consultarTodosBeneficiarios(): Observable<DadoComboDTO[]> {
        return this.http.get<DadoComboDTO[]>(`${this.url}/tipo-beneficiario/`, this.options());
    }

    public consultarTodosBeneficiariosAusentes(id: number): Observable<DadoComboDTO[]> {
        return this.http.get<DadoComboDTO[]>(`${this.url}/beneficiario-processo-ausente/${id}`, this.options());
    }
}
