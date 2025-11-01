import {EventEmitter, Injectable} from '@angular/core';
import {Router} from '@angular/router';

import {JwtHelperService} from '@auth0/angular-jwt';
import {DEFAULT_INTERRUPTSOURCES, Idle} from '@ng-idle/core';
import {MessageService} from 'app/shared/components/messages/message.service';
import {KeycloakService} from 'app/arquitetura/shared/services/seguranca/keycloak.service';
import {ConfiguracaoSegurancaService} from 'app/arquitetura/shared/services/seguranca/configuracao-seguranca.service';
import {UsuarioService} from 'app/arquitetura/shared/services/cadastrobasico/usuario.service';
import {JwtToken} from 'app/arquitetura/shared/models/seguranca/jwt-token';
import {JwtTokenClaims} from 'app/arquitetura/shared/models/seguranca/jwt-token-claims';
import {ConfiguracoesSeguranca} from 'app/arquitetura/shared/models/seguranca/configuracoes-seguranca';
import {Usuario} from 'app/arquitetura/shared/models/cadastrobasico/usuario';
import {UsuarioStorage} from 'app/arquitetura/shared/storage/usuario-storage';
import {MessageStorage} from 'app/arquitetura/shared/storage/message-storage';
import {SistemaService} from 'app/arquitetura/shared/services/sobre/sistema.service';
import {BehaviorSubject} from "rxjs";
import {AtendimentoService} from "../../../../shared/services/comum/atendimento.service";
import { UsuarioSouCaixaDTO } from "app/shared/models/comum/usuario-soucaixa-dto.model";

@Injectable()
export class SessaoService {
    static usuario: Usuario = null;
    static messageStorage = new MessageStorage();
    static configuracoesSeguranca: ConfiguracoesSeguranca = null;
    static usuarioSouCaixaDTO: UsuarioSouCaixaDTO = null;

    public onIdleStart: EventEmitter<void>;
    public onIdleTimeLimit: EventEmitter<number>;
    public onIdleEnd: EventEmitter<void>;
    public onTimeout: EventEmitter<void>;

    private jwtToken: JwtToken;
    private usuario: Usuario;
    private readonly usuarioStorage: UsuarioStorage;
    private messageStorage: MessageStorage;
    private readonly credenciadoSubject: BehaviorSubject<number>;

    constructor(
        private configuracaoSegurancaService: ConfiguracaoSegurancaService,
        private usuarioService: UsuarioService,
        private sistemaService: SistemaService,
        private idle: Idle,
        private router: Router,
        private jwtHelperService: JwtHelperService,
        private messageService: MessageService
    ) {
        // Intercepta as interrupções padrões: clicks, rolagens, etc.
        idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

        this.onIdleStart = new EventEmitter<void>();
        this.onIdleTimeLimit = new EventEmitter<number>();
        this.onIdleEnd = new EventEmitter<void>();
        this.onTimeout = new EventEmitter<void>();

        idle.onIdleStart.subscribe(() => {
            // Pergunta se quer continuar usando o sistema
            this.onIdleStart.emit();
        });
        idle.onTimeoutWarning.subscribe(
            (countdown) => {
                // Atualiza a pergunta com o tempo restante
                this.onIdleTimeLimit.emit(countdown);
            });
        idle.onIdleEnd.subscribe(() => {
            // Fecha a (janela da) pergunta anterior
            this.onIdleEnd.emit();
        });
        idle.onTimeout.subscribe(() => {
            // Fecha a (janela da) pergunta anterior e
            // redireciona para o login com uma mensagem de timeout
            this.onTimeout.emit();
        });

        this.usuarioStorage = new UsuarioStorage();
        this.messageStorage = new MessageStorage();
        this.credenciadoSubject = new BehaviorSubject(null);
    }


    /**
     * Inicializa de forma estática toda a sessão do usuário, envolvendo:
     * - Integração com o Keycloak
     * - Recuperar o usuário logado
     * - Recuperar as configurações de segurança
     *
     * Essas chamadas tem que ser feitas todas de uma vez, antes de iniciar
     * a aplicação de fato, pois, envolvem chamadas assíncronas de HTTP que,
     * se não forem resolvidas de início, impactarão na ordem de execução do
     * sistema (um código que dependa da sessão estar carregada e o usuário
     * logado devidamente identificado pode não funcionar corretamente).
     */
    static init(): Promise<{ code: number; error?: any }> {
        return new Promise((resolve) => {
            // Configurações de Segurança
            ConfiguracaoSegurancaService.get()
            .then((configuracoesSeguranca: ConfiguracoesSeguranca) => {
                SessaoService.configuracoesSeguranca = configuracoesSeguranca;

                // Keycloak
                KeycloakService.init(configuracoesSeguranca.realm,
                    configuracoesSeguranca.idCliente, configuracoesSeguranca.urlServidorAutorizacao)
                .then(() => {
                    // Usuário logado
                    UsuarioService.consultarPorLogin(KeycloakService.getUsername())
                    .then((usuario: Usuario) => {
                        SessaoService.usuario = usuario;
                        SistemaService.carregarBundleMessages()
                        .then((msgs: any) => {
                            SessaoService.messageStorage.gravar(msgs);
                            resolve({code: 0});
                        }).catch(error => resolve({code: 4, error: error}));
                    }).catch(error => resolve({code: 3, error: error}));
                }).catch(() => resolve({code: 2}));
            }).catch(() => resolve({code: 1}));
        });
    }

    public publicarIdCredenciadoSelecionado(id: number): void {
        this.credenciadoSubject.next(id);
    }

