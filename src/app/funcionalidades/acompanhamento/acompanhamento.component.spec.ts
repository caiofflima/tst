import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';
import { ProcessoService } from '../../shared/services/comum/processo.service';
import { Pedido } from '../../shared/models/comum/pedido';
import { PedidoProcedimento } from '../../shared/models/entidades';
import { AcompanhamentoComponent } from './acompanhamento.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AcompanhamentoComponent', () => {
    let component: AcompanhamentoComponent;
    let fixture: ComponentFixture<AcompanhamentoComponent>;
    let processoService: jest.Mocked<ProcessoService>;
    let activatedRoute: any;
    let paramMapSubject: Subject<any>;

    beforeEach(async () => {
        paramMapSubject = new Subject<any>();

        processoService = {
            consultarPorId: jest.fn()
        } as unknown as jest.Mocked<ProcessoService>;

        activatedRoute = {
            paramMap: paramMapSubject.asObservable()
        };

        await TestBed.configureTestingModule({
            imports: [NoopAnimationsModule],
            declarations: [AcompanhamentoComponent],
            providers: [
                { provide: ProcessoService, useValue: processoService },
                { provide: ActivatedRoute, useValue: activatedRoute }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AcompanhamentoComponent);
        component = fixture.componentInstance;
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('deve inicializar processo como novo Pedido', () => {
        expect(component.processo).toBeInstanceOf(Pedido);
    });

    it('deve inicializar porcentagem como 0', () => {
        expect(component.porcentagem).toBe(0);
    });

    it('deve buscar processo por ID da rota no ngOnInit', () => {
        const mockPedido: Pedido = { id: 123, numero: 'PED-001' } as Pedido;
        processoService.consultarPorId.mockReturnValue(of(mockPedido));

        fixture.detectChanges(); // Chama ngOnInit

        paramMapSubject.next({ get: (key: string) => '123' });

        expect(processoService.consultarPorId).toHaveBeenCalledWith(123);
    });

    it('deve atualizar processo quando receber dados da rota', (done) => {
        const mockPedido: Pedido = { id: 123, numero: 'PED-001' } as Pedido;
        processoService.consultarPorId.mockReturnValue(of(mockPedido));

        fixture.detectChanges();

        paramMapSubject.next({ get: (key: string) => '123' });

        setTimeout(() => {
            expect(component.processo).toEqual(mockPedido);
            done();
        }, 100);
    });

    it('goToTop deve chamar window.scrollTo com 0, 0', () => {
        const scrollToSpy = jest.jest.jest.spyOn(window, 'scrollTo').mockImplementation();

        component.goToTop();

        expect(scrollToSpy).toHaveBeenCalledWith(0, 0);

        scrollToSpy.mockRestore();
    });

    it('increase deve aumentar porcentagem em 10', () => {
        component.porcentagem = 0;

        component.increase();

        expect(component.porcentagem).toBe(10);
    });

    it('increase deve acumular porcentagem corretamente', () => {
        component.porcentagem = 20;

        component.increase();
        component.increase();

        expect(component.porcentagem).toBe(40);
    });

    it('setColor deve retornar "#17A2B8" quando porcentagem é 0', () => {
        component.porcentagem = 0;

        const cor = component.setColor();

        expect(cor).toBe('#17A2B8');
    });

    it('setColor deve retornar "#17A2B8" quando porcentagem é 50', () => {
        component.porcentagem = 50;

        const cor = component.setColor();

        expect(cor).toBe('#17A2B8');
    });

    it('setColor deve retornar "orange" quando porcentagem é 51', () => {
        component.porcentagem = 51;

        const cor = component.setColor();

        expect(cor).toBe('orange');
    });

    it('setColor deve retornar "orange" quando porcentagem é 80', () => {
        component.porcentagem = 80;

        const cor = component.setColor();

        expect(cor).toBe('orange');
    });

    it('setColor deve retornar "red" quando porcentagem é 81', () => {
        component.porcentagem = 81;

        const cor = component.setColor();

        expect(cor).toBe('red');
    });

    it('setColor deve retornar "red" quando porcentagem é 100', () => {
        component.porcentagem = 100;

        const cor = component.setColor();

        expect(cor).toBe('red');
    });

    it('pedidoProcedimentosAtualizados deve receber array de PedidoProcedimento', () => {
        const consoleSpy = jest.jest.jest.spyOn(console, 'log').mockImplementation();
        const mockProcedimentos: PedidoProcedimento[] = [
            { id: 1 } as PedidoProcedimento,
            { id: 2 } as PedidoProcedimento
        ];

        component.pedidoProcedimentosAtualizados(mockProcedimentos);

        expect(consoleSpy).toHaveBeenCalledWith('pedidoProcedimentosAtualizados');

        consoleSpy.mockRestore();
    });
});
