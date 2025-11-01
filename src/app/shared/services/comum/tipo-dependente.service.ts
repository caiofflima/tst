import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from '../../../../app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import {of} from "rxjs";
import {TipoDependente} from '../../../../app/shared/models/comum/tipo-dependente';
import {MessageService} from "../../components/messages/message.service";
import {TipoBeneficiarioDTO} from '../../../../app/shared/models/dto/tipo-beneficiario';
                           
@Injectable()
export class TipoDependenteService extends CrudHttpClientService<TipoDependente> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('tipos-dependente', http, messageService);
    }

    public consultarTodos(titular: boolean = true, matricula, inclusao, idTipoProcesso?: number): Observable<TipoDependente[]> {
        return this.http.get<TipoDependente[]>(
            `${this.url}?titular=${titular}&matricula=${matricula}&inclusao=${inclusao}${idTipoProcesso ? '&idTipoProcesso=' + idTipoProcesso : ''}`, 
            this.options());
    }

    public consultarTodosIdBeneficiario(titular: boolean = true, idBeneficiario, inclusao): Observable<TipoDependente[]> {
        return this.http.get<TipoDependente[]>(`${this.url}/beneficiario/${titular}/${idBeneficiario}/${inclusao}`, this.options());
    }

    public consultarPorRelacao(idTipoBeneficiario?: number): any {
        if (idTipoBeneficiario) {
            return this.http.get<TipoDependente[]>(`${this.url}/${idTipoBeneficiario}`, this.options());
        } else {
            of(null);
        }
    }

    public consultarTipoDependente(idTipoBeneficiario: number): Observable<TipoBeneficiarioDTO> {
        return this.http.get<TipoBeneficiarioDTO>(`${this.url}/consultarTipoDependente/${idTipoBeneficiario}`, this.options());
    }
}
