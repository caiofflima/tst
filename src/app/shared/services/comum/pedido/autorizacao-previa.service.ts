import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from 'app/arquitetura/shared/services/crud-http-client.service';
import {Pedido} from 'app/shared/models/comum/pedido';
import {Observable} from 'rxjs';
import {FileUploadService} from "../file-upload.service";
import {MessageService} from "../../../components/messages/message.service";
import { Subject } from 'rxjs';

@Injectable()
export class AutorizacaoPreviaService extends CrudHttpClientService<Pedido> {
    escutaAutorizacaoPrevia = new Subject()
    constructor(
        override readonly messageService: MessageService,
        override readonly http: HttpClient,
        private readonly fileUploadService: FileUploadService
    ) {
        super('pedido/autorizacao-previa', http, messageService);
    }

    public incluirNovo(autorizacaoPrevia: any): Observable<any> {
        return this.http.post(this.url + '/', autorizacaoPrevia, this.options());
    }

    public atualizarSituacaoProcesso(idPedido: number, idSituacaoProcesso: number): Observable<Pedido> {
        return this.http.put<Pedido>(this.url + '/pedido/' + idPedido + '/situacao-processo/' + idSituacaoProcesso, this.options());
    }

    public liberarProcessoParaAnalise(idPedido: number): Observable<any> {
        return this.http.put(this.url + '/pedido/' + idPedido + '/liberado-para-analise/', this.options());
    }

    public incluirPedidoModoRascunho(value: any): Observable<any> {
        const idBeneficiario = value.beneficiario.id;
        const idTipoProcesso = value.tipoProcesso.id;
        const idMotivoSolicitacao = value.idMotivoSolicitacao;
        const idCredenciado = value.idCredenciado;
        if ((idCredenciado))
            return this.http.put(this.url + '/rascunho/' + idBeneficiario + '/' + idTipoProcesso + '/' + idMotivoSolicitacao + '/' + idCredenciado, this.options());
        else
            return this.http.put(this.url + '/rascunho/' + idBeneficiario + '/' + idTipoProcesso + '/' + idMotivoSolicitacao, this.options());
    }

    public atualizar(pedido: any): Observable<any> {
        return this.put(pedido);
    }

    public cancelarPedido(idPedido: number): Observable<any> {
        return this.http.put(this.url + '/cancelar/' + idPedido, this.options());
    }

    public consultarPorId(idPedido: number): Observable<Pedido> {
        return this.get(idPedido) as Observable<Pedido>;
    }

    consultarPorIdBeneficiarioAndIdProcedimento(idBeneficiario: number, idProcedimento: number, naoWeb = false) : Observable<any>  {
        return this.http.get(`${this.url}/consultar-por-beneficiario-and-procedimento?idBeneficiario=${idBeneficiario}&idProcedimento=${idProcedimento}&naoWeb=${naoWeb}`, this.options());
    }

    verificarAutorizacoesComDataAtentimentoValida(idAutorizacao: number, dataAtendimento: string) : Observable<any>  {
        return this.http.get(this.url + '/idAutorizacao/' + idAutorizacao + '/dataAtendimento/' + dataAtendimento, this.options());
    }

    public upload(formData: FormData): Observable<any> {
        formData.append("processadorUpload", "autorizacaoPrevia");
        formData.append("tipoUpload", "");
        return this.fileUploadService.realizarUpload(formData);
    }

    setModificaAutorizacaoPrevia(params: any){
        this.escutaAutorizacaoPrevia.next(params)
    }

}
