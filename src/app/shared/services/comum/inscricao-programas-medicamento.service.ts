import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from '../../../../app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import {MessageService} from "../../components/messages/message.service";

@Injectable()
export class InscricaoProgramasMedicamentosService extends CrudHttpClientService<any> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('inscricao-programas-medicamentos', http, messageService);
    }

    public salvar(formData: FormData): Observable<any> {
        return this.http.post(this.url, formData, this.options());
    }

    public atualizar(formData: FormData): Observable<any> {
        return this.http.put(this.url, formData, this.options());
    }
}
