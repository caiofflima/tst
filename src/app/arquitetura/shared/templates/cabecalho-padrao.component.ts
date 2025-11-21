import {Component, OnDestroy, OnInit} from "@angular/core";
import {MenuItem} from "primeng/api";
import {SessaoService} from "../../../../app/arquitetura/shared/services/seguranca/sessao.service";
import {MessageService} from "../../../../app/shared/components/messages/message.service";
import {Credenciado} from "../../../shared/models/credenciados/credenciado";
import {environment} from "../../../../environments/environment";
import {AtendimentoService} from "../../../shared/services/comum/atendimento.service";
import {Atendimento} from "../../../shared/models/comum/atendimento";
import {Router} from "@angular/router";
import {Subscription, take} from "rxjs";
import { ConfiguracoesSeguranca } from "../models/seguranca/configuracoes-seguranca";
import { KeycloakService } from "../services/seguranca/keycloak.service";
import { UsuarioSouCaixaDTO } from "../../../../app/shared/models/comum/usuario-soucaixa-dto.model";
import { somenteNumeros } from "../../../../app/shared/constantes";
import {ProcessoService} from "../../../../app/shared/services/comum/processo.service";
import {HttpParams} from '@angular/common/http';
import { BeneficiarioService } from "app/shared/services/comum/beneficiario.service";

declare let jQuery: any;

@Component({
    selector: 'app-cabecalho-padrao',
    templateUrl: './cabecalho-padrao.component.html',
    styleUrls: ['./cabecalho-padrao.component.scss']
})
export class CabecalhoPadraoComponent implements OnInit, OnDestroy {
    public versaoSistema: string;
    public mensagemContinuidadeUso: string;
    public credenciadoSelecionado: Credenciado | null;
    public display: boolean = false;
    public items: any[] | null;
    private atendimentoSubject: Subscription;
    private PERFIL_TEXTO="ASC004";

    matricula: string | null;
    nome: string;
    titular: string;
    isAlcadaPermitida:boolean = false;
    usuarioSouCaixaDTO: UsuarioSouCaixaDTO;
    usarioTitular: string;
    beneficiario: any;
    sidebarExpanded: boolean = false;

    readonly REALM_INTRANET = 'intranet';

    constructor(
        readonly messageService: MessageService,
        readonly sessaoService: SessaoService,
        private readonly router: Router,
        private readonly keycloackService: KeycloakService,
        private readonly atendimentoService: AtendimentoService,
        readonly processoService: ProcessoService,
        private beneficiarioService: BeneficiarioService,
    ) {
        sessaoService.onIdleStart.subscribe(() => this.onIdleStart());
        sessaoService.onIdleTimeLimit.subscribe((countdown: number) => this.onIdleTimeLimit(countdown));
        sessaoService.onIdleEnd.subscribe(() => this.onIdleStart());
        sessaoService.onTimeout.subscribe(() => this.onTimeout());
        this.versaoSistema = environment.version;
        if (this.isCredenciado) {
            this.idCredenciadoSelecionado = this.empresasOperador[0].id;
        }
    }

    ngOnInit(): void {
        jQuery('.modal-idle').on('shown.bs.modal', function () {
            jQuery('#btnIdleSim').focus();
        });
        jQuery('.modal-logout').on('shown.bs.modal', function () {
            jQuery('#btnLogoutNao').focus();
        });

        this.montarMenuDinamico();
        this.pesquisarFuncao();
        this.matricula
        if (SessaoService.usuario.menu && SessaoService.usuario.menu.map(m => m.label).filter( m => m.includes('Atendimento'))) {
            this.atendimentoService.get().pipe(take(1)).subscribe((atendimento: any) => {
                if (atendimento) {
                    AtendimentoService.atendimento = atendimento;
                    AtendimentoService.changed.next(atendimento);
                }
            }, error => this.messageService.addMsgDanger(error.error));
    
            this.atendimentoSubject = AtendimentoService.changed.subscribe((atendimento: Atendimento | null) => {
                this.matricula = '';
                this.nome = '';
                this.titular = '';
    
                if (atendimento) {
                    this.matricula = atendimento.matricula;
                    this.nome = atendimento.nome;
                    this.titular = atendimento.titular;

                    sessionStorage.setItem('titular', this.titular);
                }
            }, error => this.messageService.addMsgDanger(error.error));
        }
       
        if (this.isFirefoxBrowser()) {
            alert('Atenção! \n\nPara funcionamento adequado do sistema, recomendamos a utilização dos navegadores Chrome ou Edge.\nEstamos trabalhando para viabilizar o uso de outros navegadores. Agradecemos sua compreensão.\n');
        }
    }

    public isFirefoxBrowser(): boolean {
        const agent = window.navigator.userAgent.toLowerCase();
        return agent.indexOf('firefox') > -1;
    }

    isIntranet() : boolean {
        return  KeycloakService.getRealm().trim().toLowerCase() == this.REALM_INTRANET;
    }

    ngOnDestroy(): void {
        this.atendimentoSubject.unsubscribe();
    }

    private montarMenuDinamico(): MenuItem[] {
        this.items = SessaoService.usuario.menu;
        return [];
    }