    get subjectIdCredenciado(): BehaviorSubject<number> {
        return this.credenciadoSubject;
    }

    public inicializarSessao() {
        this.finalizarSessao();

        // Grava o token recebido para usar nas próximas requisições
        this.setToken(KeycloakService.getLastRetrievedToken(), true);

        // Define as configurações de segurança
        if (SessaoService.configuracoesSeguranca.tempoVidaToken <
            this.getTokenClaims().getExpirationTime()) {
            KeycloakService.setAccessTokenLifespan(
                SessaoService.configuracoesSeguranca.tempoVidaToken);
        } else {
            KeycloakService.setAccessTokenLifespan(
                this.getTokenClaims().getExpirationTime());
        }

        // Grava o usuário (e seus dados)
        this.setUsuario(SessaoService.usuario);
    }

    /**
     * Armazena o token de acesso e inicia o controle de idle
     * de sessão.
     */
    public setToken(token: string, inicioSessao: boolean = false) {
        this.jwtToken = new JwtToken();
        this.jwtToken.token = token;
        this.inicializarControleTimeout(inicioSessao);
    }

    /**
     * Retorna o token de acesso
     */
    public getToken(): JwtToken {
        if (!this.jwtToken) {
            this.setToken(KeycloakService.getLastRetrievedToken(), true);
        }

        return this.jwtToken;
    }

    public atualizarToken(): Promise<string> {
        return new Promise(async (resolve) => {
            try {
                await KeycloakService.getToken();

                const token: string = KeycloakService.getLastRetrievedToken();
                this.setToken(token, false);

                resolve(token);
            } catch (error) {
                resolve(null);
            }
        });
    }

    /**
     * Retorna campos de informação do token
     */
    public getTokenClaims(): JwtTokenClaims {
        return this.getToken().getClaims(this.jwtHelperService);
    }

    /**
     * Armazena os dados do usuário logado
     *
     * @param usuario
     */
    public setUsuario(usuario: Usuario) {
        this.usuario = new Usuario();
        Object.assign(this.usuario, usuario);
        this.usuarioStorage.gravar(this.usuario);
    }

    /**
     * Retorna o usuário logado
     */
    public getUsuario(): Usuario {
        return this.usuario;
    }

    public getSiglaNomeUsuario(nome: string = null): string {
        if (!nome) {
            nome = this.usuario.nome || "";
        }

        const siglas = nome.split(' ').map(x => x.toUpperCase()).map(x => x.length > 0 ? x.charAt(0) : '');
        if (siglas.length >= 2) {
            return siglas[0] + siglas[1];
        } else if (siglas.length == 1) {
            return siglas[0];
        }

        return "SN";
    }

    public static getMatriculaFuncional(): string {
        return AtendimentoService.matricula || SessaoService.usuario.matriculaFuncional;
    }

    /**
     * Verifica se tem um usuário logado
     */
    public isLogado() {
        return KeycloakService.isAuthenticated();
    }

    /**
     * Roteia para o home
     */
    public rotearParaHome() {
        this.router.navigate(['/home']);
    }

    /**
     * Roteia para o logout
     */
    public rotearParaLogout() {
        KeycloakService.logout();
    }

    public verificarAutenticacao(): boolean {
        if (!this.isLogado()) {
            this.rotearParaLogout();

            return false;
        }

        return true;
    }

    /**
     * Verifica se tem o perfil informado
     * @param perfil
     */
    public validarPermissao(perfil: string): boolean {
        if (!this.isLogado()) {
            return false;
        }
        return this.usuario.hasPerfil(perfil);
    }

    /**
     * Apaga os dados da sessão e roteia para o login
     */
    public finalizarSessao(rotearParaLogin?: boolean, motivoSessaoExpirada?: boolean) {
        this.limparDadosSessao();
        this.idle.stop();
        if (rotearParaLogin) {
            KeycloakService.logout();
        }
        if (motivoSessaoExpirada) {
            this.messageService.addConfirmOk('Sua sessão expirou. Realize o login novamente.');
        }
    }

    /**
     * Inicializa o controle de timeout (idle) da sessão
     *
     * @param inicioSessao define se a sessão está necessariamente sendo criada
     */
    private inicializarControleTimeout(inicioSessao: boolean = false) {
        let timeout: number = SessaoService.configuracoesSeguranca.tempoMaximoIdle;
        if (timeout <= 0) {
            timeout = KeycloakService.getAccessTokenLifespan();
        }

        // Só reinicia a checagem de idle caso esteja vindo do login
        if (inicioSessao ||
            // ou o serviço de checagem não tenha iniciado ainda
            (!this.idle.isRunning()) ||
            // ou o tempo de duração do token (e da sessão) tenha mudado
            (this.idle.getIdle() != SessaoService.getIdleTime(timeout))) {
            this.iniciarControleTimeout(timeout);
        }
    }

    /**
     * Inicia o controle de timeout da sessão
     *
     * @param timeout
     */
    private iniciarControleTimeout(timeout: number) {
        if (timeout <= 1) {
            return;
        }

        this.idle.setIdle(SessaoService.getIdleTime(timeout));
        this.idle.setTimeout(60);
        this.idle.watch();
    }

    private static getIdleTime(timeout: number): number {
        return (timeout - 1) * 60;
    }

    /**
     * Apaga os dados da sessão
     */
    private limparDadosSessao() {
        this.jwtToken = null;
        this.usuario = null;
        this.usuarioStorage.limpar();
    }
}
