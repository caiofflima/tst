import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from 'app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import {PedidoDependenteDTO} from "../../models/dto/pedido-dependente";
import {MessageService} from "../../components/messages/message.service";

@Injectable()
export class InscricaoDependenteService extends CrudHttpClientService<PedidoDependenteDTO> {

    private editMode: boolean = false;

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('dependente', http, messageService);
    }

    public findByPedido(idPedido: number): Observable<PedidoDependenteDTO> {
        return this.http.get<PedidoDependenteDTO>(`${this.url}/${idPedido}`, this.options());
    }

    public findDependenteByPedido(idPedido: number): Observable<PedidoDependenteDTO> {
        return this.http.get<PedidoDependenteDTO>(`${this.url}/findDependenteByPedido/${idPedido}`, this.options());
    }

    public salvar(formData: FormData): Observable<any> {
        return this.http.post(`${this.url}`, formData, this.options());
    }

    public cancelar(formData: FormData): Observable<any> {
        return this.http.post(`${this.url}/cancelar`, formData, this.options());
    }

    public renovar(formData: FormData): Observable<any> {
        return this.http.post(`${this.url}/renovar`, formData, this.options());
    }

    setEditMode(isEdit: boolean):void {
        this.editMode = isEdit;
    }

    isEditMode(): boolean {
        return this.editMode;
    }
}
