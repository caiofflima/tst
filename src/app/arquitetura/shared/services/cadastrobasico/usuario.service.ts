import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from '../../../../../app/arquitetura/shared/services/crud-http-client.service';
import {Usuario} from '../../../../../app/arquitetura/shared/models/cadastrobasico/usuario';
import {MessageService} from "../../../../shared/components/messages/message.service";

@Injectable()
export class UsuarioService extends CrudHttpClientService<Usuario> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('cadastrobasico/usuario', http, messageService);
    }

    /**
     * Recupera usuário pelo login de forma estática, para funcionar na
     * inicialização do sistema.
     */
    static consultarPorLogin(login: string): Promise<Usuario> {
        let url: string = UsuarioService.getBackendUrl() + 'cadastrobasico/usuario/consultar-por-login?login='
            + encodeURIComponent(login);
        return CrudHttpClientService.newGETRequest(url);
    }

    public alterarSenha() {
        return this.http.get(this.url + '/recuperar-senha', this.options());
    }

    public atualizarDados(entity) {
        return this.http.put(this.url + '/atualiza-dados', entity, this.options());
    }
}
