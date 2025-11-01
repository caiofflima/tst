import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {CrudHttpClientService} from '../../../../app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import {Email} from '../../../../app/shared/models/comum/email';
import {FiltroConsultaEmail} from '../../../../app/shared/models/filtro/filtro-consulta-email';
import {Pageable} from "../../components/pageable.model";
import {MessageService} from "../../components/messages/message.service";

@Injectable()
export class EmailService extends CrudHttpClientService<Email> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('emails', http, messageService);
    }

    public consultar(filtro: FiltroConsultaEmail, limit: number, offset: number): Observable<Pageable<Email>> {
        let params = new HttpParams();

        if (limit) {
            params = params.set('limit', limit.toString());
        }
        if (offset) {
            params = params.set('offset', offset.toString());
        }

        this.converterVariaveisParaArray(filtro);
        
        return this.http.post<Pageable<Email>>(this.url + '/consultar', filtro, this.options({params}));
    }

    public consultarPorId(idEmail: number): Observable<Email> {
        return this.http.get<Email>(this.url + '/' + idEmail, this.options());
    }

    converterParaArray(valor: any): any[] {   
		return valor !== null && valor !== undefined && !Array.isArray(valor) ? [valor] : valor; 
	} 
	
	converterVariaveisParaArray(filtro: FiltroConsultaEmail) {   
		filtro.situacoesProcesso = this.converterParaArray(filtro.situacoesProcesso);   
		filtro.tiposProcesso = this.converterParaArray(filtro.tiposProcesso);   
		filtro.tiposBeneficiario = this.converterParaArray(filtro.tiposBeneficiario);   
	}

}
