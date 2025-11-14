import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DadosProcessoCardComponent } from './dados-processo-card.component';
import { CampoVazioHifen } from '../../../shared/pipes/campo-vazio.pipe';

describe('DadosProcessoCardComponent', () => {
    let component: DadosProcessoCardComponent;
    let fixture: ComponentFixture<DadosProcessoCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DadosProcessoCardComponent, CampoVazioHifen]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DadosProcessoCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('deve inicializar observacao como string vazia', () => {
        expect(component.observacao).toBe('');
    });

    it('deve aceitar processo como Input', () => {
        const mockProcesso = {
            id: 123,
            numero: 'PROC-001',
            status: 'Ativo'
        };

        component.processo = mockProcesso;

        expect(component.processo).toEqual(mockProcesso);
    });

    it('processo Input deve aceitar qualquer tipo', () => {
        const mockProcesso = {
            customField: 'valor customizado',
            anotherField: 999
        };

        component.processo = mockProcesso;

        expect(component.processo.customField).toBe('valor customizado');
        expect(component.processo.anotherField).toBe(999);
    });

    it('goToTop deve chamar window.scrollTo com 0, 0', () => {
        const scrollToSpy = jest.jest.jest.spyOn(window, 'scrollTo').mockImplementation();

        component.goToTop();

        expect(scrollToSpy).toHaveBeenCalledWith(0, 0);

        scrollToSpy.mockRestore();
    });

    it('goToTop deve rolar para o topo da página', () => {
        const scrollToSpy = jest.jest.jest.spyOn(window, 'scrollTo').mockImplementation();

        component.goToTop();

        expect(scrollToSpy).toHaveBeenCalledTimes(1);
        expect(scrollToSpy).toHaveBeenCalledWith(0, 0);

        scrollToSpy.mockRestore();
    });

    it('observacao deve permitir atualização', () => {
        component.observacao = 'Nova observação';

        expect(component.observacao).toBe('Nova observação');
    });

    it('observacao deve aceitar string vazia', () => {
        component.observacao = 'Texto qualquer';
        component.observacao = '';

        expect(component.observacao).toBe('');
    });

    it('observacao deve aceitar strings longas', () => {
        const textoLongo = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(10);

        component.observacao = textoLongo;

        expect(component.observacao).toBe(textoLongo);
        expect(component.observacao.length).toBeGreaterThan(100);
    });
});
