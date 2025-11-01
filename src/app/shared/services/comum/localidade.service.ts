import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from '../../../../app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import {Municipio} from "../../models/entidades";
import {MessageService} from "../../components/messages/message.service";

@Injectable()
export class LocalidadeService extends CrudHttpClientService<Municipio> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient) {
        super('localidades', http, messageService);
    }

    public consultarMunicipiosPorSgUF(sgUfAtendimento): Observable<any> {
        return this.http.get(`${this.url}/${sgUfAtendimento}/municipios`, this.options());
    }

    public consultarDadosComboMunicipiosMesmaUFPorIdMunicipio(idMunicipio: number): Observable<Municipio[]> {
        return this.http.get<Municipio[]>(`${this.url}/municipios-mesma-uf/municipio/${idMunicipio}`, this.options());
    }

    public consultarMunicipioPorId(idMunicipio: number): Observable<Municipio> {
        return this.http.get<Municipio>(`${this.url}/municipio/${idMunicipio}`, this.options());
    }

    public consultarMunicipiosPorUF(idEstado: number): Observable<Municipio[]> {
        return this.http.get<Municipio[]>(`${this.url}/ufs/${idEstado}/municipios`, this.options());
    }
}
