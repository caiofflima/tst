import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {CrudHttpClientService} from 'app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import {ProgressoDTO} from "../../models/dto/progresso";
import {catchError} from "rxjs/operators";
import {of} from "rxjs";
import {MessageService} from "../../components/messages/message.service";
import { BeneficiarioPedido } from 'app/shared/models/comum/beneficiario-pedido';

@Injectable()
export class BeneficiarioPedidoService extends CrudHttpClientService<BeneficiarioPedido> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('beneficiario-pedido', http, messageService);
    }

    

    public consultarBeneficiarioPedido( beneficiarioPedido: BeneficiarioPedido ): Observable<BeneficiarioPedido>{
        return this.http.patch<BeneficiarioPedido>(this.url, 
                    {
                        idTipoProcesso: beneficiarioPedido.idTipoProcesso,
                        idTipoBeneficiario: beneficiarioPedido.idTipoBeneficiario
                    } , this.options())
    }

    public consultarPorFiltro(dto: BeneficiarioPedido): Observable<BeneficiarioPedido[]> {
        let params = new HttpParams();

        if (dto.idsTipoProcesso) {
            dto.idsTipoProcesso.forEach(i => params = params.append('idsTipoProcesso', i.toString()));
        }
        
        if (dto.somenteAtivos) {
            params = params.set('somenteAtivos', String(dto.somenteAtivos));
        }
      
        if (dto.tiposBeneficiario) {
            dto.tiposBeneficiario.forEach(i => params = params.append('tiposBeneficiario', i.toString()));
        }

        return this.http.get<BeneficiarioPedido[]>(this.url, this.options({params}))
    }

    public consultarPerfilAssociado(dto: BeneficiarioPedido): Observable<Number[]>{
        return this.http.patch<Number[]>(`${this.url}/perfil`, dto, this.options() )
    }

    public remover(bp: BeneficiarioPedido){
        return this.http.patch(`${this.url}/remove`, bp, this.options())
    }

    getBaseURL(){
        return '/manutencao/parametros/tipobeneficiario-tipopedido'
    }

    getTitulo(){
        return 'Tipo de Beneficiário por Tipo de Pedido'
    }
}
