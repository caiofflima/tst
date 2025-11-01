import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from 'app/arquitetura/shared/services/crud-http-client.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {MotivoSolicitacao} from 'app/shared/models/comum/motivo-solicitacao';
import {MessageService} from "../../components/messages/message.service";
import { FiltroMotivoSolicitacao } from 'app/shared/models/filtro/filtro-motivo-solicitacao';

@Injectable()
export class MotivoSolicitacaoService extends CrudHttpClientService<any> {
    private baseRota = '/manutencao/motivo-solicitacao'
    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('motivos-solicitacao', http, messageService);
    }

    public consultarPorId(idMotivoSolicitacao: number): Observable<MotivoSolicitacao> {
        return this.get(idMotivoSolicitacao);
    }

    public consultarPorTipoProcesso(idTipoProcesso: number, idBeneficiario: number): Observable<MotivoSolicitacao[]> {
        return this.http.get<any>(`${this.url}/tipo-processo/${idTipoProcesso}/id-beneficiario/${idBeneficiario || 0}`, this.options());
    }

    public consultarPorFiltro(filtro: FiltroMotivoSolicitacao): Observable<MotivoSolicitacao[]> {
        return this.http.get<MotivoSolicitacao[]>(`${this.url}/filtro?${filtro.montarQueryString()}`, this.options());
    }

    getRotaBase(){
        return this.baseRota
    }

    getTitulo(){
        return 'Motivo de Solicitação'
    }

    public consultaPorIdtipoProcesso(idTipoProcesso: number): Observable<MotivoSolicitacao[]> {
        return this.http.get<any>(`${this.url}/tipo-processo/${idTipoProcesso}`, this.options());;
    }

    private selectedOptionSource = new BehaviorSubject<MotivoSolicitacao | null>(null);
    selectedOption$ = this.selectedOptionSource.asObservable();

    setSelectedOption(option: MotivoSolicitacao) {
        this.selectedOptionSource.next(option);
    }

}
