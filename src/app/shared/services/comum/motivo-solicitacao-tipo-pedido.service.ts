import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from 'app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import {MessageService} from "../../components/messages/message.service";
import { FiltroMotivoSolicitacaoTipoPedido } from 'app/shared/models/filtro/filtro-motivo-solicitacao-tipo-pedido';
import {MotivoSolicitacaoTipoPedidoDTO} from 'app/shared/models/dto/motivo-solicitacao-tipo-pedido';
import {MotivoSolicitacaoTipoPedidoConsultaDTO} from 'app/shared/models/dto/motivo-solicitacao-tipo-pedido-consulta';
import {MotivoSolicitacaoTipoPedidoBeneficiariosDTO} from 'app/shared/models/dto/motivo-solicitacao-tipo-pedido-beneficiarios';

@Injectable()
export class MotivoSolicitacaoTipoPedidoService extends CrudHttpClientService<any> {
    private baseRota = '/motivo-solicitacao-tipo-pedido'
    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('motivo-solicitacao-tipo-pedido', http, messageService);
    }

    public consultarPorId(id: number): Observable<MotivoSolicitacaoTipoPedidoDTO> {
        return this.http.get(`${this.url}/consultarPorId/${id}`);
    }

    public consultarPorFiltro(filtro: FiltroMotivoSolicitacaoTipoPedido): Observable<MotivoSolicitacaoTipoPedidoConsultaDTO[]> {
        return this.http.post<MotivoSolicitacaoTipoPedidoConsultaDTO[]>(`${this.url}/filtro`,filtro, this.options());
    }

    public consultarPorFiltroAgrupar(filtro: FiltroMotivoSolicitacaoTipoPedido): Observable<MotivoSolicitacaoTipoPedidoBeneficiariosDTO[]> {
        return this.http.post<MotivoSolicitacaoTipoPedidoBeneficiariosDTO[]>(`${this.url}/filtro/agrupar`,filtro, this.options());
    }

    public excluirLista(ids: number[]): Observable<any> {
        return this.http.post<any>(`${this.url}/excluir/lista`, ids, this.options());
    }

    public alterarLista(motivoSolicitacaoTipoPedidoBeneficiariosDTO: MotivoSolicitacaoTipoPedidoBeneficiariosDTO): Observable<any> {
        return this.http.post<any>(`${this.url}/alterar/lista`,motivoSolicitacaoTipoPedidoBeneficiariosDTO, this.options());
    }

    getRotaBase(){
        return this.baseRota
    }

    getTitulo(){
        return 'Motivo de Solicitação Por Tipo de Pedido'
    }
}