    /**
     * Realiza o Logout do sistema, excluindo dados armazenados por usuário
     * Obs.: pode estar vindo da tela de Idle ou da tela de Confirmação de Logout
     */
    public async logout() {
        jQuery('.modal-idle').modal('hide');
        jQuery('.modal-logout').modal('hide');
        try {
            await this.atendimentoService.finalizar().pipe(take(1)).toPromise();
        } catch (e) {
            // Continua mesmo em caso de falha.
        }
        this.sessaoService.finalizarSessao(true);
    }

    private onIdleStart() {
        this.onIdleTimeLimit();
        jQuery('.modal-idle').modal();
    }

    private onIdleTimeLimit(countdown?: number) {
        this.mensagemContinuidadeUso = 'O sistema não foi utilizado nos últimos minutos. ' +
            'Deseja continuar utilizando-o?';
        if (countdown && countdown <= 60) {
            this.mensagemContinuidadeUso += ' [' + countdown + ']';
        }
    }

    private static onIdleEnd() {
        jQuery('.modal-idle').modal('hide');
    }

    private onTimeout() {
        CabecalhoPadraoComponent.onIdleEnd();
        this.sessaoService.finalizarSessao(true, true);
    }

    get isCredenciado(): boolean {
        return (this.empresasOperador)
            && this.empresasOperador.length > 0;
    }

    get empresasOperador(): any[] {
        let usr = this.sessaoService.getUsuario();
        if (usr && usr.dadosPrestadorExterno) {
            return usr.dadosPrestadorExterno.credenciados
        }
        return [];
    }

    get idCredenciadoSelecionado(): number {
        return this.sessaoService.getUsuario()!.idCredenciadoSelecionado;
    }

    set idCredenciadoSelecionado(id: number) {
        this.sessaoService.getUsuario()!.idCredenciadoSelecionado = id;
        this.sessaoService.publicarIdCredenciadoSelecionado(id);
        this.credenciadoSelecionado = this.getCredenciado(id);
    }

    private getCredenciado(id: number): Credenciado | null {
        let filter = this.getCredenciados().filter(c => c.id == id);
        if (filter && filter.length > 0)
            return filter[0];
        return null;
    }

    private getCredenciados(): Credenciado[] {
        return this.sessaoService.getUsuario()!.dadosPrestadorExterno.credenciados;
    }

    encerrarAtendimento() {
        this.atendimentoService.finalizar().pipe(take(1)).subscribe(async () => {
            this.messageService.addMsgSuccess("Atendimento encerrado.");
            await this.router.navigate(['/home']);
        }, error => this.messageService.addMsgDanger(error.error));
    }

    public isPerfilTextoProibido(): boolean{

        if(SessaoService.usuario.perfis && SessaoService.usuario.perfis.length==1 && this.sessaoService.getUsuario()!.hasPerfil(this.PERFIL_TEXTO))
            return true;
        else 
            return false;
    }

    public textoExternoConfidencial(){
        if(this.isPerfilTextoProibido())
            return "&nbsp;";
        else    
            return "<b>Conteúdo</b> #EXTERNO.CONFIDENCIAL";
    }

    public isExibirBarraConfidencial(){
        return (this.isIntranet() || (!this.isIntranet() && !this.isPerfilTextoProibido()) );
    }

    pesquisarFuncao() {
        if(!SessaoService.usuario.perfis)
        return
        let matricula = this.formatarMatricula(SessaoService.usuario.matricula);;
        if(matricula !== null && matricula !== undefined){
          this.processoService.getUsuarioSouCaixa(matricula).subscribe(res => {
            if (res) {
                //console.log("[------------------------------ FUNCAO DO USUARIO CAIXA ------------------------------]");
                //console.log(res);
                this.usuarioSouCaixaDTO = res;
                SessaoService.usuarioSouCaixaDTO = res;
            }else{
              //console.log("Nenhum usuário encontrado. [ " + matricula+" ]");
            }
            
          }, (err) => {
            console.log(err.error);
            console.log(err.message);
            //this.messageService.addMsgDanger("Serviço temporariamente indisponível. Tente mais tarde.");
          }, () => {
            //this.stopLoading("");
          });
        }
    }

    formatarMatricula(matriculaFormatar: string | null): string | null{
        if(matriculaFormatar === null || matriculaFormatar === undefined){
          return matriculaFormatar;
        }
        let matriculaAux = somenteNumeros(matriculaFormatar);
        
        if(matriculaAux.length > 6){
          matriculaAux = matriculaAux.slice(0,-1);
        }
        return matriculaAux;
    }

    gerarSituacoesPorIntervalo(ini:number, fim:number):any{
        let situacoes:any[] = [];
        for(let i = ini; i <= fim; i++){
          situacoes.push(this.criarSituacao("", i, ""));
        }
        return situacoes;
    }

    criarSituacao(rotulo: string, valor: number, desc: string):any{
        let situacao = {
            label: rotulo,
            value: valor,
            descricao: desc,
        }
        return situacao;
    }

    toggleSidebar(): void {
        this.sidebarExpanded = !this.sidebarExpanded;
    }

    closeSidebar(): void {
        this.sidebarExpanded = false;
    }
}
