import {Injectable} from '@angular/core';
import {CrudHttpClientService, MessageService, SessaoService} from "../../services";
import {HttpClient} from "@angular/common/http";
import {Especialidade} from "../../../models/credenciados/especialidade";
import {Observable} from "rxjs";

@Injectable()
export class EspecialidadeService extends CrudHttpClientService<Especialidade> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient,
        public readonly sessaoService: SessaoService
    ) {
        super('pedido/especialidade', http, messageService);
    }

    carregarPorProcedimento(idProcedimento: number): Observable<Especialidade[]> {
        return this.http.get<Especialidade[]>(`${this.url}?idProcedimento=${idProcedimento}`)
    }

    carregarPorId(idEspecialidade: number): Observable<Especialidade> {
        return this.http.get<Especialidade>(`${this.url}/${idEspecialidade}`);
    }
}
