import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {Util} from "../../../../arquitetura/shared/util/util";
import {of} from "rxjs";

import {Medicamento} from "../../../models/comum/medicamento";
import {CrudHttpClientService, MessageService, SessaoService} from "../../services";
import {FiltroConsultaMedicamento} from 'app/shared/models/filtro/filtro-consulta-medicamento';

@Injectable()
export class MedicamentoService extends CrudHttpClientService<Medicamento> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient,
        public readonly sessaoService: SessaoService
    ) {
        super('medicamentos', http, messageService);
    }

    carregarPor(laboratorioId: number = null, idPatologia: number = null, value = 0): Observable<Medicamento[]> {
        let httpParams = new HttpParams();
        if (laboratorioId) {
            httpParams = httpParams.set('laboratorioId', String(laboratorioId));
        }
        if (idPatologia) {
            httpParams = httpParams.set('idPatologia', String(idPatologia));
        }

        return this.http.get(`${this.url}/buscarMedicamentoPor`, {params: httpParams}).pipe(
            map(Util.removeDuplicateByKey('nome', value))
        )
    }

    carregarPorPatologia(idPatologia: number): Observable<Medicamento[]> {
        return this.http.get<Medicamento[]>(`${this.url}/${idPatologia}/patologia`, this.options());
    }

    carregarApresentacao(medicamentoId: number, idPatologia: number): Observable<Medicamento[]> {
        if (medicamentoId) {
            const options = {
                params: new HttpParams().set("idPatologia", String(idPatologia))
            }

            return this.http.get<Medicamento[]>(`${this.url}/${medicamentoId}/apresentacoes`, options);
        }

        return of();
    }

    carregarApresentacaoCoMedicamento(coMedicamento: string, idPatologia: number, idLaboratorio: number): Observable<Medicamento[]> {
        if (coMedicamento!==null && coMedicamento!==undefined ) {
            const options = {
                params: new HttpParams().set("idPatologia", String(idPatologia)).set("idLaboratorio", String(idLaboratorio))
            }

            let url:string=`${this.url}/${coMedicamento}/apresentacoes/coMedicamento`;

            return this.http.get<Medicamento[]>(url, options);
        }

        return of();
    }

    public consultarTodos(): Observable<Medicamento[]> {
        return this.http.get<Medicamento[]>(`${this.url}/buscarMedicamentoPor`, this.options());
    }

    public consultarTodosMedicamentosAtivos(isAtivos: boolean): Observable<Medicamento[]> {
        return this.http.get<Medicamento[]>(`${this.url}/consultarTodosMedicamentosAtivos/${isAtivos}`, this.options());
    }
    public consultar(valor: string): Observable<Medicamento[]> {
        return this.http.get<Medicamento[]>(`${this.url}/filtro/${valor}`, this.options());
    }

    public consultarPorId(valor: number): Observable<Medicamento> {
        return this.http.get<Medicamento>(`${this.url}/${valor}`, this.options());
    }

    public consultarPorFiltro(filtroConsultaMedicamento: FiltroConsultaMedicamento): Observable<Medicamento[]> {

        return this.http.post<Medicamento[]>(this.url+"/filtro-medicamento", filtroConsultaMedicamento, this.options());
    }

    public excluir(idMedicamento: number): Observable<any> {
        return this.http.delete(`${this.url}/${idMedicamento}`, this.options());
    }

    public consultarMedicamentoPorId(id: number): Observable<Medicamento> {
        return this.http.get<Medicamento>(this.url + '/medicamento/' + id, this.options());
    }
}
