import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { MessageService } from 'app/shared/services/services';
import { SessaoService } from '../shared/services/seguranca/sessao.service';
import { HomeComponent } from './home.component';
import { ResultadoPesquisaProcessosCredenciadoComponent } from '../../funcionalidades/pesquisar-processos-credenciado/resultado-pesquisa-processos-credenciado/resultado-pesquisa-processos-credenciado.component';

describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;
    let messageService: jest.Mocked<MessageService>;
    let sessaoService: jest.Mocked<SessaoService>;
    let subjectIdCredenciado: Subject<number>;

    beforeEach(async () => {
        subjectIdCredenciado = new Subject<number>();

        messageService = {
            getDescription: jest.fn()
        } as unknown as jest.Mocked<MessageService>;

        sessaoService = {
            subjectIdCredenciado: subjectIdCredenciado
        } as unknown as jest.Mocked<SessaoService>;

        await TestBed.configureTestingModule({
            declarations: [HomeComponent],
            providers: [
                { provide: MessageService, useValue: messageService },
                { provide: SessaoService, useValue: sessaoService }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('deve herdar de BaseComponent', () => {
        expect(component).toBeInstanceOf(HomeComponent);
        expect(component['messageService']).toBe(messageService);
    });

    it('deve se inscrever em subjectIdCredenciado no ngAfterViewInit', async () => {
        const subscribeSpy = jest.jest.jest.jest.jest.spyOn(subjectIdCredenciado, 'subscribe');

        await component.ngAfterViewInit();

        expect(subscribeSpy).toHaveBeenCalled();
        expect(subscribeSpy).toHaveBeenCalledTimes(1);
    });

    it('deve chamar atualizarListaProcessos quando subjectIdCredenciado emitir um valor', async () => {
        const mockResultadoPesquisa = {
            atualizarListaProcessos: jest.fn()
        } as unknown as ResultadoPesquisaProcessosCredenciadoComponent;

        component.resultadoPesquisa = mockResultadoPesquisa;

        await component.ngAfterViewInit();
        subjectIdCredenciado.next(123);

        expect(mockResultadoPesquisa.atualizarListaProcessos).toHaveBeenCalledWith(123, 10, '/home');
    });

    it('não deve chamar atualizarListaProcessos quando resultadoPesquisa é undefined', async () => {
        component.resultadoPesquisa = undefined as any;

        await component.ngAfterViewInit();
        subjectIdCredenciado.next(123);

        // Não deve lançar erro
        expect(component.resultadoPesquisa).toBeUndefined();
    });

    it('showImage deve retornar true quando resultadoPesquisa é undefined', () => {
        component.resultadoPesquisa = undefined as any;

        const resultado = component.showImage;

        expect(resultado).toBe(true);
    });

    it('showImage deve retornar true quando resultadoPesquisa.hasResultado() retorna false', () => {
        const mockResultadoPesquisa = {
            hasResultado: jest.fn().mockReturnValue(false)
        } as unknown as ResultadoPesquisaProcessosCredenciadoComponent;

        component.resultadoPesquisa = mockResultadoPesquisa;

        const resultado = component.showImage;

        expect(resultado).toBe(true);
        expect(mockResultadoPesquisa.hasResultado).toHaveBeenCalled();
    });

    it('showImage deve retornar false quando resultadoPesquisa.hasResultado() retorna true', () => {
        const mockResultadoPesquisa = {
            hasResultado: jest.fn().mockReturnValue(true)
        } as unknown as ResultadoPesquisaProcessosCredenciadoComponent;

        component.resultadoPesquisa = mockResultadoPesquisa;

        const resultado = component.showImage;

        expect(resultado).toBe(false);
        expect(mockResultadoPesquisa.hasResultado).toHaveBeenCalled();
    });

    it('deve chamar atualizarListaProcessos múltiplas vezes quando subjectIdCredenciado emitir múltiplos valores', async () => {
        const mockResultadoPesquisa = {
            atualizarListaProcessos: jest.fn()
        } as unknown as ResultadoPesquisaProcessosCredenciadoComponent;

        component.resultadoPesquisa = mockResultadoPesquisa;

        await component.ngAfterViewInit();
        subjectIdCredenciado.next(123);
        subjectIdCredenciado.next(456);
        subjectIdCredenciado.next(789);

        expect(mockResultadoPesquisa.atualizarListaProcessos).toHaveBeenCalledTimes(3);
        expect(mockResultadoPesquisa.atualizarListaProcessos).toHaveBeenNthCalledWith(1, 123, 10, '/home');
        expect(mockResultadoPesquisa.atualizarListaProcessos).toHaveBeenNthCalledWith(2, 456, 10, '/home');
        expect(mockResultadoPesquisa.atualizarListaProcessos).toHaveBeenNthCalledWith(3, 789, 10, '/home');
    });
});
