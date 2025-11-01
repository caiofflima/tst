import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {CrudHttpClientService} from '../../../../app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import {PerfilPrestadorEmpresaSaveDTO} from '../../../../app/shared/models/dto/perfil-prestador-empresa-save';
import {MessageService} from "../../components/messages/message.service";

@Injectable()
export class PerfilUsuarioExternoService extends CrudHttpClientService<any> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('perfis-prestadores-empresas', http, messageService);
    }

    public consultarPorFiltro(filtro: any): Observable<any> {
        return this.http.post(this.url + '/consulta/filtro/', filtro, this.options());
    }

    public salvar(perfilprestador: PerfilPrestadorEmpresaSaveDTO): Observable<any> {
        return this.http.post(this.url, perfilprestador, this.options());
    }

    public removerCredenciais(perfisPrestadoresEmpresas: any[]): Observable<any> {
        return this.http.post(this.url + '/remover-credenciais', perfisPrestadoresEmpresas, this.options());
    }
}
