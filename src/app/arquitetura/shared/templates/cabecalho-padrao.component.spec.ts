import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Subject, of, throwError } from 'rxjs';
import { MessageService } from 'app/shared/components/messages/message.service';
import { SessaoService } from '../services/seguranca/sessao.service';
import { KeycloakService } from '../services/seguranca/keycloak.service';
import { AtendimentoService } from '../../../shared/services/comum/atendimento.service';
import { ProcessoService } from 'app/shared/services/comum/processo.service';
import { BeneficiarioService } from 'app/shared/services/comum/beneficiario.service';
import { CabecalhoPadraoComponent } from './cabecalho-padrao.component';
import { Atendimento } from '../../../shared/models/comum/atendimento';
import { environment } from '../../../../environments/environment';

describe('CabecalhoPadraoComponent', () => {
    let component: CabecalhoPadraoComponent;
    let fixture: ComponentFixture<CabecalhoPadraoComponent>;
    let messageService: jest.Mocked<MessageService>;
    let sessaoService: jest.Mocked<SessaoService>;
    let router: jest.Mocked<Router>;
    let keycloakService: jest.Mocked<KeycloakService>;
    let atendimentoService: jest.Mocked<AtendimentoService>;
    let processoService: jest.Mocked<ProcessoService>;
    let beneficiarioService: jest.Mocked<BeneficiarioService>;
    let onIdleStartSubject: Subject<void>;
    let onIdleTimeLimitSubject: Subject<number>;
    let onIdleEndSubject: Subject<void>;
    let onTimeoutSubject: Subject<void>;

    beforeEach(async () => {
        onIdleStartSubject = new Subject<void>();
        onIdleTimeLimitSubject = new Subject<number>();
        onIdleEndSubject = new Subject<void>();
        onTimeoutSubject = new Subject<void>();

        messageService = {
            addMsgSuccess: jest.fn(),
            addMsgDanger: jest.fn()
        } as unknown as jest.Mocked<MessageService>;

        sessaoService = {
            onIdleStart: onIdleStartSubject.asObservable(),
            onIdleTimeLimit: onIdleTimeLimitSubject.asObservable(),
            onIdleEnd: onIdleEndSubject.asObservable(),
            onTimeout: onTimeoutSubject.asObservable(),
            getUsuario: jest.fn().mockReturnValue({ perfis: [], menu: [] }),
            finalizarSessao: jest.fn(),
            publicarIdCredenciadoSelecionado: jest.fn()
        } as unknown as jest.Mocked<SessaoService>;

        router = {
            navigate: jest.fn(),
            url: '/home'
        } as unknown as jest.Mocked<Router>;

        keycloakService = {} as unknown as jest.Mocked<KeycloakService>;

        atendimentoService = {
            get: jest.fn().mockReturnValue(of(null)),
            finalizar: jest.fn().mockReturnValue(of(null))
        } as unknown as jest.Mocked<AtendimentoService>;

        processoService = {
            getUsuarioSouCaixa: jest.fn().mockReturnValue(of(null))
        } as unknown as jest.Mocked<ProcessoService>;

        beneficiarioService = {} as unknown as jest.Mocked<BeneficiarioService>;

        (SessaoService as any).usuario = { perfis: [], menu: [] };
        (AtendimentoService as any).changed = new Subject<Atendimento | null>();

        await TestBed.configureTestingModule({
            declarations: [CabecalhoPadraoComponent],
            providers: [
                { provide: MessageService, useValue: messageService },
                { provide: SessaoService, useValue: sessaoService },
                { provide: Router, useValue: router },
                { provide: KeycloakService, useValue: keycloakService },
                { provide: AtendimentoService, useValue: atendimentoService },
                { provide: ProcessoService, useValue: processoService },
                { provide: BeneficiarioService, useValue: beneficiarioService }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CabecalhoPadraoComponent);
        component = fixture.componentInstance;
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('deve inicializar versaoSistema com environment.version', () => {
        expect(component.versaoSistema).toBe(environment.version);
    });

    it('deve inicializar display como false', () => {
        expect(component.display).toBe(false);
    });

    it('isFirefoxBrowser deve retornar true quando o navegador é Firefox', () => {
        Object.defineProperty(window.navigator, 'userAgent', {
            value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0',
            configurable: true
        });

        const resultado = component.isFirefoxBrowser();

        expect(resultado).toBe(true);
    });

    it('isFirefoxBrowser deve retornar false quando o navegador não é Firefox', () => {
        Object.defineProperty(window.navigator, 'userAgent', {
            value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            configurable: true
        });

        const resultado = component.isFirefoxBrowser();

        expect(resultado).toBe(false);
    });

    it('isIntranet deve retornar true quando o realm é intranet', () => {
        jest.spyOn(KeycloakService, 'getRealm').mockReturnValue('intranet');

        const resultado = component.isIntranet();

        expect(resultado).toBe(true);
    });

    it('isIntranet deve retornar false quando o realm não é intranet', () => {
        jest.spyOn(KeycloakService, 'getRealm').mockReturnValue('external');

        const resultado = component.isIntranet();

        expect(resultado).toBe(false);
    });

    it('isIntranet deve ser case-insensitive', () => {
        jest.spyOn(KeycloakService, 'getRealm').mockReturnValue('INTRANET');

        const resultado = component.isIntranet();

        expect(resultado).toBe(true);
    });

    it('formatarMatricula deve remover caracteres não numéricos', () => {
        const resultado = component.formatarMatricula('ABC123456D');

        expect(resultado).toBe('123456');
    });

    it('formatarMatricula deve limitar a 6 caracteres', () => {
        const resultado = component.formatarMatricula('12345678');

        expect(resultado).toBe('123456');
    });

    it('formatarMatricula deve retornar null quando matricula é null', () => {
        const resultado = component.formatarMatricula(null);

        expect(resultado).toBeNull();
    });

    it('formatarMatricula deve retornar null quando matricula é undefined', () => {
        const resultado = component.formatarMatricula(undefined as any);

        expect(resultado).toBeNull();
    });

    it('encerrarAtendimento deve finalizar atendimento e navegar para home', async () => {
        atendimentoService.finalizar.mockReturnValue(of(null));

        await component.encerrarAtendimento();

        expect(atendimentoService.finalizar).toHaveBeenCalled();
        expect(messageService.addMsgSuccess).toHaveBeenCalledWith('Atendimento encerrado.');
        expect(router.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('encerrarAtendimento deve mostrar erro ao falhar', () => {
        const erro = { error: 'Erro ao encerrar' };
        atendimentoService.finalizar.mockReturnValue(throwError(() => erro));

        component.encerrarAtendimento();

        expect(messageService.addMsgDanger).toHaveBeenCalledWith('Erro ao encerrar');
    });

    it('criarSituacao deve retornar objeto com label, value e descricao', () => {
        const resultado = component.criarSituacao('Teste', 1, 'Descrição Teste');

        expect(resultado).toEqual({
            label: 'Teste',
            value: 1,
            descricao: 'Descrição Teste'
        });
    });

    it('gerarSituacoesPorIntervalo deve gerar array de situações', () => {
        const resultado = component.gerarSituacoesPorIntervalo(1, 3);

        expect(resultado.length).toBe(3);
        expect(resultado[0].value).toBe(1);
        expect(resultado[1].value).toBe(2);
        expect(resultado[2].value).toBe(3);
    });

    it('isCredenciado deve retornar false quando não há empresas operador', () => {
        sessaoService.getUsuario.mockReturnValue({ dadosPrestadorExterno: null } as any);

        const resultado = component.isCredenciado;

        expect(resultado).toBe(false);
    });

    it('isCredenciado deve retornar true quando há empresas operador', () => {
        sessaoService.getUsuario.mockReturnValue({
            dadosPrestadorExterno: {
                credenciados: [{ id: 1, nome: 'Credenciado 1' }]
            }
        } as any);

        const resultado = component.isCredenciado;

        expect(resultado).toBe(true);
    });
});
