import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {EmpresaPrestadora} from '../../../../app/shared/models/comum/empresa-prestadora';
import {CrudHttpClientService} from '../../../../app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import {MessageService} from "../../components/messages/message.service";

@Injectable()
export class EmpresaPrestadorExternoService extends CrudHttpClientService<any> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient) {
        super('empresas-prestadoras', http, messageService);
    }

    public consultarEmpresaPorId(id: number): Observable<EmpresaPrestadora> {
        return this.http.get<EmpresaPrestadora>(this.url + "/" + id, this.options());
    }

    public consultarFiliais(): Observable<any> {
        return this.http.get(this.url + '/filiais/', this.options());
    }

    public excluirEmpresa(id: number): Observable<any> {
        return this.http.delete(this.url + '/' + id, this.options());
    }

    public consultarPorFiltro(filtro: any): Observable<EmpresaPrestadora[]> {
        console.log("public consultarPorFiltro(filtro: any)");
        console.log(this.url + '/filtro');
        console.log(filtro);
        return this.http.post<EmpresaPrestadora[]>(this.url + '/filtro', filtro, this.options());
    }

    public salvar(empresaPrestadora: EmpresaPrestadora): Observable<any> {
        return this.http.post<EmpresaPrestadora>(this.url, empresaPrestadora, this.options());
    }

    public buscarEmpresas(): Observable<any> {
        return this.http.get(this.url, this.options());
    }

}
